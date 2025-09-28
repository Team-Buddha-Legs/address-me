import { beforeEach, describe, expect, it } from "vitest";
import { AIService, createDefaultAIService } from "@/lib/ai/service";
import type { AIMessage, AIProviderConfig } from "@/lib/ai/types";

describe("AIService", () => {
  let service: AIService;
  let config: AIProviderConfig;

  beforeEach(() => {
    config = {
      name: "aws-bedrock",
      model: "anthropic.claude-3-sonnet-20240229-v1:0",
      region: "us-east-1",
    };
    service = new AIService(config);
  });

  describe("constructor", () => {
    it("should create service with valid config", () => {
      expect(service).toBeInstanceOf(AIService);
      expect(service.getCurrentProvider().name).toBe("aws-bedrock");
      expect(service.getCurrentProvider().model).toBe(
        "anthropic.claude-3-sonnet-20240229-v1:0",
      );
    });
  });

  describe("switchProvider", () => {
    it("should switch to different provider", () => {
      const newConfig: AIProviderConfig = {
        name: "aws-bedrock",
        model: "anthropic.claude-3-haiku-20240307-v1:0",
        region: "us-west-2",
      };

      service.switchProvider(newConfig);

      expect(service.getCurrentProvider().model).toBe(
        "anthropic.claude-3-haiku-20240307-v1:0",
      );
    });

    it("should throw error when switching to unsupported provider", () => {
      const invalidConfig = {
        name: "unsupported" as any,
        model: "test-model",
      };

      expect(() => service.switchProvider(invalidConfig)).toThrow(
        "Unsupported AI provider: unsupported",
      );
    });
  });

  describe("getCurrentProvider", () => {
    it("should return current provider info", () => {
      const providerInfo = service.getCurrentProvider();

      expect(providerInfo).toEqual({
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
      });
    });
  });

  describe("generateResponse", () => {
    it("should generate response using current provider", async () => {
      const messages: AIMessage[] = [
        { role: "user", content: "Hello, world!" },
      ];

      const response = await service.generateResponse(messages);

      expect(response).toHaveProperty("content");
      expect(response).toHaveProperty("model");
      expect(response.content).toBe("Mock response from AWS Bedrock");
    });
  });

  describe("generateCompletion", () => {
    it("should generate simple completion", async () => {
      const prompt = "What is the capital of France?";

      const completion = await service.generateCompletion(prompt);

      expect(typeof completion).toBe("string");
      expect(completion).toBe("Mock response from AWS Bedrock");
    });

    it("should generate completion with system prompt", async () => {
      const prompt = "What is the capital of France?";
      const systemPrompt = "You are a geography expert.";

      const completion = await service.generateCompletion(prompt, systemPrompt);

      expect(typeof completion).toBe("string");
      expect(completion).toBe("Mock response from AWS Bedrock");
    });
  });

  describe("validateConfig", () => {
    it("should validate current configuration", () => {
      expect(service.validateConfig()).toBe(true);
    });

    it("should return false for invalid configuration", () => {
      const invalidConfig: AIProviderConfig = {
        name: "aws-bedrock",
        model: "",
        region: "us-east-1",
      };

      const invalidService = new AIService(invalidConfig);
      expect(invalidService.validateConfig()).toBe(false);
    });
  });
});

describe("createDefaultAIService", () => {
  it("should create service with default AWS Bedrock config", () => {
    const service = createDefaultAIService();

    expect(service).toBeInstanceOf(AIService);
    expect(service.getCurrentProvider().name).toBe("aws-bedrock");
    expect(service.getCurrentProvider().model).toBe(
      "anthropic.claude-3-sonnet-20240229-v1:0",
    );
    expect(service.validateConfig()).toBe(true);
  });
});
