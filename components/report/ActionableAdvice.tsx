"use client";

import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ActionableAdviceProps {
  title: string;
  description: string;
  actionSteps: string[];
  priority: "high" | "medium" | "low";
  category: string;
  timeframe?: string;
  difficulty?: "easy" | "moderate" | "complex";
}

export function ActionableAdvice({
  title,
  description,
  actionSteps,
  priority,
  category,
  timeframe,
  difficulty = "moderate",
}: ActionableAdviceProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <ExclamationTriangleIcon className="h-5 w-5 text-accent" />;
      case "medium":
        return <ClockIcon className="h-5 w-5 text-primary" />;
      case "low":
        return <CheckCircleIcon className="h-5 w-5 text-secondary" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-neutral-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-accent-50 border-accent-200 text-accent-dark";
      case "medium":
        return "bg-primary-50 border-primary-200 text-primary-dark";
      case "low":
        return "bg-secondary-50 border-secondary-200 text-secondary-dark";
      default:
        return "bg-neutral-50 border-neutral-200 text-neutral-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-secondary-100 text-secondary-dark";
      case "complex":
        return "bg-accent-100 text-accent-dark";
      default:
        return "bg-primary-100 text-primary-dark";
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getPriorityColor(priority)}`}>
      <div className="flex items-start space-x-3 mb-3">
        {getPriorityIcon(priority)}
        <div className="flex-1">
          <h4 className="font-semibold text-lg leading-tight mb-1">{title}</h4>
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}
            >
              {priority} priority
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}
            >
              {difficulty}
            </span>
            <span className="text-xs text-neutral-600 capitalize">
              {category.replace("-", " ")}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm leading-relaxed text-neutral-700">
          {description}
        </p>
      </div>

      {timeframe && (
        <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-md">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700">
              Timeframe: {timeframe}
            </span>
          </div>
        </div>
      )}

      <div>
        <h5 className="font-medium text-neutral-900 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Action Steps
        </h5>
        <div className="space-y-3">
          {actionSteps.map((step, index) => (
            <div
              key={`step-${index}-${step.slice(0, 10)}`}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-neutral-700">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
