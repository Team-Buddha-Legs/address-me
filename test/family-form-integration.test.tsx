import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import FormInput from "@/components/form/FormInput";
import type { FormField } from "@/types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe("Family Form Integration", () => {
  it("should convert hasChildren radio values to boolean", () => {
    const hasChildrenField: FormField = {
      id: "hasChildren",
      type: "radio",
      label: "Do you have children?",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      required: true,
    };

    const mockOnChange = vi.fn();

    const { container } = render(
      <FormInput
        field={hasChildrenField}
        value={false}
        onChange={mockOnChange}
      />
    );

    // Click the "Yes" radio button
    const yesRadio = container.querySelector('input[value="true"]') as HTMLInputElement;
    expect(yesRadio).toBeTruthy();
    
    fireEvent.click(yesRadio);
    
    // Should call onChange with boolean true, not string "true"
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it("should convert childrenAges text to number array", () => {
    const childrenAgesField: FormField = {
      id: "childrenAges",
      type: "text",
      label: "Children ages",
      placeholder: "e.g., 5, 8, 12",
      required: false,
    };

    const mockOnChange = vi.fn();

    const { container } = render(
      <FormInput
        field={childrenAgesField}
        value={[]}
        onChange={mockOnChange}
      />
    );

    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(textInput).toBeTruthy();
    
    fireEvent.change(textInput, { target: { value: "5, 8, 12" } });
    
    // Should call onChange with array of numbers
    expect(mockOnChange).toHaveBeenCalledWith([5, 8, 12]);
  });

  it("should handle empty childrenAges input", () => {
    const childrenAgesField: FormField = {
      id: "childrenAges",
      type: "text",
      label: "Children ages",
      placeholder: "e.g., 5, 8, 12",
      required: false,
    };

    const mockOnChange = vi.fn();

    const { container } = render(
      <FormInput
        field={childrenAgesField}
        value={[5, 8]}
        onChange={mockOnChange}
      />
    );

    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    
    fireEvent.change(textInput, { target: { value: "" } });
    
    // Should call onChange with empty array
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("should display childrenAges array as comma-separated string", () => {
    const childrenAgesField: FormField = {
      id: "childrenAges",
      type: "text",
      label: "Children ages",
      placeholder: "e.g., 5, 8, 12",
      required: false,
    };

    const mockOnChange = vi.fn();

    const { container } = render(
      <FormInput
        field={childrenAgesField}
        value={[5, 8, 12]}
        onChange={mockOnChange}
      />
    );

    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(textInput.value).toBe("5, 8, 12");
  });

  it("should convert healthConditions text to string array", () => {
    const healthConditionsField: FormField = {
      id: "healthConditions",
      type: "text",
      label: "Health conditions",
      placeholder: "e.g., diabetes, hypertension",
      required: false,
    };

    const mockOnChange = vi.fn();

    const { container } = render(
      <FormInput
        field={healthConditionsField}
        value={[]}
        onChange={mockOnChange}
      />
    );

    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(textInput).toBeTruthy();
    
    fireEvent.change(textInput, { target: { value: "diabetes, hypertension, asthma" } });
    
    // Should call onChange with array of strings
    expect(mockOnChange).toHaveBeenCalledWith(["diabetes", "hypertension", "asthma"]);
  });

  it("should display healthConditions array as comma-separated string", () => {
    const healthConditionsField: FormField = {
      id: "healthConditions",
      type: "text",
      label: "Health conditions",
      placeholder: "e.g., diabetes, hypertension",
      required: false,
    };

    const mockOnChange = vi.fn();

    const { container } = render(
      <FormInput
        field={healthConditionsField}
        value={["diabetes", "hypertension"]}
        onChange={mockOnChange}
      />
    );

    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(textInput.value).toBe("diabetes, hypertension");
  });
});