import { AWSBedrockProvider } from "./providers/aws-bedrock";
import type { AIProvider, AIProviderConfig, AIProviderType } from "./types";

/**
 * Factory function to create AI provider instances
 */
export function createAIProvider(config: AIProviderConfig): AIProvider {
  switch (config.name) {
    case "aws-bedrock":
      return new AWSBedrockProvider(config);

    case "openai":
      // Placeholder for OpenAI provider
      throw new Error("OpenAI provider not yet implemented");

    case "anthropic":
      // Placeholder for Anthropic provider
      throw new Error("Anthropic provider not yet implemented");

    default:
      throw new Error(`Unsupported AI provider: ${config.name}`);
  }
}

/**
 * Get default configuration for a provider type
 */
export function getDefaultConfig(
  providerType: AIProviderType,
): Partial<AIProviderConfig> {
  switch (providerType) {
    case "aws-bedrock":
      return {
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        region: "us-east-1",
      };

    case "openai":
      return {
        name: "openai",
        model: "gpt-4-turbo-preview",
      };

    case "anthropic":
      return {
        name: "anthropic",
        model: "claude-3-sonnet-20240229",
      };

    default:
      throw new Error(
        `No default config available for provider: ${providerType}`,
      );
  }
}

/**
 * Validate provider configuration
 */
export function validateProviderConfig(config: AIProviderConfig): boolean {
  if (!config.name || !config.model) {
    return false;
  }

  switch (config.name) {
    case "aws-bedrock":
      return !!config.region;

    case "openai":
      return !!config.apiKey;

    case "anthropic":
      return !!config.apiKey;

    default:
      return false;
  }
}
