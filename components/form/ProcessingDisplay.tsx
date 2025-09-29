"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProcessingDisplay() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Analyzing your profile...");

  const steps = [
    "Analyzing your profile...",
    "Matching with Policy Address content...",
    "Generating personalized recommendations...",
    "Finalizing your report...",
  ];

  useEffect(() => {
    // Progress simulation while AI is processing
    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
  }, []);

  return (
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
          <LoadingSpinner size="lg" className="mx-auto text-primary" />
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
  );
}