import { z } from "zod";
import type {
  EmploymentStatus,
  HongKongDistrict,
  HousingType,
  IncomeRange,
  PolicyCategory,
  ProcessedProfile,
  UserProfile,
} from "@/types";
import { userProfileSchema } from "./validation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Pure utility functions for data processing and validation
 */

// Profile processing utilities
export const processUserProfile = (profile: UserProfile): ProcessedProfile => {
  const profileHash = generateProfileHash(profile);
  const riskFactors = identifyRiskFactors(profile);
  const eligibilityFlags = calculateEligibilityFlags(profile);

  return {
    ...profile,
    profileHash,
    riskFactors,
    eligibilityFlags,
  };
};

// Generate a hash for the user profile for caching/comparison purposes
export const generateProfileHash = (profile: UserProfile): string => {
  const profileString = JSON.stringify(profile, Object.keys(profile).sort());
  return btoa(profileString).slice(0, 16);
};

// Identify risk factors based on user profile
export const identifyRiskFactors = (profile: UserProfile): string[] => {
  const riskFactors: string[] = [];

  // Age-based risk factors
  if (profile.age >= 65) {
    riskFactors.push("elderly");
  }
  if (profile.age <= 25) {
    riskFactors.push("young-adult");
  }

  // Employment-based risk factors
  if (profile.employmentStatus === "unemployed") {
    riskFactors.push("unemployment");
  }
  if (profile.employmentStatus === "student") {
    riskFactors.push("student-status");
  }

  // Income-based risk factors
  if (["below-10k", "10k-20k"].includes(profile.incomeRange)) {
    riskFactors.push("low-income");
  }

  // Housing-based risk factors
  if (["public-rental", "temporary"].includes(profile.housingType)) {
    riskFactors.push("housing-insecurity");
  }

  // Family-based risk factors
  if (profile.hasChildren && profile.childrenAges) {
    const hasYoungChildren = profile.childrenAges.some((age) => age < 6);
    if (hasYoungChildren) {
      riskFactors.push("young-children");
    }
  }

  // Health-based risk factors
  if (profile.healthConditions && profile.healthConditions.length > 0) {
    riskFactors.push("health-conditions");
  }

  return riskFactors;
};

// Calculate eligibility flags for various programs/policies
export const calculateEligibilityFlags = (
  profile: UserProfile,
): Record<string, boolean> => {
  return {
    // Housing eligibility
    publicHousingEligible: isPublicHousingEligible(profile),
    homeOwnershipSchemeEligible: isHomeOwnershipSchemeEligible(profile),

    // Social welfare eligibility
    comprehensiveSocialSecurityEligible:
      isComprehensiveSocialSecurityEligible(profile),
    elderlyAllowanceEligible: isElderlyAllowanceEligible(profile),

    // Education eligibility
    continuingEducationFundEligible: isContinuingEducationFundEligible(profile),

    // Employment eligibility
    retrainingProgrammeEligible: isRetrainingProgrammeEligible(profile),

    // Healthcare eligibility
    healthcareVoucherEligible: isHealthcareVoucherEligible(profile),

    // Transportation eligibility
    publicTransportFareConcessionsEligible:
      isPublicTransportFareConcessionsEligible(profile),
  };
};

// Specific eligibility check functions
export const isPublicHousingEligible = (profile: UserProfile): boolean => {
  const lowIncomeRanges: IncomeRange[] = ["below-10k", "10k-20k", "20k-30k"];
  return (
    lowIncomeRanges.includes(profile.incomeRange) &&
    !["private-owned"].includes(profile.housingType)
  );
};

export const isHomeOwnershipSchemeEligible = (
  profile: UserProfile,
): boolean => {
  const eligibleIncomeRanges: IncomeRange[] = ["20k-30k", "30k-50k", "50k-80k"];
  return (
    eligibleIncomeRanges.includes(profile.incomeRange) &&
    !["private-owned", "subsidized-sale"].includes(profile.housingType) &&
    ["employed-full-time", "employed-part-time", "self-employed"].includes(
      profile.employmentStatus,
    )
  );
};

export const isComprehensiveSocialSecurityEligible = (
  profile: UserProfile,
): boolean => {
  return (
    profile.incomeRange === "below-10k" ||
    profile.employmentStatus === "unemployed" ||
    (profile.age >= 60 &&
      ["below-10k", "10k-20k"].includes(profile.incomeRange))
  );
};

export const isElderlyAllowanceEligible = (profile: UserProfile): boolean => {
  return profile.age >= 65;
};

export const isContinuingEducationFundEligible = (
  profile: UserProfile,
): boolean => {
  return (
    profile.age >= 18 &&
    profile.age <= 70 &&
    [
      "employed-full-time",
      "employed-part-time",
      "self-employed",
      "unemployed",
    ].includes(profile.employmentStatus)
  );
};

export const isRetrainingProgrammeEligible = (
  profile: UserProfile,
): boolean => {
  return (
    profile.age >= 15 &&
    ["unemployed", "employed-part-time"].includes(profile.employmentStatus) &&
    !["bachelor", "master", "doctorate"].includes(profile.educationLevel)
  );
};

export const isHealthcareVoucherEligible = (profile: UserProfile): boolean => {
  return profile.age >= 65;
};

export const isPublicTransportFareConcessionsEligible = (
  profile: UserProfile,
): boolean => {
  return (
    profile.age >= 65 ||
    profile.employmentStatus === "student" ||
    (profile.hasChildren &&
      profile.childrenAges?.some((age) => age < 12) === true)
  );
};

