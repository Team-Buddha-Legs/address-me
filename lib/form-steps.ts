import type { FormStep } from "@/types";

// Form step configuration with questions and flow logic (without validation schemas)
export const formSteps: Omit<FormStep, "validation">[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    description: "Tell us a bit about yourself to get started",
    fields: [
      {
        id: "age",
        type: "number",
        label: "What is your age?",
        placeholder: "Enter your age",
        required: true,
      },
      {
        id: "gender",
        type: "radio",
        label: "What is your gender?",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
        ],
        required: true,
      },
      {
        id: "maritalStatus",
        type: "radio",
        label: "What is your marital status?",
        options: [
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "divorced", label: "Divorced" },
          { value: "widowed", label: "Widowed" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "location",
    title: "Location",
    description: "Where do you live in Hong Kong?",
    fields: [
      {
        id: "district",
        type: "select",
        label: "Which district do you live in?",
        placeholder: "Select your district",
        options: [
          { value: "central-western", label: "Central and Western" },
          { value: "wan-chai", label: "Wan Chai" },
          { value: "eastern", label: "Eastern" },
          { value: "southern", label: "Southern" },
          { value: "yau-tsim-mong", label: "Yau Tsim Mong" },
          { value: "sham-shui-po", label: "Sham Shui Po" },
          { value: "kowloon-city", label: "Kowloon City" },
          { value: "wong-tai-sin", label: "Wong Tai Sin" },
          { value: "kwun-tong", label: "Kwun Tong" },
          { value: "tsuen-wan", label: "Tsuen Wan" },
          { value: "tuen-mun", label: "Tuen Mun" },
          { value: "yuen-long", label: "Yuen Long" },
          { value: "north", label: "North" },
          { value: "tai-po", label: "Tai Po" },
          { value: "sha-tin", label: "Sha Tin" },
          { value: "sai-kung", label: "Sai Kung" },
          { value: "islands", label: "Islands" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "economic",
    title: "Economic Status",
    description: "Help us understand your economic situation",
    fields: [
      {
        id: "incomeRange",
        type: "select",
        label: "What is your monthly income range?",
        placeholder: "Select your income range",
        options: [
          { value: "below-10k", label: "Below HK$10,000" },
          { value: "10k-20k", label: "HK$10,000 - HK$20,000" },
          { value: "20k-30k", label: "HK$20,000 - HK$30,000" },
          { value: "30k-50k", label: "HK$30,000 - HK$50,000" },
          { value: "50k-80k", label: "HK$50,000 - HK$80,000" },
          { value: "80k-120k", label: "HK$80,000 - HK$120,000" },
          { value: "above-120k", label: "Above HK$120,000" },
        ],
        required: true,
      },
      {
        id: "employmentStatus",
        type: "radio",
        label: "What is your employment status?",
        options: [
          { value: "employed-full-time", label: "Employed (Full-time)" },
          { value: "employed-part-time", label: "Employed (Part-time)" },
          { value: "self-employed", label: "Self-employed" },
          { value: "unemployed", label: "Unemployed" },
          { value: "student", label: "Student" },
          { value: "retired", label: "Retired" },
        ],
        required: true,
      },
      {
        id: "housingType",
        type: "radio",
        label: "What type of housing do you live in?",
        options: [
          { value: "public-rental", label: "Public Rental Housing" },
          { value: "subsidized-sale", label: "Subsidized Sale Housing" },
          { value: "private-rental", label: "Private Rental" },
          { value: "private-owned", label: "Private Owned" },
          { value: "temporary", label: "Temporary Housing" },
          { value: "other", label: "Other" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "family",
    title: "Family Information",
    description: "Tell us about your family situation",
    fields: [
      {
        id: "hasChildren",
        type: "radio",
        label: "Do you have children?",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        required: true,
      },
      {
        id: "childrenAges",
        type: "text",
        label: "What are the ages of your children? (comma-separated)",
        placeholder: "e.g., 5, 8, 12",
        required: false,
      },
    ],
  },
  {
    id: "education-transport",
    title: "Education & Transport",
    description: "Your education and transportation preferences",
    fields: [
      {
        id: "educationLevel",
        type: "select",
        label: "What is your highest education level?",
        placeholder: "Select your education level",
        options: [
          { value: "primary", label: "Primary Education" },
          { value: "secondary", label: "Secondary Education" },
          { value: "post-secondary", label: "Post-secondary Education" },
          { value: "bachelor", label: "Bachelor's Degree" },
          { value: "master", label: "Master's Degree" },
          { value: "doctorate", label: "Doctorate" },
        ],
        required: true,
      },
      {
        id: "transportationMode",
        type: "checkbox",
        label: "Which transportation modes do you regularly use?",
        options: [
          { value: "mtr", label: "MTR" },
          { value: "bus", label: "Bus" },
          { value: "minibus", label: "Minibus" },
          { value: "taxi", label: "Taxi" },
          { value: "private-car", label: "Private Car" },
          { value: "bicycle", label: "Bicycle" },
          { value: "walking", label: "Walking" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "health",
    title: "Health Information",
    description: "Optional health information for better recommendations",
    fields: [
      {
        id: "healthConditions",
        type: "text",
        label:
          "Do you have any health conditions we should consider? (optional)",
        placeholder: "e.g., diabetes, mobility issues, chronic conditions",
        required: false,
      },
    ],
  },
];

// Form step navigation utilities
export const getStepIndex = (stepId: string): number => {
  return formSteps.findIndex((step) => step.id === stepId);
};

export const getStepById = (
  stepId: string,
): Omit<FormStep, "validation"> | undefined => {
  return formSteps.find((step) => step.id === stepId);
};

export const getNextStepId = (currentStepId: string): string | null => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1 || currentIndex >= formSteps.length - 1) {
    return null;
  }
  return formSteps[currentIndex + 1].id;
};

export const getPreviousStepId = (currentStepId: string): string | null => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return formSteps[currentIndex - 1].id;
};

export const isFirstStep = (stepId: string): boolean => {
  return getStepIndex(stepId) === 0;
};

export const isLastStep = (stepId: string): boolean => {
  return getStepIndex(stepId) === formSteps.length - 1;
};

// Progress calculation functions
export const calculateProgress = (currentStepId: string): number => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1) return 0;
  return Math.round(((currentIndex + 1) / formSteps.length) * 100);
};

export const getTotalSteps = (): number => {
  return formSteps.length;
};

export const getCompletedSteps = (currentStepId: string): number => {
  const currentIndex = getStepIndex(currentStepId);
  return currentIndex === -1 ? 0 : currentIndex + 1;
};

// Form step flow logic
export const getStepRoute = (stepId: string): string => {
  return `/assessment/${stepId}`;
};

export const getNextStepRoute = (currentStepId: string): string | null => {
  const nextStepId = getNextStepId(currentStepId);
  return nextStepId ? getStepRoute(nextStepId) : null;
};

export const getPreviousStepRoute = (currentStepId: string): string | null => {
  const previousStepId = getPreviousStepId(currentStepId);
  return previousStepId ? getStepRoute(previousStepId) : null;
};

// Note: Validation helpers are now in lib/form-validation.ts for client-side use
