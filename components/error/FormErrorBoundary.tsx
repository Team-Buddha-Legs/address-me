"use client";

import { motion } from "framer-motion";
import type React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface FormErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function FormErrorFallback({ resetError }: FormErrorFallbackProps) {
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
              aria-label="Form error icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-5-1.691c-2.598-2.11-3.292-5.754-1.566-8.546L12 3l6.566 7.163c1.726 2.792 1.032 6.436-1.566 8.546z"
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
          Form Error
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          There was an issue with the assessment form. Your progress has been
          saved, and you can try continuing or start over.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <button
            type="button"
            onClick={resetError}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Continue Assessment
          </button>

          <button
            type="button"
            onClick={() => {
              // Clear form data and redirect to start
              if (typeof window !== "undefined") {
                localStorage.removeItem("assessment-progress");
                window.location.href = "/";
              }
            }}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Start Over
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function FormErrorBoundary({
  children,
  onError,
}: FormErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={FormErrorFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
