'use server';

import { createDefaultAIService } from "./service";
import { mockPolicyContent } from "@/lib/policy/mock-data";
import type { UserProfile, PersonalizedSummary } from "@/types";

/**
 * Generate personalized summary for a user profile using AI
 */
export async function generatePersonalizedSummary(
  userProfile: UserProfile,
  options?: { retry?: boolean }
): Promise<PersonalizedSummary> {
  const aiService = createDefaultAIService();
  
  // Create a comprehensive prompt with user profile and policy data
  const systemPrompt = `You are an AI assistant specialized in analyzing Hong Kong's Policy Address and creating personalized summaries for residents. 

Your task is to analyze the user's profile and match it with relevant policy initiatives to create a comprehensive, actionable report.

IMPORTANT GUIDELINES:
1. Generate an overall relevance score between 70-100 (minimum 70%)
2. Focus on policies that directly impact the user's situation
3. Provide specific, actionable recommendations
4. Use clear, accessible language
5. Prioritize high-impact policies for the user's demographic
6. Include realistic timelines and next steps

RESPONSE FORMAT: Return a valid JSON object with the following structure:
{
  "overallScore": number (70-100),
  "relevantAreas": [
    {
      "category": string (housing|transportation|healthcare|education|employment|social-welfare),
      "title": string,
      "relevanceScore": number (0-100),
      "summary": string,
      "details": string,
      "actionItems": string[],
      "impact": "high"|"medium"|"low"
    }
  ],
  "majorUpdates": [
    {
      "id": string,
      "title": string,
      "description": string,
      "relevanceToUser": string,
      "timeline": string,
      "impact": "high"|"medium"|"low"
    }
  ],
  "recommendations": [
    {
      "id": string,
      "title": string,
      "description": string,
      "actionSteps": string[],
      "priority": "high"|"medium"|"low",
      "category": string
    }
  ]
}`;

  const userPrompt = `Please analyze the following user profile and create a personalized Policy Address summary:

USER PROFILE:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Marital Status: ${userProfile.maritalStatus}
- District: ${userProfile.district}
- Income Range: ${userProfile.incomeRange}
- Employment Status: ${userProfile.employmentStatus}
- Housing Type: ${userProfile.housingType}
- Has Children: ${userProfile.hasChildren}
- Children Ages: ${userProfile.childrenAges?.join(', ') || 'N/A'}
- Education Level: ${userProfile.educationLevel}
- Transportation Modes: ${userProfile.transportationMode?.join(', ') || 'N/A'}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'None specified'}

AVAILABLE POLICY INITIATIVES:
${mockPolicyContent.sections.map(section => `
${section.category.toUpperCase()}: ${section.title}
- Summary: ${section.summary}
- Target Demographics: ${section.targetDemographics?.join(', ') || 'General'}
- Impact Level: ${section.impactLevel}
- Timeline: ${section.implementationTimeline}
- Key Benefits: ${section.keyBenefits?.join('; ') || 'Not specified'}
- Eligibility: ${section.eligibilityCriteria?.join('; ') || 'General eligibility'}
`).join('\n')}

Based on this information, create a personalized summary that:
1. Identifies the most relevant policy areas for this user
2. Explains how each policy specifically benefits their situation
3. Provides concrete action steps they can take
4. Prioritizes recommendations based on their profile
5. Includes realistic timelines and expectations

Focus especially on policies that match their:
- Housing situation (${userProfile.housingType})
- Income level (${userProfile.incomeRange})
- Family status (${userProfile.hasChildren ? 'has children' : 'no children'})
- Location (${userProfile.district})
- Age group (${userProfile.age} years old)`;

  try {
    const response = await aiService.generateCompletion(userPrompt, systemPrompt);
    // console.log('!!!!!!');
    // console.log(response);
    
    // Parse the AI response as JSON, handling reasoning blocks and markdown-wrapped JSON
    let cleanedResponse = response;
    
    // Remove reasoning blocks if present
    if (response.includes('<reasoning>')) {
      cleanedResponse = response.replace(/<reasoning>[\s\S]*?<\/reasoning>\s*/g, '');
      console.log('Removed reasoning block, cleaned response preview:', cleanedResponse.substring(0, 200));
    }
    
    let aiSummary;
    try {
      // First try direct JSON parsing on cleaned response
      aiSummary = JSON.parse(cleanedResponse);
    } catch (error) {
      // If that fails, try to extract JSON from markdown code blocks
      console.log('Direct JSON parsing failed, trying markdown extraction...');
      console.log('Response preview:', cleanedResponse.substring(0, 200));
      
      if (cleanedResponse.includes('```json') || cleanedResponse.includes('```')) {
        // Try multiple patterns for markdown extraction
        let jsonMatch = cleanedResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
          // Try without the 'json' specifier
          jsonMatch = cleanedResponse.match(/```\s*([\s\S]*?)\s*```/);
        }
        if (!jsonMatch) {
          // Try finding JSON object directly
          jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        }
        
        if (jsonMatch) {
          try {
            const jsonString = jsonMatch[1] || jsonMatch[0];
            console.log('Extracted JSON string:', jsonString.substring(0, 100));
            aiSummary = JSON.parse(jsonString);
          } catch (parseError) {
            console.error('Failed to parse extracted JSON:', parseError);
            throw new Error(`Failed to parse extracted JSON: ${jsonMatch[1] || jsonMatch[0]}`);
          }
        } else {
          console.error('Could not find JSON in response');
          throw new Error(`Found markdown indicators but could not extract JSON from: ${cleanedResponse.substring(0, 200)}...`);
        }
      } else {
        throw new Error(`Failed to parse AI response as JSON: ${cleanedResponse.substring(0, 100)}...`);
      }
    }
    
    // Validate and structure the response
    const summary: PersonalizedSummary = {
      overallScore: Math.max(70, Math.min(100, aiSummary.overallScore || 75)),
      relevantAreas: (aiSummary.relevantAreas || []).map((area: any) => ({
        category: area.category,
        title: area.title || 'Policy Area',
        relevanceScore: Math.max(0, Math.min(100, area.relevanceScore || 50)),
        summary: area.summary || 'Policy summary not available',
        details: area.details || 'Details not available',
        actionItems: Array.isArray(area.actionItems) ? area.actionItems : [],
        impact: ['high', 'medium', 'low'].includes(area.impact) ? area.impact : 'medium',
      })),
      majorUpdates: (aiSummary.majorUpdates || []).map((update: any, index: number) => ({
        id: update.id || `update-${index}`,
        title: update.title || 'Policy Update',
        description: update.description || 'Update description not available',
        relevanceToUser: update.relevanceToUser || 'May be relevant to your situation',
        timeline: update.timeline || '2025-2026',
        impact: ['high', 'medium', 'low'].includes(update.impact) ? update.impact : 'medium',
      })),
      recommendations: (aiSummary.recommendations || []).map((rec: any, index: number) => ({
        id: rec.id || `rec-${index}`,
        title: rec.title || 'Recommendation',
        description: rec.description || 'Recommendation description not available',
        actionSteps: Array.isArray(rec.actionSteps) ? rec.actionSteps : ['Contact relevant department for more information'],
        priority: ['high', 'medium', 'low'].includes(rec.priority) ? rec.priority : 'medium',
        category: rec.category || 'general',
      })),
      generatedAt: new Date(),
    };
    
    return summary;
    
  } catch (error) {
    console.error('AI summary generation failed:', error);
    
    // Fallback to a basic summary if AI fails
    return createFallbackSummary(userProfile);
  }
}

