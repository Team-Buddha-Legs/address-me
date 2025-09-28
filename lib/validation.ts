import { z } from "zod";
import type {
  EducationLevel,
  EmploymentStatus,
  FormStep,
  HongKongDistrict,
  HousingType,
  IncomeRange,
  PolicyCategory,
  TransportationMode,
  UserProfile,
} from "@/types";

// Hong Kong specific enum schemas
export const hongKongDistrictSchema = z.enum([
  "central-western",
  "wan-chai",
  "eastern",
  "southern",
  "yau-tsim-mong",
  "sham-shui-po",
  "kowloon-city",
  "wong-tai-sin",
  "kwun-tong",
  "tsuen-wan",
  "tuen-mun",
  "yuen-long",
  "north",
  "tai-po",
  "sha-tin",
  "sai-kung",
  "islands",
]);

export const incomeRangeSchema = z.enum([
  "below-10k",
  "10k-20k",
  "20k-30k",
  "30k-50k",
  "50k-80k",
  "80k-120k",
  "above-120k",
]);

export const employmentStatusSchema = z.enum([
  "employed-full-time",
  "employed-part-time",
  "self-employed",
  "unemployed",
  "student",
  "retired",
]);

export const housingTypeSchema = z.enum([
  "public-rental",
  "subsidized-sale",
  "private-rental",
  "private-owned",
  "temporary",
  "other",
]);

export const educationLevelSchema = z.enum([
  "primary",
  "secondary",
  "post-secondary",
  "bachelor",
  "master",
  "doctorate",
]);

export const transportationModeSchema = z.enum([
  "mtr",
  "bus",
  "minibus",
  "taxi",
  "private-car",
  "bicycle",
  "walking",
]);

export const policyCategorySchema = z.enum([
  "housing",
  "transportation",
  "healthcare",
  "education",
  "employment",
  "social-welfare",
]);

// User Profile validation schema
export const userProfileSchema = z
  .object({
    age: z
      .number()
      .int()
      .min(18, "Must be at least 18 years old")
      .max(120, "Age must be realistic"),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
    district: hongKongDistrictSchema,
    incomeRange: incomeRangeSchema,
    employmentStatus: employmentStatusSchema,
    housingType: housingTypeSchema,
    hasChildren: z.boolean(),
    childrenAges: z.array(z.number().int().min(0).max(25)).optional(),
    educationLevel: educationLevelSchema,
    healthConditions: z.array(z.string()).optional(),
    transportationMode: z
      .array(transportationModeSchema)
      .min(1, "At least one transportation mode must be selected"),
  })
  .superRefine((data, ctx) => {
    // Validate children ages based on hasChildren flag
    if (
      data.hasChildren &&
      (!data.childrenAges || data.childrenAges.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Children ages must be provided if hasChildren is true",
        path: ["childrenAges"],
      });
    }
    if (
      !data.hasChildren &&
      data.childrenAges &&
      data.childrenAges.length > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Children ages should not be provided if hasChildren is false",
        path: ["childrenAges"],
      });
    }
  });

// Form field validation schema
export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["select", "radio", "checkbox", "number", "text"]),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
  required: z.boolean(),
  validation: z.unknown().optional(),
});

// Form step validation schema
export const formStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  fields: z.array(formFieldSchema).min(1),
  validation: z.unknown(),
});

// Individual form step schemas for specific steps
export const personalInfoStepSchema = z.object({
  age: z.number().int().min(18).max(120),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
});

export const locationStepSchema = z.object({
  district: hongKongDistrictSchema,
});

export const economicStepSchema = z.object({
  incomeRange: incomeRangeSchema,
  employmentStatus: employmentStatusSchema,
  housingType: housingTypeSchema,
});

export const familyStepSchema = z
  .object({
    hasChildren: z.boolean(),
    childrenAges: z.array(z.number().int().min(0).max(25)).optional(),
  })
  .superRefine((data, ctx) => {
    // Validate children ages based on hasChildren flag
    if (
      data.hasChildren &&
      (!data.childrenAges || data.childrenAges.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Children ages must be provided if hasChildren is true",
        path: ["childrenAges"],
      });
    }
    if (
      !data.hasChildren &&
      data.childrenAges &&
      data.childrenAges.length > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Children ages should not be provided if hasChildren is false",
        path: ["childrenAges"],
      });
    }
  });

export const educationTransportStepSchema = z.object({
  educationLevel: educationLevelSchema,
  transportationMode: z
    .array(transportationModeSchema)
    .min(1, "At least one transportation mode must be selected"),
});

export const healthStepSchema = z.object({
  healthConditions: z.array(z.string()).optional(),
});

// Type exports for the schemas
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type FormFieldInput = z.infer<typeof formFieldSchema>;
export type FormStepInput = z.infer<typeof formStepSchema>;
export type PersonalInfoStepInput = z.infer<typeof personalInfoStepSchema>;
export type LocationStepInput = z.infer<typeof locationStepSchema>;
export type EconomicStepInput = z.infer<typeof economicStepSchema>;
export type FamilyStepInput = z.infer<typeof familyStepSchema>;
export type EducationTransportStepInput = z.infer<
  typeof educationTransportStepSchema
>;
export type HealthStepInput = z.infer<typeof healthStepSchema>;
