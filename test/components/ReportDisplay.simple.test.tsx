import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ReportDisplay } from "@/components/report/ReportDisplay";
import type { PersonalizedSummary } from "@/types";

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
      actionItems: ["Apply for Enhanced Rental Assistance by March 2025"],
      impact: "high",
    },
  ],
  majorUpdates: [
    {
      id: "northern-metropolis",
      title: "Northern Metropolis Development",
      description:
        "Major urban development project creating new residential areas.",
      relevanceToUser: "May provide new housing opportunities.",
      timeline: "2025-2030",
      impact: "medium",
    },
  ],
  recommendations: [
    {
      id: "housing-application",
      title: "Apply for Housing Assistance",
      description: "Take advantage of new rental assistance programs.",
      actionSteps: ["Gather required documentation"],
      priority: "high",
      category: "housing",
    },
  ],
  generatedAt: new Date("2024-01-15T10:30:00Z"),
};

describe("ReportDisplay", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container).toBeTruthy();
  });

  it("displays the main title", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("Your Personalized Policy Summary");
  });

  it("displays the overall score", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("85");
    expect(container.textContent).toContain("Overall Relevance Score");
  });

  it("displays section headers", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("Relevant Policy Areas");
    expect(container.textContent).toContain("Major City Updates");
    expect(container.textContent).toContain("Personalized Recommendations");
  });

  it("displays policy area content", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("Housing Initiatives");
    expect(container.textContent).toContain("92%");
    expect(container.textContent).toContain("relevant");
  });

  it("displays major updates content", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("Northern Metropolis Development");
    expect(container.textContent).toContain("Timeline: 2025-2030");
  });

  it("displays recommendations content", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("Apply for Housing Assistance");
    expect(container.textContent).toContain("high priority");
  });

  it("displays action buttons", () => {
    const { container } = render(
      <ReportDisplay summary={mockSummary} reportId="test-123" />,
    );
    expect(container.textContent).toContain("Download PDF");
    expect(container.textContent).toContain("Download Text");
    expect(container.textContent).toContain("Retake Assessment");
  });
});
