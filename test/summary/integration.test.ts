import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultAIService } from "@/lib/ai/service";
import { createSummaryGenerator } from "@/lib/summary/generator";
import {
  generateSummaryStatistics,
  validateSummary,
} from "@/lib/summary/utils";
import type { UserProfile } from "@/types";

describe("Summary Generation Integration", () => {
  let userProfile: UserProfile;

  beforeEach(() => {
    userProfile = {
      age: 32,
      gender: "female",
      maritalStatus: "married",
      district: "central-western",
      incomeRange: "50k-80k",
      employmentStatus: "employed-full-time",
      housingType: "private-rental",
      hasChildren: true,
      childrenAges: [4, 7],
      educationLevel: "bachelor",
      transportationMode: ["mtr", "bus"],
      healthConditions: [],
    };
  });

  describe("end-to-end summary generation", () => {
    it("should generate complete and valid summary", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      const result = await generator.generateSummary(userProfile);

      // Validate the generated summary
      const validation = validateSummary(result.summary);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);

      // Check summary statistics
      const stats = generateSummaryStatistics(result.summary);
      expect(stats.totalAreas).toBeGreaterThan(0);
      expect(stats.averageRelevanceScore).toBeGreaterThan(0);
      expect(stats.topCategory).toBeDefined();

      // Verify minimum requirements are met
      expect(result.summary.overallScore).toBeGreaterThanOrEqual(70);
      expect(result.summary.relevantAreas.length).toBeGreaterThan(0);
      expect(result.summary.recommendations.length).toBeGreaterThan(0);
    });

    it("should handle different user demographics appropriately", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      // Test with young professional
      const youngProfessional: UserProfile = {
        age: 26,
        gender: "male",
        maritalStatus: "single",
        district: "wan-chai",
        incomeRange: "50k-80k",
        employmentStatus: "employed-full-time",
        housingType: "private-rental",
        hasChildren: false,
        educationLevel: "bachelor",
        transportationMode: ["mtr"],
      };

      // Test with elderly person
      const elderlyPerson: UserProfile = {
        age: 72,
        gender: "female",
        maritalStatus: "widowed",
        district: "sham-shui-po",
        incomeRange: "20k-30k",
        employmentStatus: "retired",
        housingType: "public-rental",
        hasChildren: false,
        educationLevel: "primary",
        transportationMode: ["bus"],
        healthConditions: ["hypertension", "diabetes"],
      };

      const youngResult = await generator.generateSummary(youngProfessional);
      const elderlyResult = await generator.generateSummary(elderlyPerson);

      // Both should be valid
      expect(validateSummary(youngResult.summary).isValid).toBe(true);
      expect(validateSummary(elderlyResult.summary).isValid).toBe(true);

      // Should have different focus areas
      const _youngStats = generateSummaryStatistics(youngResult.summary);
      const _elderlyStats = generateSummaryStatistics(elderlyResult.summary);

      // Young professional likely to have housing/employment focus
      const youngCategories = youngResult.summary.relevantAreas.map(
        (a) => a.category,
      );
      expect(youngCategories).toContain("housing");

      // Elderly person likely to have healthcare/social-welfare focus
      const elderlyCategories = elderlyResult.summary.relevantAreas.map(
        (a) => a.category,
      );
      expect(
        elderlyCategories.some(
          (cat) => cat === "healthcare" || cat === "social-welfare",
        ),
      ).toBe(true);
    });

    it("should maintain consistency across multiple generations", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      // Generate multiple summaries for the same profile
      const result1 = await generator.generateSummary(userProfile);
      const result2 = await generator.generateSummary(userProfile);

      // Should have consistent overall scores (within reasonable range)
      const scoreDifference = Math.abs(
        result1.summary.overallScore - result2.summary.overallScore,
      );
      expect(scoreDifference).toBeLessThanOrEqual(5); // Allow small variation

      // Should identify similar top categories
      const _stats1 = generateSummaryStatistics(result1.summary);
      const _stats2 = generateSummaryStatistics(result2.summary);

      // At least some overlap in relevant areas
      const categories1 = result1.summary.relevantAreas.map((a) => a.category);
      const categories2 = result2.summary.relevantAreas.map((a) => a.category);
      const overlap = categories1.filter((cat) => categories2.includes(cat));
      expect(overlap.length).toBeGreaterThan(0);
    });

    it("should handle edge cases gracefully", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      // Test with minimal profile
      const minimalProfile: UserProfile = {
        age: 25,
        gender: "other",
        maritalStatus: "single",
        district: "islands",
        incomeRange: "above-120k",
        employmentStatus: "self-employed",
        housingType: "private-owned",
        hasChildren: false,
        educationLevel: "doctorate",
        transportationMode: ["private-car"],
      };

      const result = await generator.generateSummary(minimalProfile);

      // Should still generate valid summary
      const validation = validateSummary(result.summary);
      expect(validation.isValid).toBe(true);

      // Should meet minimum requirements
      expect(result.summary.overallScore).toBeGreaterThanOrEqual(70);
      expect(result.summary.relevantAreas.length).toBeGreaterThan(0);
    });

    it("should generate actionable recommendations", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      const result = await generator.generateSummary(userProfile);

      // All recommendations should have action steps
      result.summary.recommendations.forEach((rec) => {
        expect(rec.actionSteps.length).toBeGreaterThan(0);
        expect(rec.expectedBenefit).toBeDefined();
        expect(rec.timeframe).toBeDefined();

        // Action steps should be meaningful
        rec.actionSteps.forEach((step) => {
          expect(step.length).toBeGreaterThan(10); // Reasonable length
          expect(step.trim()).toBe(step); // No leading/trailing whitespace
        });
      });
    });

    it("should provide comprehensive policy coverage", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      const result = await generator.generateSummary(userProfile);

      // Should cover multiple policy categories
      const categories = new Set(
        result.summary.relevantAreas.map((a) => a.category),
      );
      expect(categories.size).toBeGreaterThanOrEqual(3);

      // Should include high-relevance areas
      const highRelevanceAreas = result.summary.relevantAreas.filter(
        (a) => a.relevanceScore >= 70,
      );
      expect(highRelevanceAreas.length).toBeGreaterThan(0);

      // Should have meaningful content
      result.summary.relevantAreas.forEach((area) => {
        expect(area.summary.length).toBeGreaterThan(20);
        expect(area.details.length).toBeGreaterThan(50);
        expect(area.keyBenefits.length).toBeGreaterThan(0);
      });
    });

    it("should include relevant major updates", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      const result = await generator.generateSummary(userProfile);

      // Should have major updates
      expect(result.summary.majorUpdates.length).toBeGreaterThan(0);

      result.summary.majorUpdates.forEach((update) => {
        expect(update.title).toBeDefined();
        expect(update.description.length).toBeGreaterThan(20);
        expect(update.timeline).toMatch(/\d{4}/); // Should contain year
        expect(update.relevanceToUser).toBeDefined();
      });
    });

    it("should provide processing metadata", async () => {
      const aiService = createDefaultAIService();
      const generator = createSummaryGenerator(aiService);

      const result = await generator.generateSummary(userProfile);

      // Should include processing information
      expect(result.metadata.sectionsAnalyzed).toBeGreaterThan(0);
      expect(result.metadata.relevantSectionsFound).toBeGreaterThan(0);
      expect(result.metadata.processingSteps.length).toBeGreaterThan(0);

      // Processing steps should be meaningful
      expect(result.metadata.processingSteps).toContain(
        "Starting policy analysis",
      );
      expect(
        result.metadata.processingSteps.some(
          (step) =>
            step.includes("Analyzed") && step.includes("policy sections"),
        ),
      ).toBe(true);
    });
  });
});
