import { createAIProvider } from "./factory";
import type {
  AIMessage,
  AIProvider,
  AIProviderConfig,
  AIResponse,
} from "./types";

/**
 * Main AI service that manages provider switching and provides a unified interface
 */
export class AIService {
  private provider: AIProvider;
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.provider = createAIProvider(config);
  }

  /**
   * Switch to a different AI provider
   */
  switchProvider(newConfig: AIProviderConfig): void {
    this.config = newConfig;
    this.provider = createAIProvider(newConfig);
  }

  /**
   * Get current provider information
   */
  getCurrentProvider(): { name: string; model: string } {
    return {
      name: this.provider.name,
      model: this.provider.model,
    };
  }

  /**
   * Generate a response using the current provider
   */
  async generateResponse(messages: AIMessage[]): Promise<AIResponse> {
    return this.provider.generateResponse(messages);
  }

  /**
   * Validate current configuration
   */
  validateConfig(): boolean {
    return this.provider.validateConfig();
  }

  /**
   * Generate a simple text completion
   */
  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
  ): Promise<string> {
    const messages: AIMessage[] = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: prompt });

    const response = await this.generateResponse(messages);
    return response.content;
  }
}

/**
 * Create a default AI service instance
 */
export function createDefaultAIService(): AIService {
  const config: AIProviderConfig = {
    name: "aws-bedrock",
    model: "anthropic.claude-3-sonnet-20240229-v1:0",
    region: "us-east-1",
  };

  return new AIService(config);
}
