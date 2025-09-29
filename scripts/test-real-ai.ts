#!/usr/bin/env tsx

/**
 * Test script for real AI summary generation
 * Usage: npm run test:real-ai
 */

import { generatePersonalizedSummary } from '../lib/ai/summary-wrapper';
import type { UserProfile } from '../types';

async function testRealAI() {
  console.log('🚀 Testing Real AI Summary Generation...\n');

  // Test user profile
  const testUser: UserProfile = {
    age: 28,
    maritalStatus: 'single',
    hasChildren: false,
    district: 'Central and Western',
    housingType: 'private-rental',
    incomeRange: '30k-50k',
    employmentStatus: 'employed-full-time',
    interests: ['housing', 'transportation', 'technology'],
    healthConditions: [],
  };

  console.log('👤 Test User Profile:');
  console.log(JSON.stringify(testUser, null, 2));
  console.log('\n⏳ Generating personalized summary...\n');

  try {
    const startTime = Date.now();
    const summary = await generatePersonalizedSummary(testUser);
    const endTime = Date.now();

    console.log('✅ Summary Generated Successfully!');
    console.log(`⏱️  Processing Time: ${endTime - startTime}ms`);
    console.log(`🤖 AI Provider: ${summary.aiProvider}`);
    console.log(`📊 Overall Score: ${summary.overallScore}%`);
    console.log(`📋 Relevant Areas: ${summary.relevantAreas.length}`);
    console.log(`🏙️  Major Updates: ${summary.majorUpdates.length}`);
    console.log(`💡 Recommendations: ${summary.recommendations.length}`);

    console.log('\n📝 Sample Relevant Area:');
    if (summary.relevantAreas.length > 0) {
      const area = summary.relevantAreas[0];
      console.log(`Title: ${area.title}`);
      console.log(`Category: ${area.category}`);
      console.log(`Relevance: ${area.relevanceScore}%`);
      console.log(`Summary: ${area.summary}`);
    }

    console.log('\n💡 Sample Recommendation:');
    if (summary.recommendations.length > 0) {
      const rec = summary.recommendations[0];
      console.log(`Title: ${rec.title}`);
      console.log(`Priority: ${rec.priority}`);
      console.log(`Description: ${rec.description}`);
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Error generating summary:');
    console.error(error);
    process.exit(1);
  }
}

// Check for API key
if (!process.env.BEDROCK_API_KEY) {
  console.error('❌ BEDROCK_API_KEY environment variable is required');
  console.log('💡 Please set your AWS Bedrock API key in the .env file');
  process.exit(1);
}

testRealAI().catch(console.error);