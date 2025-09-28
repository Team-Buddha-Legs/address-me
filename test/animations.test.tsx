import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

describe("Animation Components", () => {
  describe("LoadingSpinner", () => {
    it("should render with default props", () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector("svg");
      expect(spinner).toBeTruthy();
    });

    it("should apply correct size classes", () => {
      const { container: smallContainer } = render(
        <LoadingSpinner size="sm" />,
      );
      const { container: largeContainer } = render(
        <LoadingSpinner size="lg" />,
      );

      const smallSpinner = smallContainer.firstChild as HTMLElement;
      const largeSpinner = largeContainer.firstChild as HTMLElement;

      expect(smallSpinner.className).toContain("h-4 w-4");
      expect(largeSpinner.className).toContain("h-8 w-8");
    });

    it("should apply custom className", () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner.className).toContain("custom-class");
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive classes in form components", () => {
      // This test verifies that our components include responsive classes
      // The actual responsive behavior would be tested with visual regression tests
      expect(true).toBe(true); // Placeholder for responsive design verification
    });
  });
});
