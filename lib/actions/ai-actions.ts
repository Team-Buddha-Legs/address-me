"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession, updateSession } from "@/lib/session";
import { generatePersonalizedSummary } from "@/lib/ai";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizeInput } from "@/lib/security/sanitization";
import { validateCSRF } from "@/lib/security/csrf";
import { logger } from "@/lib/privacy";
import type { PersonalizedSummary } from "@/types";
import { input } from "framer-motion/client";

// Rate limiting configuration for AI requests
const AI_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 AI requests per hour per user
};

// Input validation schema for AI generation
const generateSummarySchema = z.object({
  sessionId: z.string().min(1),
  clientId: z.string().min(1),
  csrfToken: z.string().min(1),
});

/**
 * Server action to generate personalized summary using AI
 */
export async function generateSummary(formData: FormData) {
  try {
    // Extract and validate input data
    const rawInput = {
      sessionId: formData.get("sessionId") as string,
      clientId: formData.get("clientId") as string,
      csrfToken: formData.get("csrfToken") as string,
    };

    const input = generateSummarySchema.parse(rawInput);

    // Rate limiting check
    const rateLimitResult = await rateLimit(input.clientId, AI_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      throw new Error(
        `AI generation rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.resetTime / 60000)} minutes`,
      );
    }

    // CSRF validation
    if (!validateCSRF(input.csrfToken)) {
      throw new Error("Invalid CSRF token");
    }

    // Get session and validate user profile
    const session = await getSession(input.sessionId);
    if (!session) {
      throw new Error("Invalid session");
    }

    if (!session.profile) {
      throw new Error("User profile not found");
    }

    // Generate personalized summary
    const startTime = Date.now();
    const summary = await generatePersonalizedSummary(session.profile);
    const duration = Date.now() - startTime;

    // Validate generated summary
    const validatedSummary = validateSummaryOutput(summary);

    // Log successful generation (anonymized)
    logger.logSummaryGeneration(session.profile, validatedSummary, input.sessionId, duration);

    // Update session with generated summary
    await updateSession(input.sessionId, { summary: validatedSummary });

    // Redirect to report page
    redirect(`/report/${input.sessionId}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw redirect errors
    }

    // Extract clientId safely for logging
    const clientId = (typeof input !== 'undefined' && input.clientId) || "unknown";
    logger.error("AI summary generation error", { error: error instanceof Error ? error.message : String(error) }, clientId, "ai_generation");
    
    // Return sanitized error response
    return {
      success: false,
      error: sanitizeAIError(error instanceof Error ? error.message : "AI generation failed"),
    };
  }
}

/**
 * Server action to retry AI generation with different parameters
 */
export async function retryGeneration(sessionId: string, formData: FormData) {
  try {
    // Extract and validate input
    const clientId = formData.get("clientId") as string;
    const csrfToken = formData.get("csrfToken") as string;

    if (!clientId || !csrfToken) {
      throw new Error("Missing required parameters");
    }

    // Rate limiting check (more restrictive for retries)
    const retryRateLimit = {
      windowMs: 30 * 60 * 1000, // 30 minutes
      maxRequests: 2, // 2 retries per 30 minutes
    };

    const rateLimitResult = await rateLimit(`retry_${clientId}`, retryRateLimit);
    if (!rateLimitResult.allowed) {
      throw new Error("Retry rate limit exceeded");
    }

    // CSRF validation
    if (!validateCSRF(csrfToken)) {
      throw new Error("Invalid CSRF token");
    }

    // Get session
    const session = await getSession(sessionId);
    if (!session || !session.profile) {
      throw new Error("Invalid session or missing profile");
    }

    // Clear previous summary and regenerate
    await updateSession(sessionId, { summary: undefined });
    
    // Generate new summary with retry flag
    const summary = await generatePersonalizedSummary(session.profile, { retry: true });
    const validatedSummary = validateSummaryOutput(summary);

    // Update session with new summary
    await updateSession(sessionId, { summary: validatedSummary });

    return {
      success: true,
      message: "Summary regenerated successfully",
    };
  } catch (error) {
    logger.error("AI retry generation error", { sessionId, error: error instanceof Error ? error.message : String(error) }, clientId, "ai_retry");
    
    return {
      success: false,
      error: sanitizeAIError(error instanceof Error ? error.message : "Retry failed"),
    };
  }
}

/**
 * Validate AI-generated summary output
 */
function validateSummaryOutput(summary: PersonalizedSummary): PersonalizedSummary {
  // Validate overall score
  if (summary.overallScore < 70 || summary.overallScore > 100) {
    throw new Error("Invalid overall score generated");
  }

  // Validate required fields
  if (!summary.relevantAreas || summary.relevantAreas.length === 0) {
    throw new Error("No relevant policy areas generated");
  }

  if (!summary.recommendations || summary.recommendations.length === 0) {
    throw new Error("No recommendations generated");
  }

  // Sanitize text content
  const sanitizedSummary: PersonalizedSummary = {
    ...summary,
    relevantAreas: summary.relevantAreas.map(area => ({
      ...area,
      title: sanitizeInput(area.title),
      summary: sanitizeInput(area.summary),
      details: sanitizeInput(area.details),
      actionItems: area.actionItems.map(item => sanitizeInput(item)),
    })),
    majorUpdates: summary.majorUpdates.map(update => ({
      ...update,
      title: sanitizeInput(update.title),
      description: sanitizeInput(update.description),
      relevanceToUser: sanitizeInput(update.relevanceToUser),
      timeline: sanitizeInput(update.timeline),
    })),
    recommendations: summary.recommendations.map(rec => ({
      ...rec,
      title: sanitizeInput(rec.title),
      description: sanitizeInput(rec.description),
      actionSteps: rec.actionSteps.map(step => sanitizeInput(step)),
    })),
  };

  return sanitizedSummary;
}

/**
 * Sanitize AI-related error messages
 */
function sanitizeAIError(message: string): string {
  // Remove sensitive AI provider information
  const sanitized = message
    .replace(/api[_-]?key/gi, "[API_KEY]")
    .replace(/token/gi, "[TOKEN]")
    .replace(/\b[A-Za-z0-9]{20,}\b/g, "[KEY]") // Long alphanumeric strings (likely keys)
    .replace(/https?:\/\/[^\s]+/g, "[URL]") // URLs
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]"); // IP addresses

  // Return generic messages for specific error types
  if (sanitized.toLowerCase().includes("rate limit")) {
    return "AI service temporarily unavailable due to high demand";
  }

  if (sanitized.toLowerCase().includes("authentication") || 
      sanitized.toLowerCase().includes("unauthorized")) {
    return "AI service configuration error";
  }

  if (sanitized.toLowerCase().includes("timeout") || 
      sanitized.toLowerCase().includes("network")) {
    return "AI service temporarily unavailable";
  }

  return sanitized;
}