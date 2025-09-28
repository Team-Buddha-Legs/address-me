import { describe, expect, it } from "vitest";
import { validateStepData } from "@/lib/form-validation";

describe("Health Form Conversion", () => {
  describe("Health Step Array Handling", () => {
    it("should accept empty healthConditions array", () => {
      const validData = {
        healthConditions: [],
      };
      expect(validateStepData("health", validData)).toBe(true);
    });

    it("should accept healthConditions as string array", () => {
      const validData = {
        healthConditions: ["diabetes", "hypertension", "mobility issues"],
      };
      expect(validateStepData("health", validData)).toBe(true);
    });

    it("should accept health data without healthConditions field", () => {
      const validData = {};
      expect(validateStepData("health", validData)).toBe(true);
    });

    it("should reject healthConditions as string", () => {
      const invalidData = {
        healthConditions: "diabetes, hypertension", // String instead of array
      };
      expect(validateStepData("health", invalidData)).toBe(false);
    });

    it("should accept single health condition in array", () => {
      const validData = {
        healthConditions: ["diabetes"],
      };
      expect(validateStepData("health", validData)).toBe(true);
    });

    it("should handle health conditions with various formats", () => {
      const validData = {
        healthConditions: [
          "Type 2 Diabetes",
          "High Blood Pressure",
          "Chronic Back Pain",
          "Asthma",
        ],
      };
      expect(validateStepData("health", validData)).toBe(true);
    });
  });
});
