import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ProgressIndicator from "@/components/form/ProgressIndicator";

describe("ProgressIndicator Component", () => {
  it("should render progress information correctly", () => {
    const { container } = render(
      <ProgressIndicator
        currentStep={3}
        totalSteps={6}
        progress={50}
        stepTitle="Economic Status"
      />
    );

    expect(container.textContent).toContain("Step 3 of 6");
    expect(container.textContent).toContain("50% Complete");
    expect(container.textContent).toContain("Economic Status");
  });

  it("should render progress bar with correct width", () => {
    const { container } = render(
      <ProgressIndicator
        currentStep={1}
        totalSteps={6}
        progress={17}
        stepTitle="Personal Information"
      />
    );

    const progressBar = container.querySelector('[style*="width: 17%"]');
    expect(progressBar).toBeTruthy();
  });

  it("should handle 0% progress", () => {
    const { container } = render(
      <ProgressIndicator
        currentStep={0}
        totalSteps={6}
        progress={0}
        stepTitle="Getting Started"
      />
    );

    expect(container.textContent).toContain("0% Complete");
    const progressBar = container.querySelector('[style*="width: 0%"]');
    expect(progressBar).toBeTruthy();
  });

  it("should handle 100% progress", () => {
    const { container } = render(
      <ProgressIndicator
        currentStep={6}
        totalSteps={6}
        progress={100}
        stepTitle="Health Information"
      />
    );

    expect(container.textContent).toContain("100% Complete");
    const progressBar = container.querySelector('[style*="width: 100%"]');
    expect(progressBar).toBeTruthy();
  });

  it("should apply correct CSS classes", () => {
    const { container } = render(
      <ProgressIndicator
        currentStep={2}
        totalSteps={6}
        progress={33}
        stepTitle="Location"
      />
    );

    // Check for gradient classes on progress bar
    const progressBar = container.querySelector('.bg-gradient-to-r.from-blue-500.to-blue-600');
    expect(progressBar).toBeTruthy();

    // Check for step title
    expect(container.textContent).toContain("Location");
  });
});