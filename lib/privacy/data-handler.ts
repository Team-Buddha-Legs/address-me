/**
 * Privacy-focused data handling utilities
 * Ensures user data is handled according to privacy best practices
 */

import type { PersonalizedSummary, UserProfile } from "@/types";

// Data retention policies
export const DATA_RETENTION = {
  SESSION_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  TEMP_DATA_EXPIRY_MS: 60 * 60 * 1000, // 1 hour for temporary data
  LOG_RETENTION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days for logs
} as const;

// Fields that should never be logged or exposed
const SENSITIVE_FIELDS = [
  "age",
  "gender",
  "maritalStatus",
  "district",
  "incomeRange",
  "employmentStatus",
  "housingType",
  "childrenAges",
  "healthConditions",
] as const;

/**
 * Anonymize user profile for logging purposes
 */
export function anonymizeUserProfile(
  profile: UserProfile,
): Record<string, unknown> {
  return {
    profileType: "user_profile",
    hasAge: !!profile.age,
    hasGender: !!profile.gender,
    hasMaritalStatus: !!profile.maritalStatus,
    hasDistrict: !!profile.district,
    hasIncomeRange: !!profile.incomeRange,
    hasEmploymentStatus: !!profile.employmentStatus,
    hasHousingType: !!profile.housingType,
    hasChildren: profile.hasChildren,
    childrenCount: profile.childrenAges?.length || 0,
    hasEducationLevel: !!profile.educationLevel,
    healthConditionsCount: profile.healthConditions?.length || 0,
    transportationModeCount: profile.transportationMode?.length || 0,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Anonymize personalized summary for logging purposes
 */
export function anonymizePersonalizedSummary(
  summary: PersonalizedSummary,
): Record<string, unknown> {
  return {
    summaryType: "personalized_summary",
    overallScore: summary.overallScore,
    relevantAreasCount: summary.relevantAreas.length,
    majorUpdatesCount: summary.majorUpdates.length,
    recommendationsCount: summary.recommendations.length,
    categories: summary.relevantAreas.map((area) => area.category),
    averageRelevanceScore:
      summary.relevantAreas.reduce(
        (sum, area) => sum + area.relevanceScore,
        0,
      ) / summary.relevantAreas.length,
    generatedAt: summary.generatedAt.toISOString(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Remove sensitive data from any object for logging
 */
export function sanitizeForLogging(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    // Remove potential PII patterns
    return data
      .replace(/\b\d{4,}\b/g, "[NUMBER]") // Long numbers
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        "[EMAIL]",
      ) // Email addresses
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]") // IP addresses
      .replace(/\b\d{8,}\b/g, "[ID]"); // Long numeric IDs
  }

  if (typeof data === "number") {
    // Keep numbers but flag if they might be sensitive
    if (data > 1000000) {
      return "[LARGE_NUMBER]";
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForLogging(item));
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields entirely
      if (SENSITIVE_FIELDS.includes(key as (typeof SENSITIVE_FIELDS)[number])) {
        sanitized[`${key}_present`] = value !== undefined && value !== null;
        continue;
      }

      // Recursively sanitize nested objects
      sanitized[key] = sanitizeForLogging(value);
    }

    return sanitized;
  }

  return data;
}

/**
 * Create a privacy-compliant hash of user data for analytics
 */
export function createPrivacyHash(profile: UserProfile): string {
  // Create a hash based on non-sensitive demographic patterns
  const hashInput = [
    profile.hasChildren ? "1" : "0",
    profile.transportationMode?.length.toString() || "0",
    profile.healthConditions?.length.toString() || "0",
    profile.educationLevel ? "1" : "0",
  ].join("|");

  // Simple hash function (in production, use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Check if data should be expired based on privacy policies
 */
export function shouldExpireData(
  createdAt: Date,
  dataType: "session" | "temp" | "log",
): boolean {
  const now = Date.now();
  const createdTime = createdAt.getTime();

  switch (dataType) {
    case "session":
      return now - createdTime > DATA_RETENTION.SESSION_EXPIRY_MS;
    case "temp":
      return now - createdTime > DATA_RETENTION.TEMP_DATA_EXPIRY_MS;
    case "log":
      return now - createdTime > DATA_RETENTION.LOG_RETENTION_MS;
    default:
      return true; // Expire unknown data types by default
  }
}

/**
 * Validate that data handling complies with privacy requirements
 */
export function validatePrivacyCompliance(
  operation: string,
  data: unknown,
): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check for direct exposure of sensitive fields
  if (typeof data === "object" && data !== null) {
    for (const field of SENSITIVE_FIELDS) {
      if (field in data && operation.includes("log")) {
        violations.push(
          `Sensitive field '${field}' should not be logged directly`,
        );
      }
    }
  }

  // Check for potential PII in strings
  if (typeof data === "string") {
    if (data.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
      violations.push("Email address detected in data");
    }
    if (data.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)) {
      violations.push("IP address detected in data");
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}

/**
 * Generate privacy-compliant analytics data
 */
export function generateAnalyticsData(
  profile: UserProfile,
  summary?: PersonalizedSummary,
): Record<string, unknown> {
  const analytics = {
    session_id: createPrivacyHash(profile),
    profile_completeness: calculateProfileCompleteness(profile),
    demographic_pattern: createDemographicPattern(profile),
    timestamp: new Date().toISOString(),
  };

  if (summary) {
    return {
      ...analytics,
      summary_generated: true,
      overall_score_range: getScoreRange(summary.overallScore),
      policy_areas_count: summary.relevantAreas.length,
      recommendations_count: summary.recommendations.length,
    };
  }

  return analytics;
}

/**
 * Calculate profile completeness without exposing actual values
 */
function calculateProfileCompleteness(profile: UserProfile): number {
  const requiredFields = [
    "age",
    "gender",
    "maritalStatus",
    "district",
    "incomeRange",
    "employmentStatus",
    "housingType",
    "hasChildren",
    "educationLevel",
    "transportationMode",
  ];

  const completedFields = requiredFields.filter((field) => {
    const value = profile[field as keyof UserProfile];
    return (
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : true)
    );
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
}

/**
 * Create demographic pattern without exposing specific values
 */
function createDemographicPattern(profile: UserProfile): string {
  const patterns = [
    profile.hasChildren ? "family" : "individual",
    profile.transportationMode?.includes("mtr")
      ? "public_transport"
      : "other_transport",
    profile.healthConditions && profile.healthConditions.length > 0
      ? "health_considerations"
      : "standard_health",
  ];

  return patterns.join("|");
}

/**
 * Get score range without exposing exact score
 */
function getScoreRange(score: number): string {
  if (score >= 90) return "90-100";
  if (score >= 80) return "80-89";
  if (score >= 70) return "70-79";
  return "below-70";
}
