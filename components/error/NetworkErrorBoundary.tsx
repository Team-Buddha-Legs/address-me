"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface NetworkErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function NetworkErrorFallback({
  error,
  resetError,
}: NetworkErrorFallbackProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    resetError();
  };

  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("Failed to fetch") ||
    !isOnline;

  if (!isNetworkError) {
    // Fall back to default error handling for non-network errors
    throw error;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
              isOnline ? "bg-orange-100" : "bg-red-100"
            }`}
          >
            {isOnline ? (
              <svg
                className="w-10 h-10 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728"
                />
              </svg>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              isOnline
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {isOnline ? "Online" : "Offline"}
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            {isOnline ? "Connection Error" : "You're Offline"}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          {isOnline
            ? "We're having trouble connecting to our servers. This might be a temporary issue."
            : "Please check your internet connection and try again when you're back online."}
        </motion.p>

        {retryCount > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-yellow-50 rounded-lg"
          >
            <p className="text-sm text-yellow-800">
              Multiple retry attempts detected. There might be a service outage.
              Please try again later or contact support if the issue persists.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className={`w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isOnline
                ? "text-white bg-primary hover:bg-primary-dark focus:ring-primary"
                : "text-gray-400 bg-gray-200 cursor-not-allowed"
            }`}
          >
            {retryCount > 0 ? `Retry (${retryCount + 1})` : "Try Again"}
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Go Home
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500">
            Your assessment progress is saved locally and will be restored when
            the connection is available.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function NetworkErrorBoundary({
  children,
  onError,
}: NetworkErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={NetworkErrorFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
