"use server";

import { redirect } from "next/navigation";
import { logger } from "@/lib/privacy";
import { validateCSRF } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizeInput } from "@/lib/security/sanitization";
import { createSession, getSession, updateSession } from "@/lib/session";
import {
  economicStepSchema,
  educationTransportStepSchema,
  familyStepSchema,
  healthStepSchema,
  locationStepSchema,
  personalInfoStepSchema,
  userProfileSchema,
} from "@/lib/validation";
import type { UserSession } from "@/types";

// Rate limiting configuration
const FORM_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 form submissions per window
};

// Step validation schemas mapping
const stepSchemas = {
  "personal-info": personalInfoStepSchema,
  location: locationStepSchema,
  economic: economicStepSchema,
  family: familyStepSchema,
  "education-transport": educationTransportStepSchema,
  health: healthStepSchema,
} as const;

/**
 * Server action to process form step data
 */
export async function processFormStep(
  stepId: string,
  formData: FormData,
  sessionId?: string,
) {
  try {
    // Rate limiting check
    const clientId = formData.get("clientId") as string;
    if (!clientId) {
      throw new Error("Client ID is required");
    }

    const rateLimitResult = await rateLimit(clientId, FORM_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(
          rateLimitResult.resetTime / 1000,
        )} seconds`,
      );
    }

    // CSRF validation
    const csrfToken = formData.get("csrfToken") as string;
    if (!validateCSRF(csrfToken)) {
      throw new Error("Invalid CSRF token");
    }

    // Get validation schema for the step
    const schema = stepSchemas[stepId as keyof typeof stepSchemas];
    if (!schema) {
      throw new Error("Invalid step ID");
    }

    // Extract and sanitize form data
    const rawData: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "csrfToken" && key !== "clientId") {
        rawData[key] = sanitizeInput(value as string);
      }
    }

    // Convert string values to appropriate types based on step
    const processedData = processStepData(stepId, rawData);

    // Validate the processed data
    const validatedData = schema.parse(processedData);

    // Get or create session
    let session: UserSession;
    if (sessionId) {
      session = await getSession(sessionId);
      if (!session) {
        throw new Error("Invalid session");
      }
    } else {
      session = await createSession();
    }

    // Update session with step data
    const updatedProfile = { ...session.profile, ...validatedData };
    await updateSession(session.id, { profile: updatedProfile });

    // Return success response
    return {
      success: true,
      sessionId: session.id,
      nextStep: getNextStep(stepId),
      data: validatedData,
    };
  } catch (error) {
    // Extract clientId safely for logging
    const clientId = (formData.get("clientId") as string) || "unknown";
    logger.error(
      "Form step processing error",
      { stepId, error: error instanceof Error ? error.message : String(error) },
      clientId,
      "form_processing",
    );

    // Return sanitized error message
    const errorMessage =
      error instanceof Error ? error.message : "Processing failed";
    return {
      success: false,
      error: sanitizeErrorMessage(errorMessage),
    };
  }
}

/**
 * Server action to complete the assessment and redirect to processing
 */
export async function completeAssessment(
  sessionId: string,
  formData: FormData,
) {
  try {
    // Rate limiting check
    const clientId = formData.get("clientId") as string;
    if (!clientId) {
      throw new Error("Client ID is required");
    }

    const rateLimitResult = await rateLimit(clientId, FORM_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      throw new Error("Rate limit exceeded");
    }

    // CSRF validation
    const csrfToken = formData.get("csrfToken") as string;
    if (!validateCSRF(csrfToken)) {
      throw new Error("Invalid CSRF token");
    }

    // Get session and validate complete profile
    const session = await getSession(sessionId);
    if (!session) {
      throw new Error("Invalid session");
    }

    // Validate complete user profile
    const validatedProfile = userProfileSchema.parse(session.profile);

    // Update session with validated profile
    await updateSession(sessionId, { profile: validatedProfile });

    // Redirect to processing page
    redirect(`/processing?session=${sessionId}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw redirect errors
    }

    // Extract clientId safely for logging
    const clientId = (formData.get("clientId") as string) || "unknown";
    logger.error(
      "Assessment completion error",
      {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      },
      clientId,
      "assessment_completion",
    );

    return {
      success: false,
      error: sanitizeErrorMessage(
        error instanceof Error ? error.message : "Completion failed",
      ),
    };
  }
}

/**
 * Process step data based on step type
 */
function processStepData(
  stepId: string,
  rawData: Record<string, unknown>,
): Record<string, unknown> {
  const processed = { ...rawData };

  switch (stepId) {
    case "personal-info":
      if (processed.age) {
        processed.age = Number(processed.age);
      }
      break;

    case "family":
      if (processed.hasChildren) {
        processed.hasChildren = processed.hasChildren === "true";
      }
      if (
        processed.childrenAges &&
        typeof processed.childrenAges === "string"
      ) {
        processed.childrenAges = processed.childrenAges
          .split(",")
          .map((age) => Number(age.trim()))
          .filter((age) => !Number.isNaN(age));
      }
      break;

    case "education-transport":
      if (
        processed.transportationMode &&
        typeof processed.transportationMode === "string"
      ) {
        processed.transportationMode = processed.transportationMode.split(",");
      }
      break;

    case "health":
      if (
        processed.healthConditions &&
        typeof processed.healthConditions === "string"
      ) {
        processed.healthConditions = processed.healthConditions
          .split(",")
          .map((condition) => condition.trim())
          .filter((condition) => condition.length > 0);
      }
      break;
  }

  return processed;
}

/**
 * Get the next step in the form flow
 */
function getNextStep(currentStep: string): string | null {
  const stepOrder = [
    "personal-info",
    "location",
    "economic",
    "family",
    "education-transport",
    "health",
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === stepOrder.length - 1) {
    return null; // Last step or invalid step
  }

  return stepOrder[currentIndex + 1];
}

/**
 * Sanitize error messages to prevent information leakage
 */
function sanitizeErrorMessage(message: string): string {
  // Remove sensitive information from error messages
  const sanitized = message
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]") // IP addresses
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]") // Email addresses
    .replace(/\b\d{4,}\b/g, "[NUMBER]") // Long numbers
    .replace(/\/[^\s]+/g, "[PATH]"); // File paths

  // Return generic message for sensitive errors
  if (sanitized.includes("database") || sanitized.includes("connection")) {
    return "Service temporarily unavailable";
  }

  return sanitized;
}
