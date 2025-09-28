import type { PolicyCategory, PolicyRelevanceScore } from "@/lib/policy/types";

/**
 * Types for personalized summary generation
 */

export interface PersonalizedSummary {
  id: string;
  userProfileId: string;
  overallScore: number; // 70-100
  relevantAreas: PolicyArea[];
  majorUpdates: CityPlan[];
  recommendations: Recommendation[];
  generatedAt: Date;
  aiProvider: string;
  processingTimeMs: number;
}

export interface PolicyArea {
  category: PolicyCategory;
  title: string;
  relevanceScore: number;
  summary: string;
  details: string;
  actionItems: string[];
  impact: "high" | "medium" | "low";
  keyBenefits: string[];
  eligibilityInfo?: string;
}

export interface CityPlan {
  id: string;
  title: string;
  category: PolicyCategory;
  description: string;
  timeline: string;
  impact: string;
  relevanceToUser: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: PolicyCategory;
  actionSteps: string[];
  expectedBenefit: string;
  timeframe: string;
}

export interface SummaryGenerationOptions {
  includeDetailedAnalysis: boolean;
  maxRecommendations: number;
  focusCategories?: PolicyCategory[];
  language: "en" | "zh-hk" | "zh-cn";
}

export interface SummaryGenerationResult {
  summary: PersonalizedSummary;
  metadata: {
    sectionsAnalyzed: number;
    relevantSectionsFound: number;
    aiTokensUsed?: number;
    processingSteps: string[];
  };
}
