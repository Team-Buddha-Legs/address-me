import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AIServiceError,
  AppError,
  ErrorRecoveryManager,
  ErrorType,
  getErrorMessage,
  getErrorTitle,
  handleClientAction,
  handleServerAction,
  NetworkError,
  networkRecoveryStrategy,
  normalizeError,
  RateLimitError,
  rateLimitRecoveryStrategy,
  ValidationError,
} from "@/lib/error-handling";

// Mock the logger
vi.mock("@/lib/privacy/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe("Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Custom Error Classes", () => {
    it("should create AppError with correct properties", () => {
      const error = new AppError(
        "Test error",
        ErrorType.VALIDATION,
        400,
        true,
        { field: "test" },
      );

      expect(error.message).toBe("Test error");
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.context).toEqual({ field: "test" });
      expect(error.name).toBe("AppError");
    });

    it("should create ValidationError with correct defaults", () => {
      const error = new ValidationError("Invalid input");

      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("ValidationError");
    });

    it("should create NetworkError with correct defaults", () => {
      const error = new NetworkError("Network failed");

      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.statusCode).toBe(503);
      expect(error.name).toBe("NetworkError");
    });

    it("should create AIServiceError with correct defaults", () => {
      const error = new AIServiceError("AI service down");

      expect(error.type).toBe(ErrorType.AI_SERVICE);
      expect(error.statusCode).toBe(503);
      expect(error.name).toBe("AIServiceError");
    });

    it("should create RateLimitError with correct defaults", () => {
      const error = new RateLimitError("Rate limit exceeded");

      expect(error.type).toBe(ErrorType.RATE_LIMIT);
      expect(error.statusCode).toBe(429);
      expect(error.name).toBe("RateLimitError");
    });
  });

  describe("handleServerAction", () => {
    it("should return success result for successful action", async () => {
      const action = vi.fn().mockResolvedValue("success");

      const result = await handleServerAction(action, "test context");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("success");
      }
      expect(action).toHaveBeenCalledOnce();
    });

    it("should return error result for failed action", async () => {
      const error = new ValidationError("Invalid data");
      const action = vi.fn().mockRejectedValue(error);

      const result = await handleServerAction(action, "test context");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.VALIDATION);
        expect(result.error.message).toBe("Invalid data");
        expect(result.error.statusCode).toBe(400);
      }
    });

    it("should normalize unknown errors", async () => {
      const action = vi.fn().mockRejectedValue("string error");

      const result = await handleServerAction(action);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.UNKNOWN);
        expect(result.error.message).toBe("string error");
      }
    });
  });

  describe("handleClientAction", () => {
    it("should return data for successful action", async () => {
      const action = vi.fn().mockResolvedValue("client success");

      const result = await handleClientAction(action, "client context");

      expect(result).toBe("client success");
      expect(action).toHaveBeenCalledOnce();
    });

    it("should throw normalized error for failed action", async () => {
      const originalError = new Error("Client error");
      const action = vi.fn().mockRejectedValue(originalError);

      await expect(
        handleClientAction(action, "client context"),
      ).rejects.toThrow(AppError);
    });
  });

  describe("normalizeError", () => {
    it("should return AppError as-is", () => {
      const appError = new AppError("Test");
      const result = normalizeError(appError);

      expect(result).toBe(appError);
    });

    it("should convert network errors", () => {
      const networkError = new Error("fetch failed");
      const result = normalizeError(networkError);

      expect(result).toBeInstanceOf(NetworkError);
      expect(result.type).toBe(ErrorType.NETWORK);
    });

    it("should convert rate limit errors", () => {
      const rateLimitError = new Error("rate limit exceeded");
      const result = normalizeError(rateLimitError);

      expect(result).toBeInstanceOf(RateLimitError);
      expect(result.type).toBe(ErrorType.RATE_LIMIT);
    });

    it("should convert AI service errors", () => {
      const aiError = new Error("AI service failed");
      const result = normalizeError(aiError);

      expect(result).toBeInstanceOf(AIServiceError);
      expect(result.type).toBe(ErrorType.AI_SERVICE);
    });

    it("should convert validation errors", () => {
      const validationError = new Error("validation failed");
      const result = normalizeError(validationError);

      expect(result).toBeInstanceOf(ValidationError);
      expect(result.type).toBe(ErrorType.VALIDATION);
    });

    it("should handle non-Error objects", () => {
      const result = normalizeError({ message: "object error" });

      expect(result).toBeInstanceOf(AppError);
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe("[object Object]");
    });

    it("should handle null/undefined", () => {
      const result = normalizeError(null);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("null");
    });
  });

  describe("Error Message Utilities", () => {
    it("should return user-friendly messages for different error types", () => {
      expect(getErrorMessage(new NetworkError("Network failed"))).toBe(
        "Connection error. Please check your internet connection and try again.",
      );

      expect(getErrorMessage(new AIServiceError("AI failed"))).toBe(
        "AI service is temporarily unavailable. Please try again in a few minutes.",
      );

      expect(getErrorMessage(new RateLimitError("Rate limit"))).toBe(
        "Too many requests. Please wait a moment before trying again.",
      );

      expect(getErrorMessage(new ValidationError("Invalid email"))).toBe(
        "Invalid email",
      );

      expect(getErrorMessage(new AppError("Unknown", ErrorType.UNKNOWN))).toBe(
        "An unexpected error occurred. Please try again.",
      );
    });

    it("should return appropriate titles for different error types", () => {
      expect(getErrorTitle(new NetworkError("Network failed"))).toBe(
        "Connection Error",
      );
      expect(getErrorTitle(new AIServiceError("AI failed"))).toBe(
        "Service Unavailable",
      );
      expect(getErrorTitle(new RateLimitError("Rate limit"))).toBe(
        "Too Many Requests",
      );
      expect(getErrorTitle(new ValidationError("Invalid"))).toBe(
        "Invalid Input",
      );
      expect(getErrorTitle(new AppError("Unknown", ErrorType.UNKNOWN))).toBe(
        "Error",
      );
    });
  });

  describe("Error Recovery Manager", () => {
    it("should add and execute recovery strategies", async () => {
      const manager = new ErrorRecoveryManager();
      const mockRecover = vi.fn().mockResolvedValue(undefined);

      const strategy = {
        canRecover: (error: AppError) => error.type === ErrorType.NETWORK,
        recover: mockRecover,
      };

      manager.addStrategy(strategy);

      const networkError = new NetworkError("Network failed");
      const recovered = await manager.attemptRecovery(networkError);

      expect(recovered).toBe(true);
      expect(mockRecover).toHaveBeenCalledWith(networkError);
    });

    it("should return false when no strategy can recover", async () => {
      const manager = new ErrorRecoveryManager();

      const strategy = {
        canRecover: () => false,
        recover: vi.fn(),
      };

      manager.addStrategy(strategy);

      const error = new AppError("Test error");
      const recovered = await manager.attemptRecovery(error);

      expect(recovered).toBe(false);
    });

    it("should handle recovery strategy failures", async () => {
      const manager = new ErrorRecoveryManager();

      const strategy = {
        canRecover: () => true,
        recover: vi.fn().mockRejectedValue(new Error("Recovery failed")),
      };

      manager.addStrategy(strategy);

      const error = new AppError("Test error");
      const recovered = await manager.attemptRecovery(error);

      expect(recovered).toBe(false);
    });
  });

  describe("Default Recovery Strategies", () => {
    it("should identify network errors for recovery", () => {
      const networkError = new NetworkError("Network failed");
      const otherError = new ValidationError("Invalid");

      expect(networkRecoveryStrategy.canRecover(networkError)).toBe(true);
      expect(networkRecoveryStrategy.canRecover(otherError)).toBe(false);
    });

    it("should identify rate limit errors for recovery", () => {
      const rateLimitError = new RateLimitError("Rate limit");
      const otherError = new NetworkError("Network");

      expect(rateLimitRecoveryStrategy.canRecover(rateLimitError)).toBe(true);
      expect(rateLimitRecoveryStrategy.canRecover(otherError)).toBe(false);
    });
  });
});
