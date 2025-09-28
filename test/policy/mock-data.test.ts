import { describe, expect, it } from "vitest";
import {
  getPolicyContentByCategory,
  getPolicyContentById,
  mockPolicyContent,
} from "@/lib/policy/mock-data";

describe("Policy Mock Data", () => {
  describe("mockPolicyContent", () => {
    it("should have valid structure", () => {
      expect(mockPolicyContent.year).toBe("2025-2026");
      expect(mockPolicyContent.title).toBeDefined();
      expect(mockPolicyContent.sections).toBeInstanceOf(Array);
      expect(mockPolicyContent.sections.length).toBeGreaterThan(0);
      expect(mockPolicyContent.lastUpdated).toBeInstanceOf(Date);
      expect(mockPolicyContent.totalBudget).toBeGreaterThan(0);
    });

    it("should have sections with required fields", () => {
      mockPolicyContent.sections.forEach((section) => {
        expect(section.id).toBeDefined();
        expect(section.category).toBeDefined();
        expect(section.title).toBeDefined();
        expect(section.content).toBeDefined();
        expect(section.summary).toBeDefined();
        expect(section.targetDemographics).toBeInstanceOf(Array);
        expect(section.impactLevel).toMatch(/^(high|medium|low)$/);
        expect(section.implementationTimeline).toBeDefined();
        expect(section.keyBenefits).toBeInstanceOf(Array);
      });
    });

    it("should have diverse policy categories", () => {
      const categories = new Set(
        mockPolicyContent.sections.map((s) => s.category),
      );

      expect(categories.has("housing")).toBe(true);
      expect(categories.has("transportation")).toBe(true);
      expect(categories.has("healthcare")).toBe(true);
      expect(categories.has("education")).toBe(true);
      expect(categories.has("employment")).toBe(true);
      expect(categories.has("social-welfare")).toBe(true);

      expect(categories.size).toBeGreaterThanOrEqual(6);
    });

    it("should have realistic budget allocations", () => {
      mockPolicyContent.sections.forEach((section) => {
        if (section.budgetAllocation) {
          expect(section.budgetAllocation).toBeGreaterThan(0);
          expect(section.budgetAllocation).toBeLessThanOrEqual(
            mockPolicyContent.totalBudget,
          );
        }
      });
    });

    it("should have appropriate target demographics", () => {
      const validDemographics = [
        "young-adults",
        "families",
        "elderly",
        "students",
        "professionals",
        "low-income",
        "middle-income",
        "high-income",
        "new-immigrants",
        "disabled",
        "unemployed",
      ];

      mockPolicyContent.sections.forEach((section) => {
        section.targetDemographics.forEach((demo) => {
          expect(validDemographics).toContain(demo);
        });
      });
    });
  });

  describe("getPolicyContentById", () => {
    it("should return correct section by id", () => {
      const section = getPolicyContentById("housing-001");

      expect(section).toBeDefined();
      expect(section?.id).toBe("housing-001");
      expect(section?.category).toBe("housing");
    });

    it("should return undefined for non-existent id", () => {
      const section = getPolicyContentById("non-existent-id");

      expect(section).toBeUndefined();
    });

    it("should handle empty string id", () => {
      const section = getPolicyContentById("");

      expect(section).toBeUndefined();
    });
  });

  describe("getPolicyContentByCategory", () => {
    it("should return sections for valid category", () => {
      const housingSections = getPolicyContentByCategory("housing");

      expect(housingSections).toBeInstanceOf(Array);
      expect(housingSections.length).toBeGreaterThan(0);

      housingSections.forEach((section) => {
        expect(section.category).toBe("housing");
      });
    });

    it("should return empty array for non-existent category", () => {
      const sections = getPolicyContentByCategory("non-existent-category");

      expect(sections).toBeInstanceOf(Array);
      expect(sections.length).toBe(0);
    });

    it("should return multiple sections for categories with multiple policies", () => {
      const housingSections = getPolicyContentByCategory("housing");
      const transportSections = getPolicyContentByCategory("transportation");

      expect(housingSections.length).toBeGreaterThanOrEqual(1);
      expect(transportSections.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle case sensitivity", () => {
      const lowerCaseSections = getPolicyContentByCategory("housing");
      const upperCaseSections = getPolicyContentByCategory("HOUSING");

      expect(lowerCaseSections.length).toBeGreaterThan(0);
      expect(upperCaseSections.length).toBe(0); // Should be case sensitive
    });
  });

  describe("data consistency", () => {
    it("should have unique section IDs", () => {
      const ids = mockPolicyContent.sections.map((s) => s.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it("should have reasonable implementation timelines", () => {
      mockPolicyContent.sections.forEach((section) => {
        expect(section.implementationTimeline).toMatch(/\d{4}/); // Should contain a year
        expect(section.implementationTimeline).toContain("2025"); // Should be in the policy period
      });
    });

    it("should have non-empty key benefits", () => {
      mockPolicyContent.sections.forEach((section) => {
        expect(section.keyBenefits.length).toBeGreaterThan(0);
        section.keyBenefits.forEach((benefit) => {
          expect(benefit.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it("should have meaningful content and summaries", () => {
      mockPolicyContent.sections.forEach((section) => {
        expect(section.content.length).toBeGreaterThan(50); // Substantial content
        expect(section.summary.length).toBeGreaterThan(20); // Meaningful summary
        expect(section.summary.length).toBeLessThan(section.content.length); // Summary should be shorter
      });
    });
  });
});
