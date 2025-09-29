"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  stepTitle: string;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  progress,
  stepTitle,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Step counter */}
      <div className="flex items-center justify-between mb-3">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs sm:text-sm font-medium text-gray-600"
        >
          Step {currentStep} of {totalSteps}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs sm:text-sm font-medium text-primary-600"
        >
          {progress}% Complete
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-4 sm:mb-6 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Current step title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 leading-tight"
      >
        {stepTitle}
      </motion.h2>
    </div>
  );
}
