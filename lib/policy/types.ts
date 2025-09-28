/**
 * Policy content types for Hong Kong Policy Address processing
 */

export type PolicyCategory =
  | "housing"
  | "transportation"
  | "healthcare"
  | "education"
  | "employment"
  | "social-welfare"
  | "environment"
  | "economy"
  | "technology";

export type ImpactLevel = "high" | "medium" | "low";

export type TargetDemographic =
  | "young-adults"
  | "families"
  | "elderly"
  | "students"
  | "professionals"
  | "low-income"
  | "middle-income"
  | "high-income"
  | "new-immigrants"
  | "disabled"
  | "unemployed";

export interface PolicySection {
  id: string;
  category: PolicyCategory;
  title: string;
  content: string;
  summary: string;
  targetDemographics: TargetDemographic[];
  impactLevel: ImpactLevel;
  implementationTimeline: string;
  budgetAllocation?: number;
  keyBenefits: string[];
  eligibilityCriteria?: string[];
}

export interface PolicyContent {
  year: string;
  title: string;
  sections: PolicySection[];
  lastUpdated: Date;
  totalBudget: number;
}

export interface PolicyRelevanceScore {
  sectionId: string;
  score: number; // 0-100
  reasons: string[];
  matchedDemographics: TargetDemographic[];
  impactAssessment: string;
}

export interface PolicyAnalysis {
  userProfileId: string;
  overallScore: number; // 70-100 (minimum 70% as per requirements)
  relevantSections: PolicyRelevanceScore[];
  topCategories: PolicyCategory[];
  recommendedActions: string[];
  analysisDate: Date;
}
