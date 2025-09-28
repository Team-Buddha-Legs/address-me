import { describe, expect, it } from "vitest";
import {
  economicStepSchema,
  educationTransportStepSchema,
  familyStepSchema,
  formStepSchema,
  healthStepSchema,
  hongKongDistrictSchema,
  incomeRangeSchema,
  locationStepSchema,
  personalInfoStepSchema,
  userProfileSchema,
} from "@/lib/validation";
import type { UserProfile } from "@/types";

describe("Validation Schemas", () => {
  describe("hongKongDistrictSchema", () => {
    it("should accept valid Hong Kong districts", () => {
      expect(() =>
        hongKongDistrictSchema.parse("central-western"),
      ).not.toThrow();
      expect(() => hongKongDistrictSchema.parse("wan-chai")).not.toThrow();
      expect(() => hongKongDistrictSchema.parse("islands")).not.toThrow();
    });

    it("should reject invalid districts", () => {
      expect(() => hongKongDistrictSchema.parse("invalid-district")).toThrow();
      expect(() => hongKongDistrictSchema.parse("")).toThrow();
      expect(() => hongKongDistrictSchema.parse(null)).toThrow();
    });
  });

  describe("incomeRangeSchema", () => {
    it("should accept valid income ranges", () => {
      expect(() => incomeRangeSchema.parse("below-10k")).not.toThrow();
      expect(() => incomeRangeSchema.parse("50k-80k")).not.toThrow();
      expect(() => incomeRangeSchema.parse("above-120k")).not.toThrow();
    });

    it("should reject invalid income ranges", () => {
      expect(() => incomeRangeSchema.parse("invalid-range")).toThrow();
      expect(() => incomeRangeSchema.parse("100k-200k")).toThrow();
    });
  });

  describe("userProfileSchema", () => {
    const validProfile: UserProfile = {
      age: 30,
      gender: "male",
      maritalStatus: "single",
      district: "central-western",
      incomeRange: "30k-50k",
      employmentStatus: "employed-full-time",
      housingType: "private-rental",
      hasChildren: false,
      educationLevel: "bachelor",
      transportationMode: ["mtr", "bus"],
    };

    it("should accept valid user profile", () => {
      expect(() => userProfileSchema.parse(validProfile)).not.toThrow();
    });

    it("should accept profile with children", () => {
      const profileWithChildren = {
        ...validProfile,
        hasChildren: true,
        childrenAges: [5, 8],
      };
      expect(() => userProfileSchema.parse(profileWithChildren)).not.toThrow();
    });

    it("should accept profile with health conditions", () => {
      const profileWithHealth = {
        ...validProfile,
        healthConditions: ["diabetes", "hypertension"],
      };
      expect(() => userProfileSchema.parse(profileWithHealth)).not.toThrow();
    });

    it("should reject profile with invalid age", () => {
      const invalidProfile = { ...validProfile, age: 17 };
      expect(() => userProfileSchema.parse(invalidProfile)).toThrow();
    });

    it("should reject profile with age over 120", () => {
      const invalidProfile = { ...validProfile, age: 121 };
      expect(() => userProfileSchema.parse(invalidProfile)).toThrow();
    });

    it("should reject profile with hasChildren true but no childrenAges", () => {
      const invalidProfile = {
        ...validProfile,
        hasChildren: true,
        // childrenAges is missing
      };
      expect(() => userProfileSchema.parse(invalidProfile)).toThrow();
    });

    it("should reject profile with hasChildren false but childrenAges provided", () => {
      const invalidProfile = {
        ...validProfile,
        hasChildren: false,
        childrenAges: [5],
      };
      expect(() => userProfileSchema.parse(invalidProfile)).toThrow();
    });

    it("should reject profile with empty transportation modes", () => {
      const invalidProfile = {
        ...validProfile,
        transportationMode: [],
      };
      expect(() => userProfileSchema.parse(invalidProfile)).toThrow();
    });

    it("should reject profile with invalid transportation mode", () => {
      const invalidProfile = {
        ...validProfile,
        transportationMode: ["invalid-mode"],
      };
      expect(() => userProfileSchema.parse(invalidProfile)).toThrow();
    });
  });

  describe("personalInfoStepSchema", () => {
    it("should accept valid personal info", () => {
      const validData = {
        age: 25,
        gender: "female" as const,
        maritalStatus: "married" as const,
      };
      expect(() => personalInfoStepSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid age", () => {
      const invalidData = {
        age: 16,
        gender: "female" as const,
        maritalStatus: "single" as const,
      };
      expect(() => personalInfoStepSchema.parse(invalidData)).toThrow();
    });
  });

  describe("locationStepSchema", () => {
    it("should accept valid district", () => {
      const validData = { district: "sha-tin" as const };
      expect(() => locationStepSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid district", () => {
      const invalidData = { district: "invalid-district" };
      expect(() => locationStepSchema.parse(invalidData)).toThrow();
    });
  });

  describe("economicStepSchema", () => {
    it("should accept valid economic data", () => {
      const validData = {
        incomeRange: "30k-50k" as const,
        employmentStatus: "employed-full-time" as const,
        housingType: "private-owned" as const,
      };
      expect(() => economicStepSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid employment status", () => {
      const invalidData = {
        incomeRange: "30k-50k" as const,
        employmentStatus: "invalid-status",
        housingType: "private-owned" as const,
      };
      expect(() => economicStepSchema.parse(invalidData)).toThrow();
    });
  });

  describe("familyStepSchema", () => {
    it("should accept family with no children", () => {
      const validData = { hasChildren: false };
      expect(() => familyStepSchema.parse(validData)).not.toThrow();
    });

    it("should accept family with children and ages", () => {
      const validData = {
        hasChildren: true,
        childrenAges: [3, 7, 12],
      };
      expect(() => familyStepSchema.parse(validData)).not.toThrow();
    });

    it("should reject family with children but no ages", () => {
      const invalidData = { hasChildren: true };
      expect(() => familyStepSchema.parse(invalidData)).toThrow();
    });

    it("should reject family without children but with ages", () => {
      const invalidData = {
        hasChildren: false,
        childrenAges: [5],
      };
      expect(() => familyStepSchema.parse(invalidData)).toThrow();
    });
  });

  describe("educationTransportStepSchema", () => {
    it("should accept valid education and transport data", () => {
      const validData = {
        educationLevel: "bachelor" as const,
        transportationMode: ["mtr", "bus"] as const,
      };
      expect(() => educationTransportStepSchema.parse(validData)).not.toThrow();
    });

    it("should reject empty transportation modes", () => {
      const invalidData = {
        educationLevel: "bachelor" as const,
        transportationMode: [],
      };
      expect(() => educationTransportStepSchema.parse(invalidData)).toThrow();
    });
  });

  describe("healthStepSchema", () => {
    it("should accept health data with conditions", () => {
      const validData = {
        healthConditions: ["diabetes", "hypertension"],
      };
      expect(() => healthStepSchema.parse(validData)).not.toThrow();
    });

    it("should accept health data without conditions", () => {
      const validData = {};
      expect(() => healthStepSchema.parse(validData)).not.toThrow();
    });

    it("should accept health data with empty conditions array", () => {
      const validData = { healthConditions: [] };
      expect(() => healthStepSchema.parse(validData)).not.toThrow();
    });
  });

  describe("formStepSchema", () => {
    it("should accept valid form step", () => {
      const validStep = {
        id: "personal-info",
        title: "Personal Information",
        description: "Tell us about yourself",
        fields: [
          {
            id: "age",
            type: "number" as const,
            label: "Age",
            required: true,
          },
        ],
        validation: {},
      };
      expect(() => formStepSchema.parse(validStep)).not.toThrow();
    });

    it("should reject form step with empty fields", () => {
      const invalidStep = {
        id: "personal-info",
        title: "Personal Information",
        description: "Tell us about yourself",
        fields: [],
        validation: {},
      };
      expect(() => formStepSchema.parse(invalidStep)).toThrow();
    });

    it("should reject form step with empty id", () => {
      const invalidStep = {
        id: "",
        title: "Personal Information",
        description: "Tell us about yourself",
        fields: [
          {
            id: "age",
            type: "number" as const,
            label: "Age",
            required: true,
          },
        ],
        validation: {},
      };
      expect(() => formStepSchema.parse(invalidStep)).toThrow();
    });
  });
});
