import { describe, expect, it } from "vitest";
import type {
  PersonalizedSummary,
  PolicyArea,
  Recommendation,
} from "@/lib/summary/types";
import {
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
} from "@/lib/summary/utils";

describe("Summary Utils", () => {
  const mockPolicyAreas: PolicyArea[] = [
    {
      category: "housing",
      title: "Public Housing Initiative",
      relevanceScore: 85,
      summary: "Housing summary",
      details: "Housing details",
      actionItems: ["Apply for housing"],
      impact: "high",
      keyBenefits: ["Affordable housing"],
    },
    {
      category: "transportation",
      title: "MTR Expansion",
      relevanceScore: 75,
      summary: "Transport summary",
      details: "Transport details",
      actionItems: ["Use new routes"],
      impact: "medium",
      keyBenefits: ["Better connectivity"],
    },
    {
      category: "healthcare",
      title: "Digital Health Platform",
      relevanceScore: 90,
      summary: "Healthcare summary",
      details: "Healthcare details",
      actionItems: ["Register online"],
      impact: "high",
      keyBenefits: ["Online consultations"],
    },
  ];

  const mockRecommendations: Recommendation[] = [
    {
      id: "rec-1",
      title: "Apply for Housing",
      description: "Apply for public housing",
      priority: "high",
      category: "housing",
      actionSteps: ["Gather documents", "Submit application"],
      expectedBenefit: "Affordable housing",
      timeframe: "2025-2026",
    },
    {
      id: "rec-2",
      title: "Use Health Platform",
      description: "Register for digital health services",
      priority: "medium",
      category: "healthcare",
      actionSteps: ["Create account", "Book consultation"],
      expectedBenefit: "Online healthcare",
      timeframe: "2025",
    },
  ];

  const mockSummary: PersonalizedSummary = {
    id: "summary-123",
    userProfileId: "user-456",
    overallScore: 82,
    relevantAreas: mockPolicyAreas,
    majorUpdates: [
      {
        id: "update-1",
        title: "Major Housing Development",
        category: "housing",
        description: "Large scale housing project",
        timeline: "2025-2028",
        impact: "City-wide impact",
        relevanceToUser: "High relevance for families",
      },
    ],
    recommendations: mockRecommendations,
    generatedAt: new Date("2024-01-15T10:00:00Z"),
    aiProvider: "aws-bedrock",
    processingTimeMs: 1500,
  };

  describe("filterPolicyAreasByCategory", () => {
    it("should filter areas by single category", () => {
      const result = filterPolicyAreasByCategory(mockPolicyAreas, ["housing"]);

      expect(result.length).toBe(1);
      expect(result[0].category).toBe("housing");
    });

    it("should filter areas by multiple categories", () => {
      const result = filterPolicyAreasByCategory(mockPolicyAreas, [
        "housing",
        "healthcare",
      ]);

      expect(result.length).toBe(2);
      expect(result.map((a) => a.category)).toEqual(["housing", "healthcare"]);
    });

    it("should return empty array for non-matching categories", () => {
      const result = filterPolicyAreasByCategory(mockPolicyAreas, [
        "education",
      ]);

      expect(result.length).toBe(0);
    });
  });

  describe("sortPolicyAreasByRelevance", () => {
    it("should sort areas by relevance score descending", () => {
      const result = sortPolicyAreasByRelevance(mockPolicyAreas);

      expect(result[0].relevanceScore).toBe(90); // Healthcare
      expect(result[1].relevanceScore).toBe(85); // Housing
      expect(result[2].relevanceScore).toBe(75); // Transportation
    });

    it("should not mutate original array", () => {
      const original = [...mockPolicyAreas];
      sortPolicyAreasByRelevance(mockPolicyAreas);

      expect(mockPolicyAreas).toEqual(original);
    });
  });

  describe("getHighImpactAreas", () => {
    it("should return only high impact areas", () => {
      const result = getHighImpactAreas(mockPolicyAreas);

      expect(result.length).toBe(2);
      expect(result.every((area) => area.impact === "high")).toBe(true);
    });

    it("should return empty array if no high impact areas", () => {
      const lowImpactAreas = mockPolicyAreas.map((area) => ({
        ...area,
        impact: "low" as const,
      }));
      const result = getHighImpactAreas(lowImpactAreas);

      expect(result.length).toBe(0);
    });
  });

  describe("getRecommendationsByPriority", () => {
    it("should filter recommendations by priority", () => {
      const highPriority = getRecommendationsByPriority(
        mockRecommendations,
        "high",
      );
      const mediumPriority = getRecommendationsByPriority(
        mockRecommendations,
        "medium",
      );

      expect(highPriority.length).toBe(1);
      expect(highPriority[0].priority).toBe("high");

      expect(mediumPriority.length).toBe(1);
      expect(mediumPriority[0].priority).toBe("medium");
    });
  });

  describe("calculateCategoryDistribution", () => {
    it("should calculate correct category counts", () => {
      const result = calculateCategoryDistribution(mockPolicyAreas);

      expect(result.housing).toBe(1);
      expect(result.transportation).toBe(1);
      expect(result.healthcare).toBe(1);
    });

    it("should handle empty areas array", () => {
      const result = calculateCategoryDistribution([]);

      expect(Object.keys(result).length).toBe(0);
    });
  });

  describe("formatSummaryForDisplay", () => {
    it("should format summary with correct display text", () => {
      const result = formatSummaryForDisplay(mockSummary);

      expect(result.title).toBe("Your Personalized Policy Summary");
      expect(result.subtitle).toContain("3 relevant policy areas");
      expect(result.scoreText).toBe("82% relevance match");
      expect(result.areasCount).toBe(3);
      expect(result.recommendationsCount).toBe(2);
    });
  });

  describe("generateSummaryStatistics", () => {
    it("should generate correct statistics", () => {
      const stats = generateSummaryStatistics(mockSummary);

      expect(stats.totalAreas).toBe(3);
      expect(stats.highImpactAreas).toBe(2);
      expect(stats.averageRelevanceScore).toBe(83); // (85+75+90)/3 = 83.33 rounded
      expect(stats.topCategory).toBeDefined();
      expect(stats.highPriorityRecommendations).toBe(1);
    });

    it("should handle empty summary", () => {
      const emptySummary: PersonalizedSummary = {
        ...mockSummary,
        relevantAreas: [],
        recommendations: [],
      };

      const stats = generateSummaryStatistics(emptySummary);

      expect(stats.totalAreas).toBe(0);
      expect(stats.highImpactAreas).toBe(0);
      expect(stats.averageRelevanceScore).toBe(0);
      expect(stats.topCategory).toBeNull();
      expect(stats.highPriorityRecommendations).toBe(0);
    });
  });

  describe("validateSummary", () => {
    it("should validate complete summary as valid", () => {
      const result = validateSummary(mockSummary);

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should identify missing required fields", () => {
      const invalidSummary: PersonalizedSummary = {
        ...mockSummary,
        id: "",
        overallScore: 50, // Below minimum 70
      };

      const result = validateSummary(invalidSummary);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Summary ID is required");
      expect(result.errors).toContain("Overall score must be between 70-100");
    });

    it("should identify content validation issues", () => {
      const invalidSummary: PersonalizedSummary = {
        ...mockSummary,
        relevantAreas: [
          {
            ...mockPolicyAreas[0],
            title: "", // Missing title
            relevanceScore: 150, // Invalid score
          },
        ],
      };

      const result = validateSummary(invalidSummary);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("missing title"))).toBe(true);
      expect(
        result.errors.some((e) => e.includes("invalid relevance score")),
      ).toBe(true);
    });

    it("should generate quality warnings", () => {
      const minimalSummary: PersonalizedSummary = {
        ...mockSummary,
        relevantAreas: [mockPolicyAreas[0]], // Only 1 area
        recommendations: [mockRecommendations[0]], // Only 1 recommendation
      };

      const result = validateSummary(minimalSummary);

      expect(
        result.warnings.some((w) => w.includes("more relevant policy areas")),
      ).toBe(true);
      expect(
        result.warnings.some((w) => w.includes("more recommendations")),
      ).toBe(true);
    });
  });

  describe("createSummaryExcerpt", () => {
    it("should create excerpt from top policy area", () => {
      const excerpt = createSummaryExcerpt(mockSummary, 100);

      expect(excerpt).toContain("Public Housing Initiative");
      expect(excerpt).toContain("85% relevance");
      expect(excerpt.length).toBeLessThanOrEqual(100);
    });

    it("should handle empty summary", () => {
      const emptySummary: PersonalizedSummary = {
        ...mockSummary,
        relevantAreas: [],
      };

      const excerpt = createSummaryExcerpt(emptySummary);

      expect(excerpt).toBe("No relevant policy areas found.");
    });

    it("should truncate long excerpts", () => {
      const excerpt = createSummaryExcerpt(mockSummary, 50);

      expect(excerpt.length).toBeLessThanOrEqual(50);
      if (excerpt.length === 50) {
        expect(excerpt.endsWith("...")).toBe(true);
      }
    });
  });

  describe("exportSummaryData", () => {
    it("should export summary in structured format", () => {
      const exported = exportSummaryData(mockSummary);

      expect(exported.metadata.id).toBe("summary-123");
      expect(exported.metadata.overallScore).toBe(82);
      expect(exported.metadata.aiProvider).toBe("aws-bedrock");
      expect(exported.metadata.generatedAt).toBe("2024-01-15T10:00:00.000Z");

      expect(exported.content.relevantAreas.length).toBe(3);
      expect(exported.content.recommendations.length).toBe(2);
      expect(exported.content.majorUpdates.length).toBe(1);
    });

    it("should include all required fields in export", () => {
      const exported = exportSummaryData(mockSummary);

      exported.content.relevantAreas.forEach((area) => {
        expect(area.category).toBeDefined();
        expect(area.title).toBeDefined();
        expect(area.relevanceScore).toBeDefined();
        expect(area.summary).toBeDefined();
        expect(area.impact).toBeDefined();
      });

      exported.content.recommendations.forEach((rec) => {
        expect(rec.title).toBeDefined();
        expect(rec.description).toBeDefined();
        expect(rec.priority).toBeDefined();
        expect(rec.category).toBeDefined();
      });
    });
  });
});
