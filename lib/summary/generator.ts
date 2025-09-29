import type { AIService } from "@/lib/ai/service";
import { analyzePolicyForUser } from "@/lib/policy/analysis";
import { getPolicyData } from "@/lib/policy/loader";
import type { PolicyAnalysis } from "@/lib/policy/types";
import type { UserProfile } from "@/types";
import type {
  CityPlan,
  PersonalizedSummary,
  PolicyArea,
  Recommendation,
  SummaryGenerationOptions,
  SummaryGenerationResult,
} from "./types";

/**
 * Main summary generation service
 */
export class SummaryGenerator {
  constructor(private aiService: AIService) {}

  /**
   * Generate personalized summary for a user
   */
  async generateSummary(
    userProfile: UserProfile,
    options: Partial<SummaryGenerationOptions> = {}
  ): Promise<SummaryGenerationResult> {
    const startTime = Date.now();
    const processingSteps: string[] = [];

    try {
      // Set default options
      const fullOptions: SummaryGenerationOptions = {
        includeDetailedAnalysis: true,
        maxRecommendations: 5,
        language: "en",
        ...options,
      };

      processingSteps.push("Loading real policy data");

      // Step 1: Load real policy data
      const policyContent = await getPolicyData();
      processingSteps.push(
        `Loaded ${policyContent.sections.length} policy sections from real data`
      );

      // Step 2: Analyze policy relevance
      const policyAnalysis = analyzePolicyForUser(userProfile, policyContent);
      processingSteps.push(
        `Analyzed ${policyContent.sections.length} policy sections`
      );

      // Step 2: Generate AI-enhanced content
      processingSteps.push("Generating AI-enhanced summaries");
      const relevantAreas = await this.generatePolicyAreas(
        userProfile,
        policyAnalysis,
        fullOptions
      );

      // Step 3: Generate major city updates
      processingSteps.push("Identifying major city updates");
      const majorUpdates = await this.generateCityPlans(
        userProfile,
        policyAnalysis,
        fullOptions
      );

      // Step 4: Generate personalized recommendations
      processingSteps.push("Creating personalized recommendations");
      const recommendations = await this.generateRecommendations(
        userProfile,
        policyAnalysis,
        fullOptions
      );

      const processingTimeMs = Date.now() - startTime;

      const summary: PersonalizedSummary = {
        id: `summary-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 11)}`,
        userProfileId: `profile-${Date.now()}`,
        overallScore: policyAnalysis.overallScore,
        relevantAreas,
        majorUpdates,
        recommendations,
        generatedAt: new Date(),
        aiProvider: this.aiService.getCurrentProvider().name,
        processingTimeMs,
      };

      return {
        summary,
        metadata: {
          sectionsAnalyzed: policyContent.sections.length,
          relevantSectionsFound: policyAnalysis.relevantSections.length,
          processingSteps,
        },
      };
    } catch (error) {
      processingSteps.push(
        `Error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new SummaryGenerationError(
        "Failed to generate personalized summary",
        error instanceof Error ? error : new Error("Unknown error"),
        processingSteps
      );
    }
  }

  /**
   * Generate policy areas with AI enhancement
   */
  private async generatePolicyAreas(
    userProfile: UserProfile,
    policyAnalysis: PolicyAnalysis,
    options: SummaryGenerationOptions
  ): Promise<PolicyArea[]> {
    const areas: PolicyArea[] = [];
    const policyContent = await getPolicyData();

    // Take top relevant sections (limit to 6 for better UX)
    const topSections = policyAnalysis.relevantSections.slice(0, 6);

    for (const relevantSection of topSections) {
      const policySection = policyContent.sections.find(
        (s) => s.id === relevantSection.sectionId
      );

      if (!policySection) continue;

      try {
        // Generate AI-enhanced summary if detailed analysis is requested
        let enhancedSummary = policySection.summary;
        const enhancedDetails = policySection.content;

        if (options.includeDetailedAnalysis) {
          const aiPrompt = this.createPolicyAreaPrompt(
            userProfile,
            policySection,
            relevantSection
          );

          const systemPrompt = `You are an expert policy analyst specializing in Hong Kong government policies. 
Your task is to create personalized, actionable summaries that help residents understand how policies affect them personally.
Keep responses concise (2-3 sentences), practical, and focused on direct benefits.`;

          enhancedSummary = await this.aiService.generateCompletion(
            aiPrompt,
            systemPrompt
          );

          // Fallback to original summary if AI fails or response is too short
          if (!enhancedSummary || enhancedSummary.length < 50) {
            enhancedSummary = policySection.summary;
          }
        }

        const policyArea: PolicyArea = {
          category: policySection.category,
          title: policySection.title,
          relevanceScore: relevantSection.score,
          summary: enhancedSummary,
          details: enhancedDetails,
          actionItems: this.generateActionItems(policySection, userProfile),
          impact: this.determineImpactLevel(relevantSection.score),
          keyBenefits: policySection.keyBenefits,
          eligibilityInfo: policySection.eligibilityCriteria?.join("; "),
        };

        areas.push(policyArea);
      } catch (error) {
        console.warn(
          `AI enhancement failed for section ${policySection.id}:`,
          error
        );

        // Fallback to basic policy area if AI enhancement fails
        const basicArea: PolicyArea = {
          category: policySection.category,
          title: policySection.title,
          relevanceScore: relevantSection.score,
          summary: policySection.summary,
          details: policySection.content,
          actionItems: this.generateActionItems(policySection, userProfile),
          impact: this.determineImpactLevel(relevantSection.score),
          keyBenefits: policySection.keyBenefits,
          eligibilityInfo: policySection.eligibilityCriteria?.join("; "),
        };

        areas.push(basicArea);
      }
    }

    return areas;
  }

  /**
   * Generate major city plans/updates
   */
  private async generateCityPlans(
    userProfile: UserProfile,
    policyAnalysis: PolicyAnalysis,
    _options: SummaryGenerationOptions
  ): Promise<CityPlan[]> {
    const plans: CityPlan[] = [];
    const policyContent = await getPolicyData();

    // Identify high-impact, large-scale initiatives
    const majorInitiatives = policyAnalysis.relevantSections
      .filter((section) => section.score >= 70)
      .slice(0, 3); // Top 3 major updates

    for (const initiative of majorInitiatives) {
      const policySection = policyContent.sections.find(
        (s) => s.id === initiative.sectionId
      );

      if (!policySection) continue;

      const plan: CityPlan = {
        id: `plan-${policySection.id}`,
        title: policySection.title,
        category: policySection.category,
        description: policySection.content,
        timeline: policySection.implementationTimeline,
        impact: this.generateImpactDescription(policySection, userProfile),
        relevanceToUser: initiative.impactAssessment,
      };

      plans.push(plan);
    }

    return plans;
  }

  /**
   * Generate personalized recommendations
   */
  private async generateRecommendations(
    userProfile: UserProfile,
    policyAnalysis: PolicyAnalysis,
    options: SummaryGenerationOptions
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const policyContent = await getPolicyData();

    // Use the recommended actions from policy analysis as base
    const baseActions = policyAnalysis.recommendedActions.slice(
      0,
      options.maxRecommendations
    );

    for (let i = 0; i < baseActions.length; i++) {
      const action = baseActions[i];
      const relevantSection = policyAnalysis.relevantSections[i];
      const policySection = policyContent.sections.find(
        (s) => s.id === relevantSection?.sectionId
      );

      // Use AI to enhance recommendation if available
      let enhancedDescription = action;
      try {
        if (policySection) {
          const aiPrompt = `Based on this Hong Kong policy: "${
            policySection.title
          }"
          
User profile: ${userProfile.age} years old, ${userProfile.maritalStatus}, ${
            userProfile.hasChildren ? "has children" : "no children"
          }, lives in ${userProfile.district}, income ${
            userProfile.incomeRange
          }, ${userProfile.employmentStatus}.

Create a specific, actionable recommendation (1-2 sentences) for this user. Focus on concrete next steps they can take.`;

          const systemPrompt =
            "You are a helpful policy advisor. Provide specific, actionable recommendations that residents can immediately act upon.";

          enhancedDescription = await this.aiService.generateCompletion(
            aiPrompt,
            systemPrompt
          );

          // Fallback if AI response is too short or fails
          if (!enhancedDescription || enhancedDescription.length < 30) {
            enhancedDescription = action;
          }
        }
      } catch (error) {
        console.warn(
          `AI enhancement failed for recommendation ${i + 1}:`,
          error
        );
        enhancedDescription = action;
      }

      const recommendation: Recommendation = {
        id: `rec-${i + 1}`,
        title: this.generateRecommendationTitle(action),
        description: enhancedDescription,
        priority: i < 2 ? "high" : i < 4 ? "medium" : "low",
        category: policySection?.category || "housing",
        actionSteps: this.generateActionSteps(action, policySection),
        expectedBenefit: this.generateExpectedBenefit(action, policySection),
        timeframe: policySection?.implementationTimeline || "2025-2026",
      };

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Create AI prompt for policy area enhancement
   */
  private createPolicyAreaPrompt(
    userProfile: UserProfile,
    policySection: any,
    relevantSection: any
  ): string {
    return `Policy: "${policySection.title}"
Summary: ${policySection.summary}

User Profile:
- Age: ${userProfile.age}
- Status: ${userProfile.maritalStatus}${
      userProfile.hasChildren ? ", has children" : ""
    }
- Location: ${userProfile.district}
- Income: ${userProfile.incomeRange}
- Employment: ${userProfile.employmentStatus}
- Housing: ${userProfile.housingType}

Relevance Score: ${relevantSection.score}/100

Task: Write a personalized 2-3 sentence summary explaining how this policy specifically benefits this user. Focus on practical, direct impacts and actionable benefits they can expect.`;
  }

  /**
   * Generate action items for a policy section
   */
  private generateActionItems(
    policySection: any,
    userProfile: UserProfile
  ): string[] {
    const items: string[] = [];

    // Generate action items based on policy benefits and user profile
    if (policySection.eligibilityCriteria) {
      items.push(
        "Check eligibility requirements and gather necessary documents"
      );
    }

    if (policySection.keyBenefits.length > 0) {
      items.push(`Learn about ${policySection.keyBenefits[0].toLowerCase()}`);
    }

    items.push(
      `Monitor implementation progress starting ${policySection.implementationTimeline}`
    );

    if (policySection.category === "housing" && userProfile.age <= 40) {
      items.push("Consider applying during the initial application period");
    }

    return items.slice(0, 3); // Limit to 3 action items
  }

  /**
   * Determine impact level based on relevance score
   */
  private determineImpactLevel(score: number): "high" | "medium" | "low" {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  }

  /**
   * Generate impact description for city plans
   */
  private generateImpactDescription(
    policySection: any,
    userProfile: UserProfile
  ): string {
    const budget = policySection.budgetAllocation;
    const budgetText = budget
      ? ` with ${(budget / 1000000000).toFixed(1)}B HKD investment`
      : "";

    return `Major ${policySection.category} initiative${budgetText} affecting ${userProfile.district} district and surrounding areas.`;
  }

  /**
   * Generate recommendation title from action
   */
  private generateRecommendationTitle(action: string): string {
    // Extract key words and create a title
    const words = action.split(" ");
    const keyWords = words.slice(0, 4).join(" ");
    return keyWords.charAt(0).toUpperCase() + keyWords.slice(1);
  }

  /**
   * Generate action steps for recommendations
   */
  private generateActionSteps(action: string, _policySection: any): string[] {
    const steps: string[] = [];

    if (action.toLowerCase().includes("apply")) {
      steps.push("Visit the official government website");
      steps.push("Prepare required documents");
      steps.push("Submit application during open period");
    } else if (action.toLowerCase().includes("explore")) {
      steps.push("Research program details and requirements");
      steps.push("Attend information sessions if available");
      steps.push("Consult with relevant government departments");
    } else {
      steps.push("Stay informed about program updates");
      steps.push("Contact relevant authorities for more information");
      steps.push("Monitor implementation timeline");
    }

    return steps;
  }

  /**
   * Generate expected benefit description
   */
  private generateExpectedBenefit(action: string, policySection: any): string {
    if (policySection?.keyBenefits && policySection.keyBenefits.length > 0) {
      return policySection.keyBenefits[0];
    }

    if (action.toLowerCase().includes("housing")) {
      return "Improved housing affordability and accessibility";
    } else if (action.toLowerCase().includes("transport")) {
      return "Better connectivity and reduced commute times";
    } else if (action.toLowerCase().includes("health")) {
      return "Enhanced healthcare access and services";
    }

    return "Direct benefits aligned with your personal circumstances";
  }
}

/**
 * Custom error class for summary generation
 */
export class SummaryGenerationError extends Error {
  constructor(
    message: string,
    public originalError: Error,
    public processingSteps: string[]
  ) {
    super(message);
    this.name = "SummaryGenerationError";
  }
}

/**
 * Create a default summary generator
 */
export function createSummaryGenerator(aiService: AIService): SummaryGenerator {
  return new SummaryGenerator(aiService);
}
