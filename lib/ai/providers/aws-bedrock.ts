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
  private readonly apiKey: string;

  constructor(config: AIProviderConfig) {
    if (config.name !== "aws-bedrock") {
      throw new Error("Invalid provider config for AWS Bedrock");
    }

    this.model = config.model;
    this.region = config.region || "us-east-1";
    this.apiKey = config.apiKey || "";
  }

  validateConfig(): boolean {
    return !!(this.model && this.region && this.apiKey);
  }

  async generateResponse(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.validateConfig()) {
      const error: AIServiceError = new Error(
        "Invalid AWS Bedrock configuration - missing API key, model, or region"
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
        }`
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

    // Bedrock endpoint for model invocation
    const url = `https://bedrock-runtime.${this.region}.amazonaws.com/model/${this.model}/invoke`;

    // Request payload using OpenAI-like format for DeepSeek models
    const payload = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 4000,
      // Remove the stop parameter that was causing premature termination
      // stop: ["\n"],
    };

    // Headers with Bearer token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Bedrock API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Always get raw text first to handle both JSON and markdown-wrapped JSON
    const rawText = await response.text();
    // console.log("??????");
    // console.log(rawText);
    let data;

    // Check if the response starts with markdown
    if (rawText.trim().startsWith("```json")) {
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          data = JSON.parse(jsonMatch[1]);
        } catch (innerError) {
          throw new Error(`Failed to parse extracted JSON: ${jsonMatch[1]}`);
        }
      } else {
        throw new Error(
          `Found markdown JSON block but couldn't extract it: ${rawText}`
        );
      }
    } else {
      // Try to parse as direct JSON
      try {
        data = JSON.parse(rawText);
      } catch (jsonError) {
        throw new Error(`Failed to parse response as JSON: ${rawText}`);
      }
    }

    return {
      content:
        data.choices?.[0]?.message?.content ||
        data.completion ||
        data.text ||
        data.response ||
        "No response generated",
      usage: {
        inputTokens: data.usage?.prompt_tokens || data.usage?.input_tokens || 0,
        outputTokens:
          data.usage?.completion_tokens || data.usage?.output_tokens || 0,
      },
      finishReason:
        data.choices?.[0]?.finish_reason || data.finish_reason || "stop",
    };
  }
}
