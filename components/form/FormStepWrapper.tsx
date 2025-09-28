"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  calculateProgress,
  getCompletedSteps,
  getNextStepRoute,
  getPreviousStepRoute,
  getTotalSteps,
  isFirstStep,
  isLastStep,
} from "@/lib/form-steps";
import { getStepValidationErrors } from "@/lib/form-validation";
import type { FormStep } from "@/types";
import ErrorDisplay from "./ErrorDisplay";
import FormInput from "./FormInput";
import ProgressIndicator from "./ProgressIndicator";

interface FormStepWrapperProps {
  step: Omit<FormStep, "validation">;
}

export default function FormStepWrapper({ step }: FormStepWrapperProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: getStoredStepData(step.id),
  });

  const watchedValues = watch();

  // Real-time validation
  // Remark: Causing infinite re-rendering bug
  // useEffect(() => {
  //   const currentData = getValues();
  //   const errors = getStepValidationErrors(step.id, currentData);
  //   setValidationErrors(errors);
  // }, [watchedValues, step.id, getValues]);

  // Save form data to session storage on change
  useEffect(() => {
    const currentData = getValues();
    saveStepData(step.id, currentData);
  }, [watchedValues, step.id, getValues]);

  const progress = calculateProgress(step.id);
  const currentStepNumber = getCompletedSteps(step.id);
  const totalSteps = getTotalSteps();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Validate the data using Zod schema
      const errors = getStepValidationErrors(step.id, data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Save the step data
      saveStepData(step.id, data);

      // Navigate to next step or completion
      if (isLastStep(step.id)) {
        // Redirect to processing page
        router.push("/processing");
      } else {
        const nextRoute = getNextStepRoute(step.id);
        if (nextRoute) {
          router.push(nextRoute);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setValidationErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (!isFirstStep(step.id)) {
      const previousRoute = getPreviousStepRoute(step.id);
      if (previousRoute) {
        router.push(previousRoute);
      }
    } else {
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
    >
      <ProgressIndicator
        currentStep={currentStepNumber}
        totalSteps={totalSteps}
        progress={progress}
        stepTitle={step.title}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-6"
      >
        <p className="text-gray-600 text-base sm:text-lg">{step.description}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <ErrorDisplay errors={validationErrors} />
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          {step.fields.map((field, index) => {
            const fieldError = errors[field.id]?.message as string;

            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
              >
                <FormInput
                  field={field}
                  value={watchedValues[field.id]}
                  onChange={(value) =>
                    setValue(field.id, value, { shouldValidate: true })
                  }
                  error={fieldError}
                  disabled={isSubmitting}
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-gray-200"
        >
          <motion.button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-6 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isFirstStep(step.id) ? "Home" : "Back"}
          </motion.button>

          <motion.button
            type="submit"
            disabled={isSubmitting || validationErrors.length > 0}
            whileHover={{
              scale: isSubmitting || validationErrors.length > 0 ? 1 : 1.02,
            }}
            whileTap={{
              scale: isSubmitting || validationErrors.length > 0 ? 1 : 0.98,
            }}
            className="w-full sm:w-auto px-6 py-3 sm:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isSubmitting && (
                <motion.svg
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
            {isLastStep(step.id) ? "Complete Assessment" : "Next"}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}

// Helper functions for session storage
function getStoredStepData(stepId: string): Record<string, any> {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(`form-step-${stepId}`);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveStepData(stepId: string, data: Record<string, any>): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(`form-step-${stepId}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save step data:", error);
  }
}
