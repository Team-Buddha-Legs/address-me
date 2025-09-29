"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getStepById } from "@/lib/form-steps";
import type { FormStep } from "@/types";
import FormStepWrapper from "./FormStepWrapper";

export default function AssessmentStepClient() {
  const params = useParams();
  const [stepConfig, setStepConfig] = useState<Omit<
    FormStep,
    "validation"
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stepId = params.step as string;
    if (stepId) {
      const config = getStepById(stepId);
      setStepConfig(config || null);
      setIsLoading(false);
    }
  }, [params.step]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <LoadingSpinner size="lg" className="mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Loading assessment step...</p>
      </div>
    );
  }

  if (!stepConfig) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step Not Found
        </h2>
        <p className="text-gray-600">
          The requested assessment step could not be found.
        </p>
      </div>
    );
  }

  const handleStepComplete = (stepId: string, data: Record<string, unknown>) => {
    // For the individual step flow, we would need to handle navigation
    // This is a simplified implementation
    console.log("Step completed:", stepId, data);
  };

  const handleBack = () => {
    // Navigate back or to home
    window.history.back();
  };

  return (
    <FormStepWrapper 
      step={stepConfig} 
      onStepComplete={handleStepComplete}
      onBack={handleBack}
    />
  );
}
