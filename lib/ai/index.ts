// Core types and interfaces

// Factory functions
export {
  createAIProvider,
  getDefaultConfig,
  validateProviderConfig,
} from "./factory";
// Providers
export { AWSBedrockProvider } from "./providers/aws-bedrock";

// Main service
export {
  AIService,
  createDefaultAIService,
} from "./service";
export type {
  AIMessage,
  AIProvider,
  AIProviderConfig,
  AIProviderType,
  AIResponse,
  AIServiceError,
} from "./types";
