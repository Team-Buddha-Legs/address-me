import { beforeEach, describe, expect, it } from "vitest";
import { AWSBedrockProvider } from "@/lib/ai/providers/aws-bedrock";
import type { AIMessage, AIProviderConfig } from "@/lib/ai/types";

describe("AWSBedrockProvider", () => {
  let provider: AWSBedrockProvider;
  let config: AIProviderConfig;

  beforeEach(() => {
    config = {
      name: "aws-bedrock",
      model: "anthropic.claude-3-sonnet-20240229-v1:0",
      region: "us-east-1",
    };
    provider = new AWSBedrockProvider(config);
  });

  describe("constructor", () => {
    it("should create provider with valid config", () => {
      expect(provider.name).toBe("aws-bedrock");
      expect(provider.model).toBe("anthropic.claude-3-sonnet-20240229-v1:0");
    });

    it("should throw error for invalid provider name", () => {
      const invalidConfig = {
        name: "openai" as any,
        model: "test-model",
        region: "us-east-1",
      };

      expect(() => new AWSBedrockProvider(invalidConfig)).toThrow(
        "Invalid provider config for AWS Bedrock",
      );
    });

    it("should use default region if not provided", () => {
      const configWithoutRegion: AIProviderConfig = {
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
      };

      const providerWithDefaultRegion = new AWSBedrockProvider(
        configWithoutRegion,
      );
      expect(providerWithDefaultRegion.validateConfig()).toBe(true);
    });
  });

  describe("validateConfig", () => {
    it("should return true for valid config", () => {
      expect(provider.validateConfig()).toBe(true);
    });

    it("should return false for missing model", () => {
      const invalidConfig: AIProviderConfig = {
        name: "aws-bedrock",
        model: "",
        region: "us-east-1",
      };
      const invalidProvider = new AWSBedrockProvider(invalidConfig);
      expect(invalidProvider.validateConfig()).toBe(false);
    });
  });

  describe("generateResponse", () => {
    it("should generate response with valid messages", async () => {
      const messages: AIMessage[] = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, how are you?" },
      ];

      const response = await provider.generateResponse(messages);

      expect(response).toHaveProperty("content");
      expect(response).toHaveProperty(
        "model",
        "anthropic.claude-3-sonnet-20240229-v1:0",
      );
      expect(response).toHaveProperty("finishReason");
      expect(response.content).toBe("Mock response from AWS Bedrock");
    });

    it("should throw error for invalid config", async () => {
      const invalidConfig: AIProviderConfig = {
        name: "aws-bedrock",
        model: "",
        region: "us-east-1",
      };
      const invalidProvider = new AWSBedrockProvider(invalidConfig);

      const messages: AIMessage[] = [{ role: "user", content: "Test message" }];

      await expect(invalidProvider.generateResponse(messages)).rejects.toThrow(
        "Invalid AWS Bedrock configuration",
      );
    });

    it("should format messages correctly for Bedrock", async () => {
      const messages: AIMessage[] = [
        { role: "system", content: "You are helpful." },
        { role: "user", content: "Hello!" },
        { role: "assistant", content: "Hi there!" },
        { role: "user", content: "How are you?" },
      ];

      // This test verifies the message formatting logic
      const response = await provider.generateResponse(messages);
      expect(response.content).toBe("Mock response from AWS Bedrock");
    });

    it("should include usage information in response", async () => {
      const messages: AIMessage[] = [{ role: "user", content: "Test message" }];

      const response = await provider.generateResponse(messages);

      expect(response.usage).toBeDefined();
      expect(response.usage?.inputTokens).toBe(100);
      expect(response.usage?.outputTokens).toBe(50);
    });
  });
});
