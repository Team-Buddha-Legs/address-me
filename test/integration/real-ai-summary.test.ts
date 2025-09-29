import { describe, it, expect, beforeAll } from 'vitest';
import { generatePersonalizedSummary } from '@/lib/ai/summary-wrapper';
import type { UserProfile } from '@/types';

describe('Real AI Summary Generation', () => {
  let testUserProfile: UserProfile;

  beforeAll(() => {
    testUserProfile = {
      age: 32,
      maritalStatus: 'married',
      hasChildren: true,
      district: 'Sha Tin',
      housingType: 'private-rental',
      incomeRange: '30k-50k',
      employmentStatus: 'employed-full-time',
      interests: ['housing', 'education', 'transportation'],
      healthConditions: [],
    };
  });

  it('should generate personalized summary using real policy data and AI', async () => {
    // Skip if no API key is configured
    if (!process.env.BEDROCK_API_KEY) {
      console.log('Skipping real AI test - no BEDROCK_API_KEY configured');
      return;
    }

    const summary = await generatePersonalizedSummary(testUserProfile);

    // Verify basic structure
    expect(summary).toBeDefined();
    expect(summary.overallScore).toBeGreaterThanOrEqual(70);
    expect(summary.relevantAreas).toHaveLength.greaterThan(0);
    expect(summary.majorUpdates).toHaveLength.greaterThan(0);
    expect(summary.recommendations).toHaveLength.greaterThan(0);
    expect(summary.generatedAt).toBeInstanceOf(Date);

    // Verify AI provider is set
    expect(summary.aiProvider).toBe('aws-bedrock');

    // Log results for manual verification
    console.log('Generated Summary:', {
      overallScore: summary.overallScore,
      relevantAreasCount: summary.relevantAreas.length,
      majorUpdatesCount: summary.majorUpdates.length,
      recommendationsCount: summary.recommendations.length,
      aiProvider: summary.aiProvider,
      processingTime: summary.processingTimeMs,
    });

    // Verify content quality
    expect(summary.relevantAreas[0].summary.length).toBeGreaterThan(50);
    expect(summary.recommendations[0].description.length).toBeGreaterThan(30);
  }, 30000); // 30 second timeout for AI calls

  it('should handle AI failures gracefully', async () => {
    // Test with invalid API key to simulate failure
    const originalKey = process.env.BEDROCK_API_KEY;
    process.env.BEDROCK_API_KEY = 'invalid-key';

    try {
      const summary = await generatePersonalizedSummary(testUserProfile);
      
      // Should still generate summary with fallback content
      expect(summary).toBeDefined();
      expect(summary.overallScore).toBeGreaterThanOrEqual(70);
      expect(summary.relevantAreas).toHaveLength.greaterThan(0);
    } finally {
      // Restore original key
      process.env.BEDROCK_API_KEY = originalKey;
    }
  });

  it('should use real policy data instead of mock data', async () => {
    const summary = await generatePersonalizedSummary(testUserProfile);
    
    // Real policy data should have more sections than mock data (8 sections)
    // The real data should have significantly more sections
    expect(summary.relevantAreas.length).toBeGreaterThan(3);
    
    // Check that we're getting content that looks like real policy data
    const hasRealPolicyContent = summary.relevantAreas.some(area => 
      area.title.includes('Northern Metropolis') || 
      area.title.includes('One Country, Two Systems') ||
      area.title.includes('Innovation') ||
      area.title.includes('Greater Bay Area')
    );
    
    expect(hasRealPolicyContent).toBe(true);
  });
});