"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  calculateProgress,
  getCompletedSteps,
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
  onStepComplete: (stepId: string, data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
  onDataChange?: (stepId: string, data: Record<string, unknown>) => void;
}

export default function FormStepWrapper({
  step,
  onStepComplete,
  onBack,
  initialData = {},
  onDataChange,
}: FormStepWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const previousDataRef = useRef<string>("");

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: initialData,
  });

  const watchedValues = watch();

  // Update parent component and session storage when form values change
  useEffect(() => {
    if (Object.keys(watchedValues).length > 0) {
      const processedData = processStepData(step.id, watchedValues);
      const dataString = JSON.stringify(processedData);

      // Only update if data has actually changed
      if (dataString !== previousDataRef.current) {
        previousDataRef.current = dataString;

        // Call parent callback to update avatar in real-time
        if (onDataChange) {
          onDataChange(step.id, processedData);
        }

        // Also update session storage
        if (typeof window !== "undefined") {
          const currentFormData = JSON.parse(
            sessionStorage.getItem("address-me-form-data") || "{}"
          );
          const updatedFormData = {
            ...currentFormData,
            [step.id]: processedData,
          };
          sessionStorage.setItem(
            "address-me-form-data",
            JSON.stringify(updatedFormData)
          );
        }

        // Clear validation errors if the current data is now valid
        if (validationErrors.length > 0) {
          const currentErrors = getStepValidationErrors(step.id, processedData);
          if (currentErrors.length === 0) {
            setValidationErrors([]);
          }
        }
      }
    }
  }, [watchedValues, step.id, onDataChange, validationErrors.length]);

  const progress = calculateProgress(step.id);
  const currentStepNumber = getCompletedSteps(step.id);
  const totalSteps = getTotalSteps();

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Validate the data using Zod schema
      const errors = getStepValidationErrors(step.id, data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Process step data based on step type
      const processedData = processStepData(step.id, data);

      // Save to session storage for avatar updates
      if (typeof window !== "undefined") {
        const currentFormData = JSON.parse(
          sessionStorage.getItem("address-me-form-data") || "{}"
        );
        const updatedFormData = {
          ...currentFormData,
          [step.id]: processedData,
        };
        sessionStorage.setItem(
          "address-me-form-data",
          JSON.stringify(updatedFormData)
        );

        // Dispatch custom event to notify avatar of updates
        window.dispatchEvent(new CustomEvent("formDataUpdated"));
      }

      // Call parent handler to manage the data
      onStepComplete(step.id, processedData);
    } catch (error) {
      console.error("Form submission error:", error);
      setValidationErrors([
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    onBack();
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
          className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-gray-200"
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
            className="w-full sm:w-auto px-6 py-3 sm:py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                  role="img"
                  aria-label="Loading"
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

/**
 * Process step data based on step type
 */
function processStepData(
  stepId: string,
  rawData: Record<string, unknown>
): Record<string, unknown> {
  const processed = { ...rawData };

  switch (stepId) {
    case "personal-info":
      if (processed.age) {
        processed.age = Number(processed.age);
      }
      break;

    case "family":
      if (processed.hasChildren !== undefined) {
        // Handle both string and boolean values
        if (typeof processed.hasChildren === "string") {
          processed.hasChildren = processed.hasChildren === "true";
        } else if (typeof processed.hasChildren === "boolean") {
          // Already a boolean, keep as is
          processed.hasChildren = processed.hasChildren;
        }
      }
      // Handle childrenAges conversion from string to array
      if (processed.childrenAges !== undefined) {
        if (typeof processed.childrenAges === "string") {
          // Handle empty string or whitespace-only string
          if (processed.childrenAges.trim() === "") {
            processed.childrenAges = [];
          } else {
            // Split by comma and convert to numbers, filtering out invalid values
            processed.childrenAges = processed.childrenAges
              .split(",")
              .map((age) => Number(age.trim()))
              .filter((age) => !Number.isNaN(age) && age >= 0 && age <= 25);
          }
        } else if (!Array.isArray(processed.childrenAges)) {
          // If it's not a string or array, convert to empty array
          processed.childrenAges = [];
        }
      }
      break;

    case "education-transport":
      if (
        processed.transportationMode &&
        typeof processed.transportationMode === "string"
      ) {
        processed.transportationMode = processed.transportationMode.split(",");
      }
      break;

    case "health":
      if (
        processed.healthConditions &&
        typeof processed.healthConditions === "string"
      ) {
        processed.healthConditions = processed.healthConditions
          .split(",")
          .map((condition) => condition.trim())
          .filter((condition) => condition.length > 0);
      }
      break;
  }

  return processed;
}
