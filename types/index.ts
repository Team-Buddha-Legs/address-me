// Core type definitions for Address Me webapp

// Hong Kong specific enums
export type HongKongDistrict =
  | "central-western"
  | "wan-chai"
  | "eastern"
  | "southern"
  | "yau-tsim-mong"
  | "sham-shui-po"
  | "kowloon-city"
  | "wong-tai-sin"
  | "kwun-tong"
  | "tsuen-wan"
  | "tuen-mun"
  | "yuen-long"
  | "north"
  | "tai-po"
  | "sha-tin"
  | "sai-kung"
  | "islands";

export type IncomeRange =
  | "below-10k"
  | "10k-20k"
  | "20k-30k"
  | "30k-50k"
  | "50k-80k"
  | "80k-120k"
  | "above-120k";

export type EmploymentStatus =
  | "employed-full-time"
  | "employed-part-time"
  | "self-employed"
  | "unemployed"
  | "student"
  | "retired";

export type HousingType =
  | "public-rental"
  | "subsidized-sale"
  | "private-rental"
  | "private-owned"
  | "temporary"
  | "other";

export type EducationLevel =
  | "primary"
  | "secondary"
  | "post-secondary"
  | "bachelor"
  | "master"
  | "doctorate";

export type TransportationMode =
  | "mtr"
  | "bus"
  | "minibus"
  | "taxi"
  | "private-car"
  | "bicycle"
  | "walking";

// User Profile Interface
export interface UserProfile {
  age: number;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  district: HongKongDistrict;
  incomeRange: IncomeRange;
  employmentStatus: EmploymentStatus;
  housingType: HousingType;
  hasChildren: boolean;
  childrenAges?: number[];
  educationLevel: EducationLevel;
  healthConditions?: string[];
  transportationMode: TransportationMode[];
}

// Policy Content Interfaces
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

export interface PolicySection {
  id: string;
  category: PolicyCategory;
  title: string;
  content: string;
  targetDemographics: string[];
  impactLevel: "high" | "medium" | "low";
  implementationTimeline: string;
}

export interface PolicyContent {
  year: string;
  sections: PolicySection[];
  lastUpdated: Date;
}

// Personalized Summary Interfaces
export interface PolicyArea {
  category: PolicyCategory;
  title: string;
  relevanceScore: number;
  summary: string;
  details: string;
  actionItems: string[];
  impact: "high" | "medium" | "low";
}

export interface CityPlan {
  id: string;
  title: string;
  description: string;
  relevanceToUser: string;
  timeline: string;
  impact: "high" | "medium" | "low";
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionSteps: string[];
  priority: "high" | "medium" | "low";
  category: PolicyCategory;
}

export interface PersonalizedSummary {
  overallScore: number; // 70-100
  relevantAreas: PolicyArea[];
  majorUpdates: CityPlan[];
  recommendations: Recommendation[];
  generatedAt: Date;
}

// Form and UI Interfaces
export interface FormField {
  id: string;
  type: "select" | "radio" | "checkbox" | "number" | "text";
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required: boolean;
  validation?: unknown; // Zod schema
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  validation?: unknown; // Zod schema (optional for server-side compatibility)
}

// AI Provider Interfaces
export interface AIProviderConfig {
  name: string;
  apiKey: string;
  options?: Record<string, unknown>;
}

// Session Management
export interface UserSession {
  id: string;
  profile: UserProfile;
  summary?: PersonalizedSummary;
  createdAt: Date;
  expiresAt: Date;
}

// Utility Types
export interface ProcessedProfile extends UserProfile {
  profileHash: string;
  riskFactors: string[];
  eligibilityFlags: Record<string, boolean>;
}

export interface PolicyAnalysis {
  relevantSections: PolicySection[];
  scoreBreakdown: Record<PolicyCategory, number>;
  matchingCriteria: string[];
}

export interface FormattedReport {
  html: string;
  plainText: string;
  metadata: {
    generatedAt: Date;
    userProfile: Partial<UserProfile>;
    version: string;
  };
}
