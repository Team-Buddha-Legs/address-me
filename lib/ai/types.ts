/**
 * Core AI provider types and interfaces for swappable AI architecture
 */

export type AIProviderType = "aws-bedrock" | "openai" | "anthropic";

export interface AIProviderConfig {
  name: AIProviderType;
  apiKey?: string;
  region?: string;
  model: string;
  options?: Record<string, unknown>;
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
  finishReason?: "stop" | "length" | "content_filter";
}

export interface AIProvider {
  readonly name: AIProviderType;
  readonly model: string;

  generateResponse(messages: AIMessage[]): Promise<AIResponse>;
  validateConfig(): boolean;
}

export interface AIServiceError extends Error {
  code: "PROVIDER_ERROR" | "INVALID_CONFIG" | "RATE_LIMIT" | "NETWORK_ERROR";
  provider: AIProviderType;
  originalError?: Error;
}
