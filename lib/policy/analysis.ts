import type { UserProfile } from "@/types";
import type {
  PolicyAnalysis,
  PolicyCategory,
  PolicyContent,
  PolicyRelevanceScore,
  PolicySection,
  TargetDemographic,
} from "./types";

/**
 * Calculate policy relevance score for a user profile against a policy section
 */
export function calculatePolicyRelevance(
  userProfile: UserProfile,
  policySection: PolicySection,
): PolicyRelevanceScore {
  let score = 0;
  const reasons: string[] = [];
  const matchedDemographics: TargetDemographic[] = [];

  // Get user demographics
  const userDemographics = getUserDemographics(userProfile);

  // Calculate demographic matches (40% of score)
  const demographicMatches = policySection.targetDemographics.filter((demo) =>
    userDemographics.includes(demo),
  );

  if (demographicMatches.length > 0) {
    const demographicScore = Math.min(
      40,
      (demographicMatches.length / policySection.targetDemographics.length) *
        40,
    );
    score += demographicScore;
    matchedDemographics.push(...demographicMatches);
    reasons.push(`Matches ${demographicMatches.length} demographic criteria`);
  }

  // Calculate category relevance (30% of score)
  const categoryRelevance = getCategoryRelevanceForUser(
    userProfile,
    policySection.category,
  );
  score += categoryRelevance * 30;
  if (categoryRelevance > 0.5) {
    reasons.push(`High relevance for ${policySection.category} category`);
  }

  // Calculate impact level bonus (20% of score)
  const impactBonus =
    policySection.impactLevel === "high"
      ? 20
      : policySection.impactLevel === "medium"
        ? 12
        : 8;
  score += impactBonus;
  reasons.push(`${policySection.impactLevel} impact level`);

  // Calculate eligibility bonus (10% of score)
  if (policySection.eligibilityCriteria) {
    const eligibilityScore = calculateEligibilityScore(
      userProfile,
      policySection.eligibilityCriteria,
    );
    score += eligibilityScore * 10;
    if (eligibilityScore > 0.7) {
      reasons.push("Meets most eligibility criteria");
    }
  }

  // Generate impact assessment
  const impactAssessment = generateImpactAssessment(
    userProfile,
    policySection,
    score,
  );

  return {
    sectionId: policySection.id,
    score: Math.round(Math.min(100, score)),
    reasons,
    matchedDemographics,
    impactAssessment,
  };
}

/**
 * Analyze policy content for a user profile
 */
export function analyzePolicyForUser(
  userProfile: UserProfile,
  policyContent: PolicyContent,
): PolicyAnalysis {
  // Calculate relevance scores for all sections
  const relevantSections = policyContent.sections
    .map((section) => calculatePolicyRelevance(userProfile, section))
    .filter((score) => score.score >= 30) // Filter out low-relevance sections
    .sort((a, b) => b.score - a.score); // Sort by relevance score

  // Calculate overall score (minimum 70% as per requirements)
  const overallScore = Math.max(70, calculateOverallScore(relevantSections));

  // Identify top categories
  const topCategories = getTopCategories(
    relevantSections,
    policyContent.sections,
  );

  // Generate recommended actions
  const recommendedActions = generateRecommendedActions(
    userProfile,
    relevantSections,
    policyContent.sections,
  );

  return {
    userProfileId: `profile-${Date.now()}`, // In real app, this would be a proper ID
    overallScore,
    relevantSections,
    topCategories,
    recommendedActions,
    analysisDate: new Date(),
  };
}

/**
 * Get user demographics based on profile
 */
function getUserDemographics(userProfile: UserProfile): TargetDemographic[] {
  const demographics: TargetDemographic[] = [];

  // Age-based demographics
  if (userProfile.age >= 18 && userProfile.age <= 35) {
    demographics.push("young-adults");
  }
  if (userProfile.age >= 65) {
    demographics.push("elderly");
  }

  // Family status
  if (userProfile.hasChildren || userProfile.maritalStatus === "married") {
    demographics.push("families");
  }

  // Income-based demographics
  if (
    userProfile.incomeRange === "below-10k" ||
    userProfile.incomeRange === "10k-20k" ||
    userProfile.incomeRange === "20k-30k"
  ) {
    demographics.push("low-income");
  } else if (
    userProfile.incomeRange === "30k-50k" ||
    userProfile.incomeRange === "50k-80k"
  ) {
    demographics.push("middle-income");
  } else if (
    userProfile.incomeRange === "80k-120k" ||
    userProfile.incomeRange === "above-120k"
  ) {
    demographics.push("high-income");
  }

  // Employment status
  if (userProfile.employmentStatus === "unemployed") {
    demographics.push("unemployed");
  } else if (
    userProfile.employmentStatus === "employed-full-time" ||
    userProfile.employmentStatus === "employed-part-time" ||
    userProfile.employmentStatus === "self-employed"
  ) {
    demographics.push("professionals");
  } else if (userProfile.employmentStatus === "student") {
    demographics.push("students");
  }

  // Health conditions
  if (userProfile.healthConditions && userProfile.healthConditions.length > 0) {
    demographics.push("disabled");
  }

  return demographics;
}

/**
 * Calculate category relevance for user
 */
