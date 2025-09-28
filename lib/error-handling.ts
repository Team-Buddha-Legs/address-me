/**
 * Comprehensive error handling utilities for server actions and client-side errors
 */

import { logger } from '@/lib/privacy/logger';

// Error types for better error categorization
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  AI_SERVICE = 'ai_service',
  RATE_LIMIT = 'rate_limit',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

// Custom error classes
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.VALIDATION, 400, true, context);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.NETWORK, 503, true, context);
    this.name = 'NetworkError';
  }
}

export class AIServiceError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.AI_SERVICE, 503, true, context);
    this.name = 'AIServiceError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.RATE_LIMIT, 429, true, context);
    this.name = 'RateLimitError';
  }
}

// Error handling result type
export interface ErrorResult {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    statusCode: number;
    context?: Record<string, unknown>;
  };
}

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export type Result<T> = SuccessResult<T> | ErrorResult;

// Error handler for server actions
export async function handleServerAction<T>(
  action: () => Promise<T>,
  context?: string
): Promise<Result<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    const appError = normalizeError(error);
    
    // Log the error
    logger.error(`Server action error: ${context || 'Unknown'}`, {
      type: appError.type,
      message: appError.message,
      statusCode: appError.statusCode,
      context: appError.context,
      stack: appError.stack,
    });

    return {
      success: false,
      error: {
        type: appError.type,
        message: appError.message,
        statusCode: appError.statusCode,
        context: appError.context,
      },
    };
  }
}

// Error handler for client-side async operations
export async function handleClientAction<T>(
  action: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await action();
  } catch (error) {
    const appError = normalizeError(error);
    
    // Log the error
    logger.error(`Client action error: ${context || 'Unknown'}`, {
      type: appError.type,
      message: appError.message,
      context: appError.context,
      stack: appError.stack,
    });

    // Re-throw for error boundaries to catch
    throw appError;
  }
}

// Normalize any error to AppError
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message, { originalError: error.name });
    }

    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return new RateLimitError(error.message, { originalError: error.name });
    }

    if (error.message.includes('AI') || error.message.includes('bedrock')) {
      return new AIServiceError(error.message, { originalError: error.name });
    }

    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return new ValidationError(error.message, { originalError: error.name });
    }

    // Generic error
    return new AppError(
      error.message,
      ErrorType.UNKNOWN,
      500,
      true,
      { originalError: error.name, stack: error.stack }
    );
  }

  // Handle non-Error objects
  return new AppError(
    String(error),
    ErrorType.UNKNOWN,
    500,
    true,
    { originalError: typeof error }
  );
}

// Error recovery strategies
export interface RecoveryStrategy {
  canRecover: (error: AppError) => boolean;
  recover: (error: AppError) => Promise<void>;
  maxRetries?: number;
  retryDelay?: number;
}

export class ErrorRecoveryManager {
  private strategies: RecoveryStrategy[] = [];

  addStrategy(strategy: RecoveryStrategy) {
    this.strategies.push(strategy);
  }

  async attemptRecovery(error: AppError): Promise<boolean> {
    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          await strategy.recover(error);
          return true;
        } catch (recoveryError) {
          logger.warn('Error recovery failed', {
            originalError: error.message,
            recoveryError: String(recoveryError),
          });
        }
      }
    }
    return false;
  }
}

// Default recovery strategies
export const networkRecoveryStrategy: RecoveryStrategy = {
  canRecover: (error) => error.type === ErrorType.NETWORK,
  recover: async (error) => {
    // Wait for network to be available
    if (typeof window !== 'undefined') {
      return new Promise((resolve) => {
        const checkOnline = () => {
          if (navigator.onLine) {
            resolve();
          } else {
            setTimeout(checkOnline, 1000);
          }
        };
        checkOnline();
      });
    }
  },
  maxRetries: 3,
  retryDelay: 2000,
};

export const rateLimitRecoveryStrategy: RecoveryStrategy = {
  canRecover: (error) => error.type === ErrorType.RATE_LIMIT,
  recover: async () => {
    // Wait for rate limit to reset (typically 1 minute)
    await new Promise(resolve => setTimeout(resolve, 60000));
  },
  maxRetries: 2,
  retryDelay: 60000,
};

// Global error recovery manager instance
export const errorRecoveryManager = new ErrorRecoveryManager();
errorRecoveryManager.addStrategy(networkRecoveryStrategy);
errorRecoveryManager.addStrategy(rateLimitRecoveryStrategy);

// Utility functions for error handling in components
export function getErrorMessage(error: unknown): string {
  const appError = normalizeError(error);
  
  // Return user-friendly messages based on error type
  switch (appError.type) {
    case ErrorType.NETWORK:
      return "Connection error. Please check your internet connection and try again.";
    case ErrorType.AI_SERVICE:
      return "AI service is temporarily unavailable. Please try again in a few minutes.";
    case ErrorType.RATE_LIMIT:
      return "Too many requests. Please wait a moment before trying again.";
    case ErrorType.VALIDATION:
      return appError.message; // Validation messages are usually user-friendly
    case ErrorType.NOT_FOUND:
      return "The requested resource was not found.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function getErrorTitle(error: unknown): string {
  const appError = normalizeError(error);
  
  switch (appError.type) {
    case ErrorType.NETWORK:
      return "Connection Error";
    case ErrorType.AI_SERVICE:
      return "Service Unavailable";
    case ErrorType.RATE_LIMIT:
      return "Too Many Requests";
    case ErrorType.VALIDATION:
      return "Invalid Input";
    case ErrorType.NOT_FOUND:
      return "Not Found";
    default:
      return "Error";
  }
}

// Hook for handling errors in React components
export function createErrorHandler(context: string) {
  return {
    handleAsync: <T>(action: () => Promise<T>) => handleClientAction(action, context),
    normalize: normalizeError,
    getMessage: getErrorMessage,
    getTitle: getErrorTitle,
  };
}