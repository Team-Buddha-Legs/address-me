"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { logger } from "@/lib/privacy/logger";
import ErrorBoundary from "./ErrorBoundary";

// Error context for managing global error state
interface ErrorContextType {
  reportError: (error: Error, context?: string) => void;
  clearError: () => void;
  hasGlobalError: boolean;
  globalError: Error | null;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function useErrorHandler() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error(
      "useErrorHandler must be used within ErrorBoundaryProvider",
    );
  }
  return context;
}

// Global error notification component
interface ErrorNotificationProps {
  error: Error;
  onDismiss: () => void;
}

function ErrorNotification({ error, onDismiss }: ErrorNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Error alert icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Something went wrong
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Close error"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main error boundary provider
interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
  enableGlobalNotifications?: boolean;
}

export default function ErrorBoundaryProvider({
  children,
  enableGlobalNotifications = true,
}: ErrorBoundaryProviderProps) {
  const [globalError, setGlobalError] = useState<Error | null>(null);
  const [notificationError, setNotificationError] = useState<Error | null>(
    null,
  );

  const reportError = useCallback(
    (error: Error, context?: string) => {
      // Log the error
      logger.error(`Error reported: ${context || "Unknown context"}`, {
        message: error.message,
        stack: error.stack,
        context,
      });

      // Set global error state
      setGlobalError(error);

      // Show notification if enabled
      if (enableGlobalNotifications) {
        setNotificationError(error);

        // Auto-dismiss notification after 5 seconds
        setTimeout(() => {
          setNotificationError(null);
        }, 5000);
      }
    },
    [enableGlobalNotifications],
  );

  const clearError = useCallback(() => {
    setGlobalError(null);
    setNotificationError(null);
  }, []);

  const handleErrorBoundaryError = useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      logger.error("ErrorBoundary caught error", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });

      reportError(error, "ErrorBoundary");
    },
    [reportError],
  );

  const contextValue: ErrorContextType = {
    reportError,
    clearError,
    hasGlobalError: globalError !== null,
    globalError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      <ErrorBoundary onError={handleErrorBoundaryError}>
        {children}

        {/* Global error notifications */}
        <AnimatePresence>
          {notificationError && (
            <ErrorNotification
              error={notificationError}
              onDismiss={() => setNotificationError(null)}
            />
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </ErrorContext.Provider>
  );
}

// Hook for handling async errors (useful for server actions)
export function useAsyncErrorHandler() {
  const { reportError } = useErrorHandler();

  const handleAsync = useCallback(
    async (asyncFn: () => Promise<any>, context?: string): Promise<any> => {
      try {
        return await asyncFn();
      } catch (error) {
        if (error instanceof Error) {
          reportError(error, context);
        } else {
          reportError(new Error(String(error)), context);
        }
        return null;
      }
    },
    [reportError],
  );

  return handleAsync;
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{
    error: Error;
    resetError: () => void;
  }>,
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary fallback={fallbackComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
