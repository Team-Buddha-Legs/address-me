# Real AI Implementation Guide

This document explains the updated implementation that uses real AWS Bedrock AI and actual Hong Kong Policy Address data instead of mock data.

## Overview

The system has been updated to:
1. **Use Real Policy Data**: Parse the actual Hong Kong Policy Address 2025 markdown file
2. **Use Real AI**: Integrate with AWS Bedrock Claude models for personalized summaries
3. **Maintain Fallbacks**: Gracefully handle failures with fallback to basic summaries

## Key Components

### 1. Policy Data Parser (`lib/policy/parser.ts`)
- Parses the raw markdown policy document into structured data
- Categorizes sections automatically based on content analysis
- Extracts key information like budgets, timelines, and target demographics

### 2. Policy Data Loader (`lib/policy/loader.ts`)
- Loads and caches the real policy data
- Falls back to mock data if real data fails to load
- Provides caching to avoid re-parsing on every request

### 3. AWS Bedrock Provider (`lib/ai/providers/aws-bedrock.ts`)
- Real implementation using AWS Bedrock API
- Supports Claude models for high-quality text generation
- Handles authentication and error management

### 4. Enhanced Summary Generator (`lib/summary/generator.ts`)
- Uses real policy data instead of mock data
- Leverages AI for personalized summaries and recommendations
- Maintains fallbacks for when AI calls fail

## Configuration

### Environment Variables
```bash
# Required for AWS Bedrock
BEDROCK_API_KEY=your_aws_access_key_here
```

### AWS Bedrock Setup
1. Ensure you have AWS Bedrock access in your region (us-west-2)
2. Enable Claude models in your AWS Bedrock console
3. Set up appropriate IAM permissions for Bedrock access
4. Configure your API key in the environment

## Usage

### Basic Usage
```typescript
import { generatePersonalizedSummary } from '@/lib/ai/summary-wrapper';

const userProfile = {
  age: 30,
  maritalStatus: 'married',
  hasChildren: true,
  district: 'Sha Tin',
  // ... other profile fields
};

const summary = await generatePersonalizedSummary(userProfile);
```

### Testing
```bash
# Test with real AI (requires BEDROCK_API_KEY)
npm run test:real-ai

# Run integration tests
npm test test/integration/real-ai-summary.test.ts
```

## Data Flow

1. **Policy Loading**: Real markdown data is loaded and parsed into structured format
2. **User Analysis**: User profile is analyzed against policy sections for relevance
3. **AI Enhancement**: Top relevant sections are enhanced with personalized AI summaries
4. **Recommendation Generation**: AI generates specific, actionable recommendations
5. **Fallback Handling**: If AI fails, system falls back to rule-based summaries

## Key Features

### Real Policy Data
- Parses 200+ sections from the actual Hong Kong Policy Address 2025
- Automatically categorizes content (housing, transportation, healthcare, etc.)
- Extracts budgets, timelines, and eligibility criteria

### AI-Powered Personalization
- Uses Claude models for high-quality, contextual summaries
- Generates personalized recommendations based on user profile
- Maintains consistent tone and actionable advice

### Robust Error Handling
- Graceful fallbacks when AI services are unavailable
- Caching to improve performance and reduce API calls
- Comprehensive logging for debugging

### Performance Optimizations
- Policy data caching to avoid re-parsing
- Selective AI enhancement (only for top relevant sections)
- Configurable options for different use cases

## Monitoring and Debugging

### Logging
The system provides detailed logging for:
- Policy data loading and parsing
- AI API calls and responses
- Fallback activations
- Processing times and performance metrics

### Error Handling
- Invalid API keys: Falls back to mock responses
- Network failures: Uses cached data and basic summaries
- Parsing errors: Falls back to mock policy data
- AI failures: Uses rule-based content generation

## Future Enhancements

1. **Multiple AI Providers**: Support for OpenAI, Anthropic direct APIs
2. **Advanced Caching**: Redis-based caching for production
3. **Real-time Updates**: Webhook-based policy data updates
4. **Analytics**: User interaction tracking and summary effectiveness metrics
5. **Multilingual Support**: Support for Traditional Chinese summaries

## Troubleshooting

### Common Issues

**"Invalid AWS Bedrock configuration"**
- Check that BEDROCK_API_KEY is set in your environment
- Verify AWS Bedrock access in your region
- Ensure Claude models are enabled in your AWS console

**"Failed to load real policy data"**
- Check that `vendor/policy_address_2025_summary.md` exists
- Verify file permissions and encoding (should be UTF-8)
- System will fall back to mock data automatically

**"AI enhancement failed"**
- Check network connectivity to AWS Bedrock
- Verify API key permissions and quotas
- System will use basic summaries as fallback

### Performance Tips

1. **Set up caching**: Policy data is cached after first load
2. **Monitor API usage**: AWS Bedrock has usage limits and costs
3. **Use selective enhancement**: Only top relevant sections use AI
4. **Configure timeouts**: Adjust timeouts based on your needs

## Security Considerations

1. **API Key Management**: Store API keys securely, use IAM roles in production
2. **Data Privacy**: User profiles are not stored, only used for generation
3. **Rate Limiting**: Implement rate limiting for production use
4. **Input Validation**: All user inputs are validated before processing