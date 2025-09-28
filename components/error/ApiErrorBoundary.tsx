"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface ApiErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function ApiErrorFallback({ error, resetError }: ApiErrorFallbackProps) {
  const isNetworkError =
    error.message.includes("fetch") || error.message.includes("network");
  const isRateLimitError =
    error.message.includes("rate limit") || error.message.includes("429");
  const isAIServiceError =
    error.message.includes("AI") || error.message.includes("bedrock");

  let errorTitle = "Service Error";
  let errorMessage =
    "We encountered an issue with our services. Please try again.";
  let actionText = "Try Again";

  if (isNetworkError) {
    errorTitle = "Connection Error";
    errorMessage =
      "Unable to connect to our services. Please check your internet connection and try again.";
  } else if (isRateLimitError) {
    errorTitle = "Too Many Requests";
    errorMessage =
      "You've made too many requests. Please wait a moment before trying again.";
    actionText = "Wait and Retry";
  } else if (isAIServiceError) {
    errorTitle = "AI Service Unavailable";
    errorMessage =
      "Our AI analysis service is temporarily unavailable. Please try again in a few minutes.";
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
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="API error icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-900 mb-4"
        >
          {errorTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          {errorMessage}
        </motion.p>

        {isRateLimitError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-yellow-50 rounded-lg"
          >
            <p className="text-sm text-yellow-800">
              Rate limiting helps us maintain service quality for all users.
              Please wait a few minutes before trying again.
            </p>
          </motion.div>
        )}

        {isAIServiceError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg"
          >
            <p className="text-sm text-blue-800">
              Our AI analysis service is experiencing high demand. Your
              assessment data is saved and you can retry shortly.
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
            type="button"
            onClick={resetError}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            {actionText}
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Go Home
          </Link>
        </motion.div>

        {process.env.NODE_ENV === "development" && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-left bg-gray-50 rounded p-4"
          >
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function ApiErrorBoundary({
  children,
  onError,
}: ApiErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={ApiErrorFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
