import type {
  AIMessage,
  AIProvider,
  AIProviderConfig,
  AIResponse,
  AIServiceError,
} from "../types";

export class AWSBedrockProvider implements AIProvider {
  readonly name = "aws-bedrock" as const;
  readonly model: string;
  private readonly region: string;
  private readonly apiKey?: string;

  constructor(config: AIProviderConfig) {
    if (config.name !== "aws-bedrock") {
      throw new Error("Invalid provider config for AWS Bedrock");
    }

    this.model = config.model;
    this.region = config.region || "us-west-2";
    this.apiKey = config.apiKey;
  }

  validateConfig(): boolean {
    return !!(this.model && this.region && this.apiKey);
  }

  async generateResponse(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.validateConfig()) {
      const error: AIServiceError = new Error(
        "Invalid AWS Bedrock configuration - missing API key",
      ) as AIServiceError;
      error.code = "INVALID_CONFIG";
      error.provider = "aws-bedrock";
      throw error;
    }

    try {
      const response = await this.callBedrockAPI(messages);

      return {
        content: response.content,
        usage: response.usage,
        model: this.model,
        finishReason: response.finishReason || "stop",
      };
    } catch (error) {
      const aiError: AIServiceError = new Error(
        `AWS Bedrock API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ) as AIServiceError;
      aiError.code = "PROVIDER_ERROR";
      aiError.provider = "aws-bedrock";
      aiError.originalError = error instanceof Error ? error : undefined;
      throw aiError;
    }
  }

  private async callBedrockAPI(messages: AIMessage[]): Promise<{
    content: string;
    usage?: { inputTokens: number; outputTokens: number };
    finishReason?: "stop" | "length" | "content_filter";
  }> {
    // Mock implementation for testing
    if (process.env.NODE_ENV === "test") {
      return {
        content: "Mock response from AWS Bedrock",
        usage: { inputTokens: 100, outputTokens: 50 },
        finishReason: "stop",
      };
    }

    // Real AWS Bedrock implementation using fetch API
    const endpoint = `https://bedrock-runtime.${this.region}.amazonaws.com/model/${this.model}/invoke`;
    
    // Format messages for Claude models
    const systemMessage = messages.find(m => m.role === "system");
    const conversationMessages = messages.filter(m => m.role !== "system");
    
    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4000,
      system: systemMessage?.content || "",
      messages: conversationMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "X-Amz-Target": "BedrockRuntime.InvokeModel"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Bedrock API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content?.[0]?.text || "No response generated",
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      },
      finishReason: data.stop_reason === "end_turn" ? "stop" : data.stop_reason
    };
  }
}
