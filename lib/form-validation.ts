"use client";

import {
  economicStepSchema,
  educationTransportStepSchema,
  familyStepSchema,
  healthStepSchema,
  locationStepSchema,
  personalInfoStepSchema,
} from "@/lib/validation";

// Validation schema mapping for client-side use
const validationSchemas = {
  "personal-info": personalInfoStepSchema,
  location: locationStepSchema,
  economic: economicStepSchema,
  family: familyStepSchema,
  "education-transport": educationTransportStepSchema,
  health: healthStepSchema,
} as const;

// Validation helpers for client components
export const validateStepData = (stepId: string, data: unknown): boolean => {
  const schema = validationSchemas[stepId as keyof typeof validationSchemas];
  if (!schema) return false;

  try {
    schema.parse(data);
    return true;
  } catch {
    return false;
  }
};

export const getStepValidationErrors = (
  stepId: string,
  data: unknown,
): string[] => {
  console.log("getStepValidationErrors: stepId, data", stepId, data);
  const schema = validationSchemas[stepId as keyof typeof validationSchemas];
  if (!schema) return ["Invalid step"];

  try {
    schema.parse(data);
    return [];
  } catch (error: any) {
    if (error.errors) {
      return error.errors.map((err: any) => err.message);
    }
    return ["Validation failed"];
  }
};
