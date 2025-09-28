import { createDefaultAIService } from "./service";
import { createSummaryGenerator } from "@/lib/summary/generator";
import type { UserProfile, PersonalizedSummary } from "@/types";

/**
 * Generate personalized summary for a user profile
 * This is a wrapper function that integrates the AI service with the summary generator
 */
export async function generatePersonalizedSummary(
  userProfile: UserProfile,
  options?: { retry?: boolean }
): Promise<PersonalizedSummary> {
  const aiService = createDefaultAIService();
  const summaryGenerator = createSummaryGenerator(aiService);
  
  const result = await summaryGenerator.generateSummary(userProfile, {
    includeDetailedAnalysis: !options?.retry, // Use simpler analysis on retry
    maxRecommendations: 5,
    language: "en",
  });
  
  // Convert from summary generator format to expected format
  const summary: PersonalizedSummary = {
    overallScore: result.summary.overallScore,
    relevantAreas: result.summary.relevantAreas.map(area => ({
      category: area.category,
      title: area.title,
      relevanceScore: area.relevanceScore,
      summary: area.summary,
      details: area.details,
      actionItems: area.actionItems,
      impact: area.impact,
    })),
    majorUpdates: result.summary.majorUpdates.map(update => ({
      id: update.id,
      title: update.title,
      description: update.description,
      relevanceToUser: update.relevanceToUser,
      timeline: update.timeline,
      impact: (update.impact === "high" || update.impact === "medium" || update.impact === "low") 
        ? update.impact 
        : "medium" as const,
    })),
    recommendations: result.summary.recommendations.map(rec => ({
      id: rec.id,
      title: rec.title,
      description: rec.description,
      actionSteps: rec.actionSteps,
      priority: rec.priority,
      category: rec.category,
    })),
    generatedAt: result.summary.generatedAt,
  };
  
  return summary;
}