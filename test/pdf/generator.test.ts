import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateFileName, generatePDF } from "@/lib/pdf/generator";
import type { PersonalizedSummary } from "@/types";

// Mock React-PDF
vi.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: { children: React.ReactNode }) => children,
  Page: ({ children }: { children: React.ReactNode }) => children,
  Text: ({ children }: { children: React.ReactNode }) => children,
  View: ({ children }: { children: React.ReactNode }) => children,
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Font: {
    register: vi.fn(),
  },
  pdf: vi.fn(() => ({
    toBlob: vi
      .fn()
      .mockResolvedValue(
        new Blob(["mock pdf content"], { type: "application/pdf" }),
      ),
  })),
}));

const mockSummary: PersonalizedSummary = {
  overallScore: 85,
  relevantAreas: [
    {
      category: "housing",
      title: "Housing Initiatives",
      relevanceScore: 92,
      summary:
        "New public housing developments and rental assistance programs.",
      details:
        "Based on your housing type and income range, you qualify for several new housing initiatives.",
      actionItems: [
        "Apply for Enhanced Rental Assistance by March 2025",
        "Register for priority housing allocation in your district",
      ],
      impact: "high",
    },
  ],
  majorUpdates: [
    {
      id: "northern-metropolis",
      title: "Northern Metropolis Development",
      description:
        "Major urban development project creating new residential and commercial areas.",
      relevanceToUser:
        "May provide new housing and employment opportunities within commuting distance.",
      timeline: "2025-2030",
      impact: "medium",
    },
  ],
  recommendations: [
    {
      id: "housing-application",
      title: "Apply for Housing Assistance",
      description:
        "Take advantage of new rental assistance programs that match your income bracket.",
      actionSteps: [
        "Gather required income documentation",
        "Submit online application before deadline",
      ],
      priority: "high",
      category: "housing",
    },
  ],
  generatedAt: new Date("2024-01-15T10:30:00Z"),
};

describe("PDF Generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generatePDF", () => {
    it("should generate a PDF blob successfully", async () => {
      const reportId = "test-report-123";

      const result = await generatePDF(mockSummary, reportId);

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe("application/pdf");
    });

    it("should handle PDF generation errors", async () => {
      const { pdf } = await import("@react-pdf/renderer");
      vi.mocked(pdf).mockImplementation(() => ({
        toBlob: vi.fn().mockRejectedValue(new Error("PDF generation failed")),
      }));

      const reportId = "test-report-123";

      await expect(generatePDF(mockSummary, reportId)).rejects.toThrow(
        "Failed to generate PDF report",
      );
    });
  });

  describe("generateFileName", () => {
    it("should generate correct filename format", () => {
      const reportId = "test-report-123";

      const fileName = generateFileName(mockSummary, reportId);

      expect(fileName).toBe("policy-summary-test-report-123-2024-01-15.pdf");
    });

    it("should handle different report IDs", () => {
      const reportId = "another-report-456";

      const fileName = generateFileName(mockSummary, reportId);

      expect(fileName).toBe("policy-summary-another-report-456-2024-01-15.pdf");
    });

    it("should use ISO date format", () => {
      const summaryWithDifferentDate: PersonalizedSummary = {
        ...mockSummary,
        generatedAt: new Date("2024-12-25T15:45:30Z"),
      };
      const reportId = "christmas-report";

      const fileName = generateFileName(summaryWithDifferentDate, reportId);

      expect(fileName).toBe("policy-summary-christmas-report-2024-12-25.pdf");
    });
  });
});
