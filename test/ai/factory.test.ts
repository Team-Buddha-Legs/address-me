import { describe, expect, it } from "vitest";
import {
  createAIProvider,
  getDefaultConfig,
  validateProviderConfig,
} from "@/lib/ai/factory";
import { AWSBedrockProvider } from "@/lib/ai/providers/aws-bedrock";
import type { AIProviderConfig } from "@/lib/ai/types";

describe("AI Factory", () => {
  describe("createAIProvider", () => {
    it("should create AWS Bedrock provider", () => {
      const config: AIProviderConfig = {
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        region: "us-east-1",
      };

      const provider = createAIProvider(config);
      expect(provider).toBeInstanceOf(AWSBedrockProvider);
      expect(provider.name).toBe("aws-bedrock");
      expect(provider.model).toBe("anthropic.claude-3-sonnet-20240229-v1:0");
    });

    it("should throw error for unsupported provider", () => {
      const config = {
        name: "unsupported" as any,
        model: "test-model",
      };

      expect(() => createAIProvider(config)).toThrow(
        "Unsupported AI provider: unsupported",
      );
    });

    it("should throw error for unimplemented providers", () => {
      const openaiConfig: AIProviderConfig = {
        name: "openai",
        model: "gpt-4",
        apiKey: "test-key",
      };

      expect(() => createAIProvider(openaiConfig)).toThrow(
        "OpenAI provider not yet implemented",
      );

      const anthropicConfig: AIProviderConfig = {
        name: "anthropic",
        model: "claude-3-sonnet",
        apiKey: "test-key",
      };

      expect(() => createAIProvider(anthropicConfig)).toThrow(
        "Anthropic provider not yet implemented",
      );
    });
  });

  describe("getDefaultConfig", () => {
    it("should return default config for AWS Bedrock", () => {
      const config = getDefaultConfig("aws-bedrock");
      expect(config).toEqual({
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        region: "us-east-1",
      });
    });

    it("should return default config for OpenAI", () => {
      const config = getDefaultConfig("openai");
      expect(config).toEqual({
        name: "openai",
        model: "gpt-4-turbo-preview",
      });
    });

    it("should return default config for Anthropic", () => {
      const config = getDefaultConfig("anthropic");
      expect(config).toEqual({
        name: "anthropic",
        model: "claude-3-sonnet-20240229",
      });
    });

    it("should throw error for unsupported provider", () => {
      expect(() => getDefaultConfig("unsupported" as any)).toThrow(
        "No default config available for provider: unsupported",
      );
    });
  });

  describe("validateProviderConfig", () => {
    it("should validate AWS Bedrock config", () => {
      const validConfig: AIProviderConfig = {
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        region: "us-east-1",
      };
      expect(validateProviderConfig(validConfig)).toBe(true);

      const invalidConfig: AIProviderConfig = {
        name: "aws-bedrock",
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        // missing region
      };
      expect(validateProviderConfig(invalidConfig)).toBe(false);
    });

    it("should validate OpenAI config", () => {
      const validConfig: AIProviderConfig = {
        name: "openai",
        model: "gpt-4",
        apiKey: "test-key",
      };
      expect(validateProviderConfig(validConfig)).toBe(true);

      const invalidConfig: AIProviderConfig = {
        name: "openai",
        model: "gpt-4",
        // missing apiKey
      };
      expect(validateProviderConfig(invalidConfig)).toBe(false);
    });

    it("should validate Anthropic config", () => {
      const validConfig: AIProviderConfig = {
        name: "anthropic",
        model: "claude-3-sonnet",
        apiKey: "test-key",
      };
      expect(validateProviderConfig(validConfig)).toBe(true);

      const invalidConfig: AIProviderConfig = {
        name: "anthropic",
        model: "claude-3-sonnet",
        // missing apiKey
      };
      expect(validateProviderConfig(invalidConfig)).toBe(false);
    });

    it("should return false for missing required fields", () => {
      const configWithoutName = {
        model: "test-model",
      } as AIProviderConfig;
      expect(validateProviderConfig(configWithoutName)).toBe(false);

      const configWithoutModel = {
        name: "aws-bedrock",
      } as AIProviderConfig;
      expect(validateProviderConfig(configWithoutModel)).toBe(false);
    });
  });
});
