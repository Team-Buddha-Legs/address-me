import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorDisplay from "@/components/form/ErrorDisplay";

describe("ErrorDisplay Component", () => {
  it("should not render when no errors are provided", () => {
    const { container } = render(<ErrorDisplay errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render when errors array is empty", () => {
    const { container } = render(<ErrorDisplay errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render single error correctly", () => {
    const { container } = render(
      <ErrorDisplay errors={["This field is required"]} />,
    );

    expect(container.textContent).toContain("There was an error:");
    expect(container.textContent).toContain("This field is required");
  });

  it("should render multiple errors correctly", () => {
    const errors = [
      "Age must be at least 18",
      "Gender is required",
      "Marital status is required",
    ];

    const { container } = render(<ErrorDisplay errors={errors} />);

    expect(container.textContent).toContain("There were errors:");
    expect(container.textContent).toContain("Age must be at least 18");
    expect(container.textContent).toContain("Gender is required");
    expect(container.textContent).toContain("Marital status is required");
  });

  it("should render errors as a list when multiple errors", () => {
    const errors = ["Error 1", "Error 2", "Error 3"];

    const { container } = render(<ErrorDisplay errors={errors} />);

    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(3);
    expect(listItems[0].textContent).toBe("Error 1");
    expect(listItems[1].textContent).toBe("Error 2");
    expect(listItems[2].textContent).toBe("Error 3");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <ErrorDisplay errors={["Test error"]} className="custom-class" />,
    );

    const errorDiv = container.firstChild as HTMLElement;
    expect(errorDiv.className).toContain("custom-class");
  });

  it("should have correct styling classes", () => {
    const { container } = render(<ErrorDisplay errors={["Test error"]} />);

    const errorDiv = container.firstChild as HTMLElement;
    expect(errorDiv.className).toContain("bg-red-50");
    expect(errorDiv.className).toContain("border");
    expect(errorDiv.className).toContain("border-red-200");
    expect(errorDiv.className).toContain("rounded-md");
    expect(errorDiv.className).toContain("p-4");
  });

  it("should include error icon", () => {
    const { container } = render(<ErrorDisplay errors={["Test error"]} />);

    const icon = container.querySelector("svg");
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("class")).toContain("h-5");
    expect(icon?.getAttribute("class")).toContain("w-5");
    expect(icon?.getAttribute("class")).toContain("text-red-400");
  });

  it("should handle undefined errors gracefully", () => {
    const { container } = render(<ErrorDisplay errors={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });
});
