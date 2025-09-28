import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PolicyRelevanceScore } from "@/components/report/PolicyRelevanceScore";
import { ActionableAdvice } from "@/components/report/ActionableAdvice";
import { ExpandableDetails } from "@/components/report/ExpandableDetails";

describe("Report Content Rendering Components", () => {
  describe("PolicyRelevanceScore", () => {
    it("renders high score with correct styling", () => {
      const { container } = render(<PolicyRelevanceScore score={95} />);
      expect(container.textContent).toContain("95%");
      expect(container.textContent).toContain("relevant");
      expect(container.querySelector(".text-secondary-dark")).toBeTruthy();
    });

    it("renders medium score with correct styling", () => {
      const { container } = render(<PolicyRelevanceScore score={85} />);
      expect(container.textContent).toContain("85%");
      expect(container.querySelector(".text-secondary")).toBeTruthy();
    });

    it("renders low score with correct styling", () => {
      const { container } = render(<PolicyRelevanceScore score={75} />);
      expect(container.textContent).toContain("75%");
      expect(container.querySelector(".text-accent")).toBeTruthy();
    });

    it("renders without label when showLabel is false", () => {
      const { container } = render(<PolicyRelevanceScore score={85} showLabel={false} />);
      expect(container.textContent).toContain("85%");
      expect(container.textContent).not.toContain("relevant");
    });

    it("applies correct size classes", () => {
      const { container: smallContainer } = render(<PolicyRelevanceScore score={85} size="sm" />);
      expect(smallContainer.querySelector(".text-sm")).toBeTruthy();

      const { container: largeContainer } = render(<PolicyRelevanceScore score={85} size="lg" />);
      expect(largeContainer.querySelector(".text-xl")).toBeTruthy();
    });
  });

  describe("ActionableAdvice", () => {
    const mockAdvice = {
      title: "Apply for Housing Assistance",
      description: "Take advantage of new rental assistance programs that match your income bracket.",
      actionSteps: [
        "Gather required income documentation",
        "Submit online application before deadline",
        "Attend follow-up interview if selected"
      ],
      priority: "high" as const,
      category: "housing",
      timeframe: "2-4 weeks",
      difficulty: "moderate" as const
    };

    it("renders advice with all content", () => {
      const { container } = render(<ActionableAdvice {...mockAdvice} />);
      
      expect(container.textContent).toContain("Apply for Housing Assistance");
      expect(container.textContent).toContain("Take advantage of new rental assistance programs");
      expect(container.textContent).toContain("high priority");
      expect(container.textContent).toContain("moderate");
      expect(container.textContent).toContain("housing");
      expect(container.textContent).toContain("Timeframe: 2-4 weeks");
    });

    it("renders all action steps with numbering", () => {
      const { container } = render(<ActionableAdvice {...mockAdvice} />);
      
      expect(container.textContent).toContain("Gather required income documentation");
      expect(container.textContent).toContain("Submit online application before deadline");
      expect(container.textContent).toContain("Attend follow-up interview if selected");
      
      // Check for numbered steps
      expect(container.textContent).toContain("1");
      expect(container.textContent).toContain("2");
      expect(container.textContent).toContain("3");
    });

    it("applies correct priority styling", () => {
      const { container: highContainer } = render(
        <ActionableAdvice {...mockAdvice} priority="high" />
      );
      expect(highContainer.querySelector(".text-accent-dark")).toBeTruthy();

      const { container: mediumContainer } = render(
        <ActionableAdvice {...mockAdvice} priority="medium" />
      );
      expect(mediumContainer.querySelector(".text-primary-dark")).toBeTruthy();

      const { container: lowContainer } = render(
        <ActionableAdvice {...mockAdvice} priority="low" />
      );
      expect(lowContainer.querySelector(".text-secondary-dark")).toBeTruthy();
    });

    it("renders without timeframe when not provided", () => {
      const adviceWithoutTimeframe = { ...mockAdvice };
      delete adviceWithoutTimeframe.timeframe;
      
      const { container } = render(<ActionableAdvice {...adviceWithoutTimeframe} />);
      expect(container.textContent).not.toContain("Timeframe:");
    });
  });

  describe("ExpandableDetails", () => {
    const mockDetails = {
      title: "Northern Metropolis Development",
      summary: "Major urban development project creating new residential and commercial areas.",
      details: "This comprehensive development will span multiple districts and include new housing, commercial spaces, and improved transportation infrastructure. The project is expected to create thousands of jobs and provide new housing opportunities for residents.",
      icon: "🏗️"
    };

    it("renders collapsed by default", () => {
      const { container } = render(<ExpandableDetails {...mockDetails} />);
      
      expect(container.textContent).toContain("Northern Metropolis Development");
      expect(container.textContent).toContain("Major urban development project");
      // Details should not be visible when collapsed
      expect(container.textContent).not.toContain("This comprehensive development will span");
    });

    it("renders expanded when defaultExpanded is true", () => {
      const { container } = render(<ExpandableDetails {...mockDetails} defaultExpanded={true} />);
      
      expect(container.textContent).toContain("Northern Metropolis Development");
      expect(container.textContent).toContain("Major urban development project");
      expect(container.textContent).toContain("This comprehensive development will span");
    });

    it("renders icon when provided", () => {
      const { container } = render(<ExpandableDetails {...mockDetails} />);
      expect(container.textContent).toContain("🏗️");
    });

    it("applies correct variant styling", () => {
      const { container: highlightContainer } = render(
        <ExpandableDetails {...mockDetails} variant="highlight" />
      );
      expect(highlightContainer.querySelector(".bg-primary-50")).toBeTruthy();

      const { container: subtleContainer } = render(
        <ExpandableDetails {...mockDetails} variant="subtle" />
      );
      expect(subtleContainer.querySelector(".bg-neutral-50")).toBeTruthy();
    });
  });

  describe("Content Rendering with Various Data Structures", () => {
    it("handles empty action steps gracefully", () => {
      const emptyAdvice = {
        title: "Test Advice",
        description: "Test description",
        actionSteps: [],
        priority: "medium" as const,
        category: "test"
      };

      const { container } = render(<ActionableAdvice {...emptyAdvice} />);
      expect(container.textContent).toContain("Test Advice");
      expect(container.textContent).toContain("Action Steps");
    });

    it("handles long text content properly", () => {
      const longContent = {
        title: "Very Long Title That Should Wrap Properly on Mobile Devices and Not Break Layout",
        summary: "This is a very long summary that contains multiple sentences and should wrap properly across different screen sizes without breaking the layout or causing overflow issues.",
        details: "This is an extremely long details section that contains multiple paragraphs of text. ".repeat(10)
      };

      const { container } = render(<ExpandableDetails {...longContent} />);
      expect(container.textContent).toContain("Very Long Title");
      expect(container.textContent).toContain("This is a very long summary");
    });

    it("handles special characters and formatting", () => {
      const specialContent = {
        title: "Title with Special Characters: @#$%^&*()",
        description: "Description with quotes 'single' and \"double\" and symbols & < >",
        actionSteps: [
          "Step with numbers: 123-456-7890",
          "Step with symbols: user@example.com",
          "Step with formatting: Visit https://example.com"
        ],
        priority: "high" as const,
        category: "special-test"
      };

      const { container } = render(<ActionableAdvice {...specialContent} />);
      expect(container.textContent).toContain("@#$%^&*()");
      expect(container.textContent).toContain("123-456-7890");
      expect(container.textContent).toContain("user@example.com");
    });
  });
});