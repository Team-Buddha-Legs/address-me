// Summary types

// Summary generator
export {
  createSummaryGenerator,
  SummaryGenerationError,
  SummaryGenerator,
} from "./generator";
export type {
  CityPlan,
  PersonalizedSummary,
  PolicyArea,
  Recommendation,
  SummaryGenerationOptions,
  SummaryGenerationResult,
} from "./types";

// Utility functions
export {
  calculateCategoryDistribution,
  createSummaryExcerpt,
  exportSummaryData,
  filterPolicyAreasByCategory,
  formatSummaryForDisplay,
  generateSummaryStatistics,
  getHighImpactAreas,
  getRecommendationsByPriority,
  sortPolicyAreasByRelevance,
  validateSummary,
} from "./utils";
