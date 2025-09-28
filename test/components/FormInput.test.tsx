import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FormInput from "@/components/form/FormInput";
import type { FormField } from "@/types";

describe("FormInput Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Text Input", () => {
    const textField: FormField = {
      id: "test-text",
      type: "text",
      label: "Test Text Field",
      placeholder: "Enter text",
      required: true,
    };

    it("should render text input correctly", () => {
      const { container } = render(
        <FormInput field={textField} value="" onChange={mockOnChange} />,
      );

      const input = container.querySelector('input[type="text"]');
      expect(input).toBeTruthy();
      expect(input?.getAttribute("placeholder")).toBe("Enter text");
    });

    it("should call onChange when text input value changes", () => {
      render(<FormInput field={textField} value="" onChange={mockOnChange} />);

      const input = screen.getByDisplayValue("");
      fireEvent.change(input, { target: { value: "test value" } });

      expect(mockOnChange).toHaveBeenCalledWith("test value");
    });
  });

  describe("Number Input", () => {
    const numberField: FormField = {
      id: "test-number",
      type: "number",
      label: "Test Number Field",
      placeholder: "Enter number",
      required: true,
    };

    it("should call onChange with number value", () => {
      render(
        <FormInput field={numberField} value="" onChange={mockOnChange} />,
      );

      const input = screen.getByDisplayValue("");
      fireEvent.change(input, { target: { value: "42" } });

      expect(mockOnChange).toHaveBeenCalledWith(42);
    });

    it("should handle empty number input", () => {
      render(
        <FormInput field={numberField} value={25} onChange={mockOnChange} />,
      );

      const input = screen.getByDisplayValue("25");
      fireEvent.change(input, { target: { value: "" } });

      expect(mockOnChange).toHaveBeenCalledWith("");
    });
  });

  describe("Select Input", () => {
    const selectField: FormField = {
      id: "test-select",
      type: "select",
      label: "Test Select Field",
      placeholder: "Choose option",
      required: true,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    };

    it("should call onChange when option is selected", () => {
      const { container } = render(
        <FormInput field={selectField} value="" onChange={mockOnChange} />,
      );

      const select = container.querySelector("select");
      expect(select).toBeTruthy();

      fireEvent.change(select!, { target: { value: "option2" } });
      expect(mockOnChange).toHaveBeenCalledWith("option2");
    });
  });

  describe("Radio Input", () => {
    const radioField: FormField = {
      id: "test-radio",
      type: "radio",
      label: "Test Radio Field",
      required: true,
      options: [
        { value: "radio1", label: "Radio 1" },
        { value: "radio2", label: "Radio 2" },
      ],
    };

    it("should call onChange when radio option is selected", () => {
      const { container } = render(
        <FormInput field={radioField} value="" onChange={mockOnChange} />,
      );

      const radio = container.querySelector('input[value="radio1"]');
      expect(radio).toBeTruthy();

      fireEvent.click(radio!);
      expect(mockOnChange).toHaveBeenCalledWith("radio1");
    });
  });

  describe("Checkbox Input", () => {
    const checkboxField: FormField = {
      id: "test-checkbox",
      type: "checkbox",
      label: "Test Checkbox Field",
      required: true,
      options: [
        { value: "check1", label: "Checkbox 1" },
        { value: "check2", label: "Checkbox 2" },
        { value: "check3", label: "Checkbox 3" },
      ],
    };

    it("should call onChange when checkbox is checked", () => {
      const { container } = render(
        <FormInput field={checkboxField} value={[]} onChange={mockOnChange} />,
      );

      const checkbox = container.querySelector('input[value="check1"]');
      expect(checkbox).toBeTruthy();

      fireEvent.click(checkbox!);
      expect(mockOnChange).toHaveBeenCalledWith(["check1"]);
    });

    it("should call onChange when checkbox is unchecked", () => {
      const { container } = render(
        <FormInput
          field={checkboxField}
          value={["check1", "check2"]}
          onChange={mockOnChange}
        />,
      );

      const checkbox = container.querySelector('input[value="check1"]');
      expect(checkbox).toBeTruthy();

      fireEvent.click(checkbox!);
      expect(mockOnChange).toHaveBeenCalledWith(["check2"]);
    });
  });
});
