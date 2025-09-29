"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { generateSummary } from "@/lib/actions/ai-actions";

function ProcessingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Analyzing your profile...");
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [aiProcessingStarted, setAiProcessingStarted] = useState(false);

  const steps = [
    "Analyzing your profile...",
    "Matching with Policy Address content...",
    "Generating personalized recommendations...",
    "Finalizing your report...",
  ];

  // Get session ID from URL params
  const sessionId = searchParams.get("session") || searchParams.get("sessionId");

  useEffect(() => {
    if (!sessionId) {
      setError("No session found. Please start over.");
      return;
    }

    if (!aiProcessingStarted) {
      setAiProcessingStarted(true);
      
      // Start the real AI processing
      const processAI = async () => {
        try {
          // Create form data for the AI action
          const formData = new FormData();
          formData.append("sessionId", sessionId);
          formData.append("clientId", `client_${Date.now()}`);
          // Generate a simple CSRF token for this session
          const csrfToken = `csrf_${sessionId}_${Date.now().toString(36)}`;
          formData.append("csrfToken", csrfToken);

          // Call the AI generation action
          const result = await generateSummary(formData);
          
          if (result && !result.success) {
            throw new Error(result.error || "AI generation failed");
          }
          
          // If we get here, the action should have redirected to the report
          // But if not, we'll handle it manually
          setIsComplete(true);
          setCurrentStep("Complete! Redirecting to your report...");
          
          setTimeout(() => {
            router.push(`/report/${sessionId}`);
          }, 1500);
          
        } catch (err) {
          console.error("AI processing error:", err);
          setError(
            err instanceof Error 
              ? err.message 
              : "Failed to generate your personalized report. Please try again."
          );
        }
      };

      processAI();
    }

    // Progress simulation while AI is processing
    let interval: NodeJS.Timeout;

    if (!isComplete && !error) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + Math.random() * 8, 95); // Cap at 95% until AI completes

          // Update step based on progress
          if (newProgress < 25) {
            setCurrentStep(steps[0]);
          } else if (newProgress < 50) {
            setCurrentStep(steps[1]);
          } else if (newProgress < 75) {
            setCurrentStep(steps[2]);
          } else {
            setCurrentStep(steps[3]);
          }

          return newProgress;
        });
      }, 800);
    }

    // Timeout after 3 minutes as fallback
    const timeout = setTimeout(() => {
      if (!isComplete) {
        setError(
          "Processing is taking longer than expected. Please try again.",
        );
      }
    }, 180000);

    return () => {
      if (interval) clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router, sessionId, aiProcessingStarted, isComplete, error]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Error icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Processing Error
          </h1>

          <p className="text-gray-600 mb-8">{error}</p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Over
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
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
          {isComplete ? (
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Success icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <LoadingSpinner size="lg" className="mx-auto text-primary" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-900 mb-4"
        >
          Processing Your Assessment
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          We're analyzing your profile and matching it with the latest Policy
          Address content to create your personalized report.
        </motion.p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary-dark h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Current step */}
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-primary font-medium"
        >
          {currentStep}
        </motion.p>

        {/* Estimated time */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 mt-4"
        >
          Estimated time: 30-60 seconds
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProcessingPageContent />
    </Suspense>
  );
}