/**
 * Create a fallback summary when AI generation fails
 */
function createFallbackSummary(userProfile: UserProfile): PersonalizedSummary {
  return {
    overallScore: 75,
    relevantAreas: [
      {
        category: "housing",
        title: "Housing Initiatives",
        relevanceScore: userProfile.housingType === "public-rental" ? 90 : 70,
        summary: "Housing policies relevant to your situation",
        details: `Based on your ${userProfile.housingType} housing in ${userProfile.district}, there are several relevant initiatives.`,
        actionItems: [
          "Check Housing Authority website for updates",
          "Review eligibility for housing schemes",
          "Monitor application deadlines"
        ],
        impact: "high" as const,
      }
    ],
    majorUpdates: [
      {
        id: "housing-update",
        title: "Public Housing Development",
        description: "Accelerated public housing construction program",
        relevanceToUser: "May affect housing availability in your area",
        timeline: "2025-2027",
        impact: "high" as const,
      }
    ],
    recommendations: [
      {
        id: "rec-housing",
        title: "Review Housing Options",
        description: "Stay updated on housing initiatives that may benefit you",
        actionSteps: [
          "Visit Housing Authority website regularly",
          "Check eligibility for new schemes",
          "Consider attending housing information sessions"
        ],
        priority: "high" as const,
        category: "housing",
      }
    ],
    generatedAt: new Date(),
  };
}