import { describe, expect, it } from "vitest";
import {
  analyzePolicyForUser,
  calculatePolicyRelevance,
} from "@/lib/policy/analysis";
import { mockPolicyContent } from "@/lib/policy/mock-data";
import type { PolicySection } from "@/lib/policy/types";
import type { UserProfile } from "@/types";

describe("Policy Analysis", () => {
  const mockUserProfile: UserProfile = {
    age: 28,
    gender: "female",
    maritalStatus: "married",
    district: "central-western",
    incomeRange: "40k-60k",
    employmentStatus: "employed",
    housingType: "private-rental",
    hasChildren: true,
    childrenAges: [3, 6],
    educationLevel: "university",
    transportationMode: ["mtr", "bus"],
  };

  const mockPolicySection: PolicySection = {
    id: "test-001",
    category: "housing",
    title: "Test Housing Policy",
    content: "Test content",
    summary: "Test summary",
    targetDemographics: ["families", "middle-income", "young-adults"],
    impactLevel: "high",
    implementationTimeline: "2025-2026",
    keyBenefits: ["Affordable housing", "Better facilities"],
    eligibilityCriteria: ["Hong Kong resident", "Income below 80k"],
  };

  describe("calculatePolicyRelevance", () => {
    it("should calculate high relevance for matching demographics", () => {
      const result = calculatePolicyRelevance(
        mockUserProfile,
        mockPolicySection,
      );

      expect(result.sectionId).toBe("test-001");
      expect(result.score).toBeGreaterThan(70);
      expect(result.matchedDemographics).toContain("families");
      expect(result.matchedDemographics).toContain("middle-income");
      expect(result.matchedDemographics).toContain("young-adults");
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.impactAssessment).toContain("significant positive impact");
    });

    it("should calculate lower relevance for non-matching demographics", () => {
      const elderlyProfile: UserProfile = {
        ...mockUserProfile,
        age: 70,
        hasChildren: false,
        incomeRange: "above-100k",
        employmentStatus: "retired",
      };

      const result = calculatePolicyRelevance(
        elderlyProfile,
        mockPolicySection,
      );

      expect(result.score).toBeLessThan(70);
      expect(result.matchedDemographics.length).toBeLessThan(3);
    });

    it("should include impact level in scoring", () => {
      const highImpactSection: PolicySection = {
        ...mockPolicySection,
        impactLevel: "high",
      };

      const mediumImpactSection: PolicySection = {
        ...mockPolicySection,
        impactLevel: "medium",
      };

      const highResult = calculatePolicyRelevance(
        mockUserProfile,
        highImpactSection,
      );
      const mediumResult = calculatePolicyRelevance(
        mockUserProfile,
        mediumImpactSection,
      );

      expect(highResult.score).toBeGreaterThan(mediumResult.score);
    });

    it("should generate appropriate impact assessment", () => {
      const result = calculatePolicyRelevance(
        mockUserProfile,
        mockPolicySection,
      );

      expect(result.impactAssessment).toBeDefined();
      expect(typeof result.impactAssessment).toBe("string");
      expect(result.impactAssessment.length).toBeGreaterThan(0);
    });

    it("should handle sections without eligibility criteria", () => {
      const sectionWithoutCriteria: PolicySection = {
        ...mockPolicySection,
        eligibilityCriteria: undefined,
      };

      const result = calculatePolicyRelevance(
        mockUserProfile,
        sectionWithoutCriteria,
      );

      expect(result.score).toBeGreaterThan(0);
      expect(result.sectionId).toBe("test-001");
    });
  });

  describe("analyzePolicyForUser", () => {
    it("should analyze policy content and return comprehensive analysis", () => {
      const analysis = analyzePolicyForUser(mockUserProfile, mockPolicyContent);

      expect(analysis.userProfileId).toBeDefined();
      expect(analysis.overallScore).toBeGreaterThanOrEqual(70); // Minimum 70% requirement
      expect(analysis.overallScore).toBeLessThanOrEqual(100);
      expect(analysis.relevantSections.length).toBeGreaterThan(0);
      expect(analysis.topCategories.length).toBeGreaterThan(0);
      expect(analysis.recommendedActions.length).toBeGreaterThan(0);
      expect(analysis.analysisDate).toBeInstanceOf(Date);
    });

    it("should filter out low-relevance sections", () => {
      const analysis = analyzePolicyForUser(mockUserProfile, mockPolicyContent);

      // All relevant sections should have score >= 30
      analysis.relevantSections.forEach((section) => {
        expect(section.score).toBeGreaterThanOrEqual(30);
      });
    });

    it("should sort sections by relevance score", () => {
      const analysis = analyzePolicyForUser(mockUserProfile, mockPolicyContent);

      for (let i = 1; i < analysis.relevantSections.length; i++) {
        expect(analysis.relevantSections[i - 1].score).toBeGreaterThanOrEqual(
          analysis.relevantSections[i].score,
        );
      }
    });

    it("should identify top categories correctly", () => {
      const analysis = analyzePolicyForUser(mockUserProfile, mockPolicyContent);

      expect(analysis.topCategories.length).toBeLessThanOrEqual(5);
      expect(analysis.topCategories.length).toBeGreaterThan(0);

      // Should include housing for a family with children
      expect(analysis.topCategories).toContain("housing");
    });

    it("should generate relevant recommended actions", () => {
      const analysis = analyzePolicyForUser(mockUserProfile, mockPolicyContent);

      expect(analysis.recommendedActions.length).toBeLessThanOrEqual(5);
      expect(analysis.recommendedActions.length).toBeGreaterThan(0);

      // Should include housing-related recommendations for young family
      const hasHousingRecommendation = analysis.recommendedActions.some(
        (action) =>
          action.toLowerCase().includes("housing") ||
          action.toLowerCase().includes("home"),
      );
      expect(hasHousingRecommendation).toBe(true);
    });

    it("should handle different user profiles appropriately", () => {
      const elderlyProfile: UserProfile = {
        age: 68,
        gender: "male",
        maritalStatus: "widowed",
        district: "wan-chai",
        incomeRange: "20k-40k",
        employmentStatus: "retired",
        housingType: "public-rental",
        hasChildren: false,
        educationLevel: "secondary",
        transportationMode: ["bus"],
        healthConditions: ["diabetes"],
      };

      const elderlyAnalysis = analyzePolicyForUser(
        elderlyProfile,
        mockPolicyContent,
      );
      const familyAnalysis = analyzePolicyForUser(
        mockUserProfile,
        mockPolicyContent,
      );

      // Elderly profile should have different top categories
      expect(elderlyAnalysis.topCategories).not.toEqual(
        familyAnalysis.topCategories,
      );

      // Elderly should have healthcare and social welfare as top categories
      expect(elderlyAnalysis.topCategories).toContain("healthcare");
      expect(elderlyAnalysis.topCategories).toContain("social-welfare");
    });

    it("should ensure minimum 70% overall score", () => {
      // Test with a profile that might have low relevance
      const lowRelevanceProfile: UserProfile = {
        age: 45,
        gender: "other",
        maritalStatus: "single",
        district: "islands",
        incomeRange: "above-100k",
        employmentStatus: "self-employed",
        housingType: "private-owned",
        hasChildren: false,
        educationLevel: "postgraduate",
        transportationMode: ["private-car"],
      };

      const analysis = analyzePolicyForUser(
        lowRelevanceProfile,
        mockPolicyContent,
      );

      expect(analysis.overallScore).toBeGreaterThanOrEqual(70);
    });
  });
});
