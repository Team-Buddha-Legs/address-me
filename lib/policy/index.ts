// Policy types

// Analysis functions
export {
  analyzePolicyForUser,
  calculatePolicyRelevance,
} from "./analysis";

// Mock data
export {
  getPolicyContentByCategory,
  getPolicyContentById,
  mockPolicyContent,
} from "./mock-data";
export type {
  ImpactLevel,
  PolicyAnalysis,
  PolicyCategory,
  PolicyContent,
  PolicyRelevanceScore,
  PolicySection,
  TargetDemographic,
} from "./types";
