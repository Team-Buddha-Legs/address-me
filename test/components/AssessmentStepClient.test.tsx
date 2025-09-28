import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssessmentStepClient from "@/components/form/AssessmentStepClient";

// Mock useParams
const mockUseParams = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("AssessmentStepClient", () => {
  it("should show loading state initially", () => {
    mockUseParams.mockReturnValue({ step: "personal-info" });

    const { container } = render(<AssessmentStepClient />);
    expect(container.textContent).toContain("Loading assessment step");
  });

  it("should show error for invalid step", () => {
    mockUseParams.mockReturnValue({ step: "invalid-step" });

    const { container } = render(<AssessmentStepClient />);

    // Wait for the effect to run
    setTimeout(() => {
      expect(container.textContent).toContain("Step Not Found");
    }, 100);
  });
});