function getCategoryRelevanceForUser(
  userProfile: UserProfile,
  category: PolicyCategory,
): number {
  switch (category) {
    case "housing":
      // High relevance for young adults, families, and those in certain housing types
      if (
        userProfile.age <= 40 ||
        userProfile.hasChildren ||
        userProfile.housingType === "public-rental" ||
        userProfile.housingType === "subsidized-sale"
      ) {
        return 1.0;
      }
      return 0.6;

    case "transportation":
      // High relevance for working professionals and families
      if (
        userProfile.employmentStatus === "employed-full-time" ||
        userProfile.employmentStatus === "employed-part-time" ||
        userProfile.employmentStatus === "self-employed" ||
        userProfile.hasChildren
      ) {
        return 0.9;
      }
      return 0.7;

    case "healthcare":
      // Higher relevance for elderly and families with children
      if (
        userProfile.age >= 50 ||
        userProfile.hasChildren ||
        (userProfile.healthConditions &&
          userProfile.healthConditions.length > 0)
      ) {
        return 1.0;
      }
      return 0.6;

    case "education":
      // High relevance for families with children and students
      if (
        userProfile.hasChildren ||
        userProfile.employmentStatus === "student" ||
        userProfile.age <= 30
      ) {
        return 0.9;
      }
      return 0.4;

    case "employment":
      // High relevance for unemployed and young professionals
      if (
        userProfile.employmentStatus === "unemployed" ||
        (userProfile.age <= 35 && userProfile.employmentStatus !== "retired")
      ) {
        return 1.0;
      }
      return 0.5;

    case "social-welfare":
      // High relevance for elderly, low-income, and families
      if (
        userProfile.age >= 60 ||
        userProfile.incomeRange === "below-10k" ||
        userProfile.incomeRange === "10k-20k" ||
        userProfile.incomeRange === "20k-30k" ||
        userProfile.hasChildren
      ) {
        return 0.9;
      }
      return 0.4;

    default:
      return 0.5;
  }
}

/**
 * Calculate eligibility score based on criteria
 */
function calculateEligibilityScore(
  userProfile: UserProfile,
  criteria: string[],
): number {
  // This is a simplified eligibility check
  // In a real implementation, this would parse and evaluate actual criteria
  let score = 0.8; // Base score assuming most criteria are met

  // Adjust based on common criteria patterns
  if (criteria.some((c) => c.toLowerCase().includes("income"))) {
    // Income-based criteria - assume middle and low income qualify
    if (userProfile.incomeRange !== "above-120k") {
      score += 0.2;
    }
  }

  if (criteria.some((c) => c.toLowerCase().includes("age"))) {
    // Age-based criteria - assume most age ranges qualify
    score += 0.1;
  }

  return Math.min(1.0, score);
}

/**
 * Calculate overall score from relevant sections
 */
function calculateOverallScore(
  relevantSections: PolicyRelevanceScore[],
): number {
  if (relevantSections.length === 0) return 70;

  const weightedSum = relevantSections.reduce((sum, section, index) => {
    // Weight decreases for lower-ranked sections
    const weight = Math.max(0.1, 1 - index * 0.1);
    return sum + section.score * weight;
  }, 0);

  const totalWeight = relevantSections.reduce((sum, _, index) => {
    const weight = Math.max(0.1, 1 - index * 0.1);
    return sum + weight;
  }, 0);

  return Math.round(weightedSum / totalWeight);
}

/**
 * Get top policy categories for user
 */
function getTopCategories(
  relevantSections: PolicyRelevanceScore[],
  allSections: PolicySection[],
): PolicyCategory[] {
  const categoryScores = new Map<PolicyCategory, number>();

  relevantSections.forEach((relevantSection) => {
    const section = allSections.find((s) => s.id === relevantSection.sectionId);
    if (section) {
      const currentScore = categoryScores.get(section.category) || 0;
      categoryScores.set(
        section.category,
        currentScore + relevantSection.score,
      );
    }
  });

  return Array.from(categoryScores.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category]) => category);
}

/**
 * Generate recommended actions for user
 */
function generateRecommendedActions(
  userProfile: UserProfile,
  relevantSections: PolicyRelevanceScore[],
  allSections: PolicySection[],
): string[] {
  const actions: string[] = [];

  // Get top 3 most relevant sections
  const topSections = relevantSections.slice(0, 3);

  topSections.forEach((relevantSection) => {
    const section = allSections.find((s) => s.id === relevantSection.sectionId);
    if (section && section.keyBenefits.length > 0) {
      // Generate action based on the section's key benefits
      const primaryBenefit = section.keyBenefits[0];
      actions.push(
        `Explore ${section.title.toLowerCase()} to access ${primaryBenefit.toLowerCase()}`,
      );
    }
  });

  // Add general recommendations based on user profile
  if (userProfile.age <= 35 && userProfile.housingType !== "private-owned") {
    actions.push(
      "Consider applying for first-time home buyer assistance programs",
    );
  }

  if (userProfile.hasChildren) {
    actions.push("Review education enhancement programs for your children");
  }

  if (userProfile.age >= 60) {
    actions.push("Explore enhanced elderly care services in your district");
  }

  return actions.slice(0, 5); // Limit to 5 actions
}

/**
 * Generate impact assessment for a policy section
 */
function generateImpactAssessment(
  _userProfile: UserProfile,
  policySection: PolicySection,
  score: number,
): string {
  if (score >= 80) {
    return `This policy will have a significant positive impact on your situation, particularly in ${policySection.category}.`;
  } else if (score >= 60) {
    return `This policy offers moderate benefits that align with your profile and circumstances.`;
  } else if (score >= 40) {
    return `This policy may provide some indirect benefits relevant to your situation.`;
  } else {
    return `This policy has limited direct relevance to your current circumstances.`;
  }
}
