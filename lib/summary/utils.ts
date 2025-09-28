import type { PolicyCategory } from "@/lib/policy/types";
import type { PersonalizedSummary, PolicyArea, Recommendation } from "./types";

/**
 * Utility functions for summary processing and formatting
 */

/**
 * Filter policy areas by category
 */
export function filterPolicyAreasByCategory(
  areas: PolicyArea[],
  categories: PolicyCategory[],
): PolicyArea[] {
  return areas.filter((area) => categories.includes(area.category));
}

/**
 * Sort policy areas by relevance score
 */
export function sortPolicyAreasByRelevance(areas: PolicyArea[]): PolicyArea[] {
  return [...areas].sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get high-impact policy areas
 */
export function getHighImpactAreas(areas: PolicyArea[]): PolicyArea[] {
  return areas.filter((area) => area.impact === "high");
}

/**
 * Get recommendations by priority
 */
export function getRecommendationsByPriority(
  recommendations: Recommendation[],
  priority: "high" | "medium" | "low",
): Recommendation[] {
  return recommendations.filter((rec) => rec.priority === priority);
}

/**
 * Calculate category distribution
 */
export function calculateCategoryDistribution(
  areas: PolicyArea[],
): Record<PolicyCategory, number> {
  const distribution: Record<string, number> = {};

  areas.forEach((area) => {
    distribution[area.category] = (distribution[area.category] || 0) + 1;
  });

  return distribution as Record<PolicyCategory, number>;
}

/**
 * Format summary for display
 */
export function formatSummaryForDisplay(summary: PersonalizedSummary): {
  title: string;
  subtitle: string;
  scoreText: string;
  areasCount: number;
  recommendationsCount: number;
} {
  return {
    title: "Your Personalized Policy Summary",
    subtitle: `Based on your profile, we found ${summary.relevantAreas.length} relevant policy areas`,
    scoreText: `${summary.overallScore}% relevance match`,
    areasCount: summary.relevantAreas.length,
    recommendationsCount: summary.recommendations.length,
  };
}

/**
 * Generate summary statistics
 */
export function generateSummaryStatistics(summary: PersonalizedSummary): {
  totalAreas: number;
  highImpactAreas: number;
  averageRelevanceScore: number;
  topCategory: PolicyCategory | null;
  highPriorityRecommendations: number;
} {
  const highImpactAreas = getHighImpactAreas(summary.relevantAreas);
  const averageScore =
    summary.relevantAreas.length > 0
      ? Math.round(
          summary.relevantAreas.reduce(
            (sum, area) => sum + area.relevanceScore,
            0,
          ) / summary.relevantAreas.length,
        )
      : 0;

  const categoryDistribution = calculateCategoryDistribution(
    summary.relevantAreas,
  );
  const topCategory =
    (Object.entries(categoryDistribution).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0] as PolicyCategory) || null;

  const highPriorityRecs = getRecommendationsByPriority(
    summary.recommendations,
    "high",
  );

  return {
    totalAreas: summary.relevantAreas.length,
    highImpactAreas: highImpactAreas.length,
    averageRelevanceScore: averageScore,
    topCategory,
    highPriorityRecommendations: highPriorityRecs.length,
  };
}

/**
 * Validate summary completeness
 */
export function validateSummary(summary: PersonalizedSummary): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!summary.id) errors.push("Summary ID is required");
  if (!summary.userProfileId) errors.push("User profile ID is required");
  if (summary.overallScore < 70 || summary.overallScore > 100) {
    errors.push("Overall score must be between 70-100");
  }
  if (!summary.relevantAreas || summary.relevantAreas.length === 0) {
    errors.push("At least one relevant area is required");
  }
  if (!summary.recommendations || summary.recommendations.length === 0) {
    warnings.push("No recommendations generated");
  }

  // Content validation
  summary.relevantAreas.forEach((area, index) => {
    if (!area.title) errors.push(`Policy area ${index + 1} missing title`);
    if (!area.summary) errors.push(`Policy area ${index + 1} missing summary`);
    if (area.relevanceScore < 0 || area.relevanceScore > 100) {
      errors.push(`Policy area ${index + 1} has invalid relevance score`);
    }
  });

  summary.recommendations.forEach((rec, index) => {
    if (!rec.title) errors.push(`Recommendation ${index + 1} missing title`);
    if (!rec.description)
      errors.push(`Recommendation ${index + 1} missing description`);
    if (!rec.actionSteps || rec.actionSteps.length === 0) {
      warnings.push(`Recommendation ${index + 1} has no action steps`);
    }
  });

  // Quality warnings
  if (summary.relevantAreas.length < 3) {
    warnings.push(
      "Consider including more relevant policy areas for comprehensive coverage",
    );
  }
  if (summary.recommendations.length < 3) {
    warnings.push(
      "Consider providing more recommendations for better user guidance",
    );
  }

  const highImpactAreas = getHighImpactAreas(summary.relevantAreas);
  if (highImpactAreas.length === 0) {
    warnings.push("No high-impact areas identified - review relevance scoring");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create summary excerpt for previews
 */
export function createSummaryExcerpt(
  summary: PersonalizedSummary,
  maxLength: number = 200,
): string {
  const topArea = summary.relevantAreas[0];
  if (!topArea) return "No relevant policy areas found.";

  const excerpt = `Your top policy match is ${topArea.title} with ${topArea.relevanceScore}% relevance. ${topArea.summary}`;

  if (excerpt.length <= maxLength) return excerpt;

  return excerpt.substring(0, maxLength - 3) + "...";
}

/**
 * Export summary data for external use
 */
export function exportSummaryData(summary: PersonalizedSummary): {
  metadata: {
    id: string;
    generatedAt: string;
    overallScore: number;
    aiProvider: string;
  };
  content: {
    relevantAreas: Array<{
      category: string;
      title: string;
      relevanceScore: number;
      summary: string;
      impact: string;
    }>;
    recommendations: Array<{
      title: string;
      description: string;
      priority: string;
      category: string;
    }>;
    majorUpdates: Array<{
      title: string;
      category: string;
      timeline: string;
    }>;
  };
} {
  return {
    metadata: {
      id: summary.id,
      generatedAt: summary.generatedAt.toISOString(),
      overallScore: summary.overallScore,
      aiProvider: summary.aiProvider,
    },
    content: {
      relevantAreas: summary.relevantAreas.map((area) => ({
        category: area.category,
        title: area.title,
        relevanceScore: area.relevanceScore,
        summary: area.summary,
        impact: area.impact,
      })),
      recommendations: summary.recommendations.map((rec) => ({
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        category: rec.category,
      })),
      majorUpdates: summary.majorUpdates.map((update) => ({
        title: update.title,
        category: update.category,
        timeline: update.timeline,
      })),
    },
  };
}
