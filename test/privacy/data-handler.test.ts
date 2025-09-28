import { describe, it, expect } from "vitest";
import {
  anonymizeUserProfile,
  anonymizePersonalizedSummary,
  sanitizeForLogging,
  createPrivacyHash,
  shouldExpireData,
  validatePrivacyCompliance,
  generateAnalyticsData,
} from "@/lib/privacy/data-handler";
import type { UserProfile, PersonalizedSummary } from "@/types";

describe("Privacy Data Handler", () => {
  const mockUserProfile: UserProfile = {
    age: 30,
    gender: "male",
    maritalStatus: "married",
    district: "central-western",
    incomeRange: "50k-80k",
    employmentStatus: "employed-full-time",
    housingType: "private-rental",
    hasChildren: true,
    childrenAges: [5, 8],
    educationLevel: "bachelor",
    healthConditions: ["diabetes"],
    transportationMode: ["mtr", "bus"],
  };

  const mockSummary: PersonalizedSummary = {
    overallScore: 85,
    relevantAreas: [
      {
        category: "housing",
        title: "Housing Policies",
        relevanceScore: 90,
        summary: "Relevant housing information",
        details: "Detailed housing information",
        actionItems: ["Apply for housing scheme"],
        impact: "high",
      },
    ],
    majorUpdates: [
      {
        id: "update1",
        title: "Major Update",
        description: "Important city update",
        relevanceToUser: "High relevance",
        timeline: "2024",
        impact: "high",
      },
    ],
    recommendations: [
      {
        id: "rec1",
        title: "Recommendation",
        description: "Important recommendation",
        actionSteps: ["Step 1", "Step 2"],
        priority: "high",
        category: "housing",
      },
    ],
    generatedAt: new Date(),
  };

  describe("anonymizeUserProfile", () => {
    it("should anonymize user profile without exposing sensitive data", () => {
      const anonymized = anonymizeUserProfile(mockUserProfile);

      expect(anonymized).toHaveProperty("profileType", "user_profile");
      expect(anonymized).toHaveProperty("hasAge", true);
      expect(anonymized).toHaveProperty("hasGender", true);
      expect(anonymized).toHaveProperty("hasChildren", true);
      expect(anonymized).toHaveProperty("childrenCount", 2);
      expect(anonymized).toHaveProperty("healthConditionsCount", 1);
      expect(anonymized).toHaveProperty("transportationModeCount", 2);

      // Should not contain actual sensitive values
      expect(anonymized).not.toHaveProperty("age");
      expect(anonymized).not.toHaveProperty("gender");
      expect(anonymized).not.toHaveProperty("incomeRange");
      expect(anonymized).not.toHaveProperty("childrenAges");
    });

    it("should handle profile with missing optional fields", () => {
      const minimalProfile: UserProfile = {
        age: 25,
        gender: "female",
        maritalStatus: "single",
        district: "wan-chai",
        incomeRange: "30k-50k",
        employmentStatus: "employed-part-time",
        housingType: "public-rental",
        hasChildren: false,
        educationLevel: "secondary",
        transportationMode: ["mtr"],
      };

      const anonymized = anonymizeUserProfile(minimalProfile);

      expect(anonymized.hasChildren).toBe(false);
      expect(anonymized.childrenCount).toBe(0);
      expect(anonymized.healthConditionsCount).toBe(0);
    });
  });

  describe("anonymizePersonalizedSummary", () => {
    it("should anonymize summary without exposing user-specific content", () => {
      const anonymized = anonymizePersonalizedSummary(mockSummary);

      expect(anonymized).toHaveProperty("summaryType", "personalized_summary");
      expect(anonymized).toHaveProperty("overallScore", 85);
      expect(anonymized).toHaveProperty("relevantAreasCount", 1);
      expect(anonymized).toHaveProperty("majorUpdatesCount", 1);
      expect(anonymized).toHaveProperty("recommendationsCount", 1);
      expect(anonymized).toHaveProperty("categories", ["housing"]);
      expect(anonymized).toHaveProperty("averageRelevanceScore", 90);

      // Should not contain actual content
      expect(anonymized).not.toHaveProperty("relevantAreas");
      expect(anonymized).not.toHaveProperty("recommendations");
    });
  });

  describe("sanitizeForLogging", () => {
    it("should sanitize strings with PII", () => {
      const input = "Contact john.doe@example.com at 192.168.1.1 with ID 12345678";
      const result = sanitizeForLogging(input);

      expect(result).toBe("Contact [EMAIL] at [IP] with ID [NUMBER]");
    });

    it("should sanitize objects recursively", () => {
      const input = {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        address: {
          ip: "192.168.1.1",
          id: 12345678,
        },
        tags: ["user@domain.com", "safe-tag"],
      };

      const result = sanitizeForLogging(input) as any;

      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("[EMAIL]");
      expect(result.age_present).toBe(true); // age is a sensitive field
      expect(result.address.ip).toBe("[IP]");
      expect(result.address.id).toBe("[LARGE_NUMBER]");
      expect(result.tags).toEqual(["[EMAIL]", "safe-tag"]);
      expect(result).not.toHaveProperty("age"); // Should not have the actual age
    });

    it("should handle sensitive profile fields", () => {
      const input = {
        age: 30,
        gender: "male",
        name: "John",
        publicInfo: "Safe data",
      };

      const result = sanitizeForLogging(input) as any;

      expect(result.age_present).toBe(true);
      expect(result.gender_present).toBe(true);
      expect(result.name).toBe("John");
      expect(result.publicInfo).toBe("Safe data");
      expect(result).not.toHaveProperty("age");
      expect(result).not.toHaveProperty("gender");
    });

    it("should handle large numbers", () => {
      const input = { smallNumber: 100, largeNumber: 1234567890 };
      const result = sanitizeForLogging(input) as any;

      expect(result.smallNumber).toBe(100);
      expect(result.largeNumber).toBe("[LARGE_NUMBER]");
    });
  });

  describe("createPrivacyHash", () => {
    it("should create consistent hash for same profile", () => {
      const hash1 = createPrivacyHash(mockUserProfile);
      const hash2 = createPrivacyHash(mockUserProfile);

      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe("string");
      expect(hash1.length).toBeGreaterThan(0);
    });

    it("should create different hashes for different profiles", () => {
      const profile2: UserProfile = {
        ...mockUserProfile,
        hasChildren: false,
        childrenAges: undefined,
      };

      const hash1 = createPrivacyHash(mockUserProfile);
      const hash2 = createPrivacyHash(profile2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("shouldExpireData", () => {
    it("should correctly identify expired session data", () => {
      const oldDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      const recentDate = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago

      expect(shouldExpireData(oldDate, "session")).toBe(true);
      expect(shouldExpireData(recentDate, "session")).toBe(false);
    });

    it("should correctly identify expired temp data", () => {
      const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const recentDate = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

      expect(shouldExpireData(oldDate, "temp")).toBe(true);
      expect(shouldExpireData(recentDate, "temp")).toBe(false);
    });

    it("should expire unknown data types by default", () => {
      const recentDate = new Date();
      expect(shouldExpireData(recentDate, "unknown" as any)).toBe(true);
    });
  });

  describe("validatePrivacyCompliance", () => {
    it("should detect sensitive field violations in logging", () => {
      const data = { age: 30, gender: "male", name: "John" };
      const result = validatePrivacyCompliance("log_user_data", data);

      expect(result.compliant).toBe(false);
      expect(result.violations).toContain("Sensitive field 'age' should not be logged directly");
      expect(result.violations).toContain("Sensitive field 'gender' should not be logged directly");
    });

    it("should detect PII in strings", () => {
      const data = "Contact user@example.com or visit 192.168.1.1";
      const result = validatePrivacyCompliance("log_message", data);

      expect(result.compliant).toBe(false);
      expect(result.violations).toContain("Email address detected in data");
      expect(result.violations).toContain("IP address detected in data");
    });

    it("should pass compliant data", () => {
      const data = { name: "John", publicInfo: "Safe data" };
      const result = validatePrivacyCompliance("log_public_data", data);

      expect(result.compliant).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe("generateAnalyticsData", () => {
    it("should generate privacy-compliant analytics without profile", () => {
      const analytics = generateAnalyticsData(mockUserProfile);

      expect(analytics).toHaveProperty("session_id");
      expect(analytics).toHaveProperty("profile_completeness");
      expect(analytics).toHaveProperty("demographic_pattern");
      expect(analytics).toHaveProperty("timestamp");
      expect(analytics.summary_generated).toBeUndefined();

      // Should not contain sensitive data
      expect(analytics).not.toHaveProperty("age");
      expect(analytics).not.toHaveProperty("income");
    });

    it("should generate analytics with summary data", () => {
      const analytics = generateAnalyticsData(mockUserProfile, mockSummary);

      expect(analytics).toHaveProperty("summary_generated", true);
      expect(analytics).toHaveProperty("overall_score_range", "80-89");
      expect(analytics).toHaveProperty("policy_areas_count", 1);
      expect(analytics).toHaveProperty("recommendations_count", 1);
    });

    it("should calculate correct profile completeness", () => {
      const analytics = generateAnalyticsData(mockUserProfile);
      expect(analytics.profile_completeness).toBe(100); // All required fields present

      const incompleteProfile: UserProfile = {
        age: 25,
        gender: "female",
        maritalStatus: "single",
        district: "wan-chai",
        incomeRange: "30k-50k",
        employmentStatus: "employed-part-time",
        housingType: "public-rental",
        hasChildren: false,
        educationLevel: "secondary",
        transportationMode: ["mtr"],
      };

      const incompleteAnalytics = generateAnalyticsData(incompleteProfile);
      expect(incompleteAnalytics.profile_completeness).toBe(100); // Still complete for required fields
    });
  });
});