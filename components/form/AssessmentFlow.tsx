"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formSteps } from "@/lib/form-steps";
import { userProfileSchema } from "@/lib/validation";
import { generatePersonalizedSummary } from "@/lib/ai/summary-wrapper";
import FormStepWrapper from "./FormStepWrapper";
import ProcessingDisplay from "./ProcessingDisplay";
import { ReportDisplay } from "../report/ReportDisplay";
import type { UserProfile, PersonalizedSummary } from "@/types";

type AssessmentState = "form" | "processing" | "report" | "error";

export default function AssessmentFlow() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, Record<string, unknown>>>({});
  const [state, setState] = useState<AssessmentState>("form");
  const [summary, setSummary] = useState<PersonalizedSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStep = formSteps[currentStepIndex];
  const isLastStep = currentStepIndex === formSteps.length - 1;

  const handleStepComplete = async (stepId: string, data: Record<string, unknown>) => {
    // Update form data
    const updatedFormData = {
      ...formData,
      [stepId]: data,
    };
    setFormData(updatedFormData);

    if (isLastStep) {
      // Process complete assessment
      await processCompleteAssessment(updatedFormData);
    } else {
      // Move to next step
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      router.push("/");
    }
  };

  const processCompleteAssessment = async (completeFormData: Record<string, Record<string, unknown>>) => {
    setState("processing");
    setError(null);

    try {
      // Combine all form data into a user profile
      const combinedData = Object.values(completeFormData).reduce((acc, stepData) => {
        return { ...acc, ...stepData };
      }, {});

      // Validate the complete profile
      const userProfile = userProfileSchema.parse(combinedData) as UserProfile;

      // Generate AI summary directly
      const generatedSummary = await generatePersonalizedSummary(userProfile);

      setSummary(generatedSummary);
      setState("report");
    } catch (err) {
      console.error("Assessment processing error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to generate your personalized report. Please try again."
      );
      setState("error");
    }
  };

  const handleRetry = () => {
    setState("form");
    setError(null);
    setSummary(null);
  };

  const handleStartOver = () => {
    setCurrentStepIndex(0);
    setFormData({});
    setState("form");
    setError(null);
    setSummary(null);
  };

  if (state === "processing") {
    return <ProcessingDisplay />;
  }

  if (state === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
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
              onClick={handleRetry}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={handleStartOver}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "report" && summary) {
    return (
      <ReportDisplay 
        summary={summary} 
        reportId={`temp-${Date.now()}`}
        onStartOver={handleStartOver}
      />
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <FormStepWrapper
          step={currentStep}
          onStepComplete={handleStepComplete}
          onBack={handleBack}
          initialData={formData[currentStep.id] || {}}
        />
      </div>
    </div>
  );
}