// Data validation utilities
export const validateUserProfile = (
  data: unknown,
): {
  success: boolean;
  data?: UserProfile;
  errors?: string[];
} => {
  try {
    const validatedData = userProfileSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );
      return { success: false, errors };
    }
    return { success: false, errors: ["Unknown validation error"] };
  }
};

// Form step utilities
export const calculateFormProgress = (
  currentStep: number,
  totalSteps: number,
): number => {
  return Math.round((currentStep / totalSteps) * 100);
};

export const getNextStepId = (
  currentStepId: string,
  stepIds: string[],
): string | null => {
  const currentIndex = stepIds.indexOf(currentStepId);
  if (currentIndex === -1 || currentIndex === stepIds.length - 1) {
    return null;
  }
  return stepIds[currentIndex + 1];
};

export const getPreviousStepId = (
  currentStepId: string,
  stepIds: string[],
): string | null => {
  const currentIndex = stepIds.indexOf(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return stepIds[currentIndex - 1];
};

// Policy relevance utilities
export const calculatePolicyRelevance = (
  profile: UserProfile,
  policyCategory: PolicyCategory,
): number => {
  const processedProfile = processUserProfile(profile);
  let relevanceScore = 50; // Base score

  switch (policyCategory) {
    case "housing":
      if (processedProfile.eligibilityFlags.publicHousingEligible)
        relevanceScore += 30;
      if (processedProfile.eligibilityFlags.homeOwnershipSchemeEligible)
        relevanceScore += 25;
      if (processedProfile.riskFactors.includes("housing-insecurity"))
        relevanceScore += 20;
      break;

    case "healthcare":
      if (processedProfile.eligibilityFlags.healthcareVoucherEligible)
        relevanceScore += 25;
      if (processedProfile.riskFactors.includes("elderly"))
        relevanceScore += 20;
      if (processedProfile.riskFactors.includes("health-conditions"))
        relevanceScore += 30;
      break;

    case "education":
      if (processedProfile.eligibilityFlags.continuingEducationFundEligible)
        relevanceScore += 25;
      if (profile.employmentStatus === "student") relevanceScore += 30;
      if (processedProfile.riskFactors.includes("young-adult"))
        relevanceScore += 15;
      break;

    case "employment":
      if (processedProfile.eligibilityFlags.retrainingProgrammeEligible)
        relevanceScore += 30;
      if (processedProfile.riskFactors.includes("unemployment"))
        relevanceScore += 35;
      if (profile.employmentStatus === "employed-part-time")
        relevanceScore += 20;
      break;

    case "social-welfare":
      if (processedProfile.eligibilityFlags.comprehensiveSocialSecurityEligible)
        relevanceScore += 35;
      if (processedProfile.eligibilityFlags.elderlyAllowanceEligible)
        relevanceScore += 25;
      if (processedProfile.riskFactors.includes("low-income"))
        relevanceScore += 20;
      break;

    case "transportation":
      if (
        processedProfile.eligibilityFlags.publicTransportFareConcessionsEligible
      )
        relevanceScore += 25;
      if (profile.transportationMode.includes("mtr")) relevanceScore += 15;
      if (profile.transportationMode.includes("bus")) relevanceScore += 10;
      break;

    default:
      break;
  }

  // Ensure score is within valid range
  return Math.min(Math.max(relevanceScore, 0), 100);
};

// String formatting utilities
export const formatIncomeRange = (incomeRange: IncomeRange): string => {
  const formatMap: Record<IncomeRange, string> = {
    "below-10k": "Below HK$10,000",
    "10k-20k": "HK$10,000 - HK$20,000",
    "20k-30k": "HK$20,000 - HK$30,000",
    "30k-50k": "HK$30,000 - HK$50,000",
    "50k-80k": "HK$50,000 - HK$80,000",
    "80k-120k": "HK$80,000 - HK$120,000",
    "above-120k": "Above HK$120,000",
  };
  return formatMap[incomeRange];
};

export const formatDistrict = (district: HongKongDistrict): string => {
  const formatMap: Record<HongKongDistrict, string> = {
    "central-western": "Central and Western",
    "wan-chai": "Wan Chai",
    eastern: "Eastern",
    southern: "Southern",
    "yau-tsim-mong": "Yau Tsim Mong",
    "sham-shui-po": "Sham Shui Po",
    "kowloon-city": "Kowloon City",
    "wong-tai-sin": "Wong Tai Sin",
    "kwun-tong": "Kwun Tong",
    "tsuen-wan": "Tsuen Wan",
    "tuen-mun": "Tuen Mun",
    "yuen-long": "Yuen Long",
    north: "North",
    "tai-po": "Tai Po",
    "sha-tin": "Sha Tin",
    "sai-kung": "Sai Kung",
    islands: "Islands",
  };
  return formatMap[district];
};

export const formatEmploymentStatus = (status: EmploymentStatus): string => {
  const formatMap: Record<EmploymentStatus, string> = {
    "employed-full-time": "Employed (Full-time)",
    "employed-part-time": "Employed (Part-time)",
    "self-employed": "Self-employed",
    unemployed: "Unemployed",
    student: "Student",
    retired: "Retired",
  };
  return formatMap[status];
};

export const formatHousingType = (housingType: HousingType): string => {
  const formatMap: Record<HousingType, string> = {
    "public-rental": "Public Rental Housing",
    "subsidized-sale": "Subsidized Sale Housing",
    "private-rental": "Private Rental",
    "private-owned": "Private Owned",
    temporary: "Temporary Housing",
    other: "Other",
  };
  return formatMap[housingType];
};
