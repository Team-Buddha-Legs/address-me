import { describe, it, expect } from "vitest";
import { validateStepData, getStepValidationErrors } from "@/lib/form-validation";

describe("Form Validation", () => {
  describe("validateStepData", () => {
    it("should validate correct personal info data", () => {
      const validData = {
        age: 25,
        gender: "male",
        maritalStatus: "single",
      };
      expect(validateStepData("personal-info", validData)).toBe(true);
    });

    it("should reject invalid personal info data", () => {
      const invalidData = {
        age: 15, // Too young
        gender: "male",
        maritalStatus: "single",
      };
      expect(validateStepData("personal-info", invalidData)).toBe(false);
    });

    it("should validate correct location data", () => {
      const validData = {
        district: "central-western",
      };
      expect(validateStepData("location", validData)).toBe(true);
    });

    it("should reject invalid location data", () => {
      const invalidData = {
        district: "invalid-district",
      };
      expect(validateStepData("location", invalidData)).toBe(false);
    });

    it("should return false for invalid step ID", () => {
      expect(validateStepData("invalid-step", {})).toBe(false);
    });
  });

  describe("getStepValidationErrors", () => {
    it("should return empty array for valid data", () => {
      const validData = {
        age: 25,
        gender: "male",
        maritalStatus: "single",
      };
      const errors = getStepValidationErrors("personal-info", validData);
      expect(errors).toHaveLength(0);
    });

    it("should return error messages for invalid data", () => {
      const invalidData = {
        age: 15, // Too young
        gender: "invalid-gender",
        maritalStatus: "single",
      };
      const errors = getStepValidationErrors("personal-info", invalidData);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should return error for invalid step ID", () => {
      const errors = getStepValidationErrors("invalid-step", {});
      expect(errors).toEqual(["Invalid step"]);
    });
  });
});