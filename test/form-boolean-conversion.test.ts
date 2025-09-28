import { describe, expect, it } from "vitest";
import { validateStepData } from "@/lib/form-validation";

describe("Form Boolean Conversion", () => {
  describe("Family Step Boolean Handling", () => {
    it("should accept boolean true for hasChildren", () => {
      const validData = {
        hasChildren: true,
        childrenAges: [5, 8],
      };
      expect(validateStepData("family", validData)).toBe(true);
    });

    it("should accept boolean false for hasChildren", () => {
      const validData = {
        hasChildren: false,
      };
      expect(validateStepData("family", validData)).toBe(true);
    });

    it("should reject string values for hasChildren", () => {
      const invalidData = {
        hasChildren: "true", // String instead of boolean
        childrenAges: [5, 8],
      };
      expect(validateStepData("family", invalidData)).toBe(false);
    });

    it("should handle empty childrenAges array", () => {
      const validData = {
        hasChildren: false,
        childrenAges: [],
      };
      expect(validateStepData("family", validData)).toBe(true);
    });

    it("should validate childrenAges as number array", () => {
      const validData = {
        hasChildren: true,
        childrenAges: [3, 7, 12, 16],
      };
      expect(validateStepData("family", validData)).toBe(true);
    });

    it("should reject when hasChildren is true but no childrenAges", () => {
      const invalidData = {
        hasChildren: true,
        // Missing childrenAges
      };
      expect(validateStepData("family", invalidData)).toBe(false);
    });

    it("should reject when hasChildren is false but childrenAges provided", () => {
      const invalidData = {
        hasChildren: false,
        childrenAges: [5], // Should not provide ages if no children
      };
      expect(validateStepData("family", invalidData)).toBe(false);
    });
  });

  describe("Health Step Array Handling", () => {
    it("should accept healthConditions as string array", () => {
      const validData = {
        healthConditions: ["diabetes", "hypertension"],
      };
      expect(validateStepData("health", validData)).toBe(true);
    });

    it("should accept empty healthConditions", () => {
      const validData = {
        healthConditions: [],
      };
      expect(validateStepData("health", validData)).toBe(true);
    });

    it("should reject healthConditions as string", () => {
      const invalidData = {
        healthConditions: "diabetes, hypertension", // String instead of array
      };
      expect(validateStepData("health", invalidData)).toBe(false);
    });
  });
});
