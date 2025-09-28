import { describe, expect, it } from "vitest";
import {
  calculateProgress,
  formSteps,
  getCompletedSteps,
  getNextStepId,
  getNextStepRoute,
  getPreviousStepId,
  getPreviousStepRoute,
  getStepById,
  getStepIndex,
  getStepRoute,
  getTotalSteps,
  isFirstStep,
  isLastStep,
} from "@/lib/form-steps";
import {
  getStepValidationErrors,
  validateStepData,
} from "@/lib/form-validation";

describe("Form Steps Configuration", () => {
  it("should have the correct number of form steps", () => {
    expect(formSteps).toHaveLength(6);
  });

  it("should have all required step properties", () => {
    formSteps.forEach((step) => {
      expect(step).toHaveProperty("id");
      expect(step).toHaveProperty("title");
      expect(step).toHaveProperty("description");
      expect(step).toHaveProperty("fields");
      expect(step.fields.length).toBeGreaterThan(0);
    });
  });

  it("should have unique step IDs", () => {
    const stepIds = formSteps.map((step) => step.id);
    const uniqueIds = new Set(stepIds);
    expect(uniqueIds.size).toBe(stepIds.length);
  });
});

describe("Step Navigation Utilities", () => {
  describe("getStepIndex", () => {
    it("should return correct index for valid step ID", () => {
      expect(getStepIndex("personal-info")).toBe(0);
      expect(getStepIndex("location")).toBe(1);
      expect(getStepIndex("health")).toBe(5);
    });

    it("should return -1 for invalid step ID", () => {
      expect(getStepIndex("invalid-step")).toBe(-1);
    });
  });

  describe("getStepById", () => {
    it("should return step object for valid ID", () => {
      const step = getStepById("personal-info");
      expect(step).toBeDefined();
      expect(step?.id).toBe("personal-info");
      expect(step?.title).toBe("Personal Information");
    });

    it("should return undefined for invalid ID", () => {
      expect(getStepById("invalid-step")).toBeUndefined();
    });
  });

  describe("getNextStepId", () => {
    it("should return next step ID for valid current step", () => {
      expect(getNextStepId("personal-info")).toBe("location");
      expect(getNextStepId("location")).toBe("economic");
    });

    it("should return null for last step", () => {
      expect(getNextStepId("health")).toBeNull();
    });

    it("should return null for invalid step", () => {
      expect(getNextStepId("invalid-step")).toBeNull();
    });
  });

  describe("getPreviousStepId", () => {
    it("should return previous step ID for valid current step", () => {
      expect(getPreviousStepId("location")).toBe("personal-info");
      expect(getPreviousStepId("health")).toBe("education-transport");
    });

    it("should return null for first step", () => {
      expect(getPreviousStepId("personal-info")).toBeNull();
    });

    it("should return null for invalid step", () => {
      expect(getPreviousStepId("invalid-step")).toBeNull();
    });
  });

  describe("isFirstStep and isLastStep", () => {
    it("should correctly identify first step", () => {
      expect(isFirstStep("personal-info")).toBe(true);
      expect(isFirstStep("location")).toBe(false);
    });

    it("should correctly identify last step", () => {
      expect(isLastStep("health")).toBe(true);
      expect(isLastStep("education-transport")).toBe(false);
    });
  });
});

describe("Progress Calculation", () => {
  describe("calculateProgress", () => {
    it("should calculate correct progress percentage", () => {
      expect(calculateProgress("personal-info")).toBe(17); // 1/6 * 100 = 16.67 rounded to 17
      expect(calculateProgress("location")).toBe(33); // 2/6 * 100 = 33.33 rounded to 33
      expect(calculateProgress("health")).toBe(100); // 6/6 * 100 = 100
    });

    it("should return 0 for invalid step", () => {
      expect(calculateProgress("invalid-step")).toBe(0);
    });
  });

  describe("getTotalSteps", () => {
    it("should return correct total number of steps", () => {
      expect(getTotalSteps()).toBe(6);
    });
  });

  describe("getCompletedSteps", () => {
    it("should return correct number of completed steps", () => {
      expect(getCompletedSteps("personal-info")).toBe(1);
      expect(getCompletedSteps("location")).toBe(2);
      expect(getCompletedSteps("health")).toBe(6);
    });

    it("should return 0 for invalid step", () => {
      expect(getCompletedSteps("invalid-step")).toBe(0);
    });
  });
});

describe("Route Generation", () => {
  describe("getStepRoute", () => {
    it("should generate correct route for step", () => {
      expect(getStepRoute("personal-info")).toBe("/assessment/personal-info");
      expect(getStepRoute("location")).toBe("/assessment/location");
    });
  });

  describe("getNextStepRoute", () => {
    it("should generate correct next step route", () => {
      expect(getNextStepRoute("personal-info")).toBe("/assessment/location");
      expect(getNextStepRoute("location")).toBe("/assessment/economic");
    });

    it("should return null for last step", () => {
      expect(getNextStepRoute("health")).toBeNull();
    });
  });

  describe("getPreviousStepRoute", () => {
    it("should generate correct previous step route", () => {
      expect(getPreviousStepRoute("location")).toBe(
        "/assessment/personal-info",
      );
      expect(getPreviousStepRoute("economic")).toBe("/assessment/location");
    });

    it("should return null for first step", () => {
      expect(getPreviousStepRoute("personal-info")).toBeNull();
    });
  });
});

describe("Validation Helpers", () => {
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

describe("Form Step Field Configuration", () => {
  it("should have correct field types for personal info step", () => {
    const personalInfoStep = getStepById("personal-info");
    expect(personalInfoStep?.fields).toHaveLength(3);

    const ageField = personalInfoStep?.fields.find((f) => f.id === "age");
    expect(ageField?.type).toBe("number");
    expect(ageField?.required).toBe(true);

    const genderField = personalInfoStep?.fields.find((f) => f.id === "gender");
    expect(genderField?.type).toBe("radio");
    expect(genderField?.options).toHaveLength(4);
  });

  it("should have correct field types for location step", () => {
    const locationStep = getStepById("location");
    expect(locationStep?.fields).toHaveLength(1);

    const districtField = locationStep?.fields.find((f) => f.id === "district");
    expect(districtField?.type).toBe("select");
    expect(districtField?.options).toHaveLength(17); // All HK districts
  });

  it("should have correct field types for education-transport step", () => {
    const educationTransportStep = getStepById("education-transport");
    expect(educationTransportStep?.fields).toHaveLength(2);

    const educationField = educationTransportStep?.fields.find(
      (f) => f.id === "educationLevel",
    );
    expect(educationField?.type).toBe("select");

    const transportField = educationTransportStep?.fields.find(
      (f) => f.id === "transportationMode",
    );
    expect(transportField?.type).toBe("checkbox");
    expect(transportField?.options).toHaveLength(7); // All transport modes
  });
});
