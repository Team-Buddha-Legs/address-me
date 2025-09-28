"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { Recommendation } from "@/types";
import { ActionableAdvice } from "./ActionableAdvice";

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function RecommendationsSection({
  recommendations,
  isExpanded,
  onToggle,
}: RecommendationsSectionProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-accent-100 text-accent-dark border-accent-200";
      case "medium":
        return "bg-primary-100 text-primary-dark border-primary-200";
      case "low":
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      housing: "🏠",
      transportation: "🚇",
      healthcare: "🏥",
      education: "🎓",
      employment: "💼",
      "social-welfare": "🤝",
    };
    return icons[category] || "📋";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔥";
      case "medium":
        return "⚡";
      case "low":
        return "💡";
      default:
        return "📌";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Personalized Recommendations
          </h2>
          <span className="bg-accent-100 text-accent-dark px-2 py-1 rounded-full text-sm font-medium">
            {recommendations.length} actions
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-neutral-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-neutral-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <ActionableAdvice
                key={recommendation.id}
                title={recommendation.title}
                description={recommendation.description}
                actionSteps={recommendation.actionSteps}
                priority={recommendation.priority}
                category={recommendation.category}
                timeframe="2-4 weeks" // This could be added to the Recommendation type
                difficulty="moderate" // This could be added to the Recommendation type
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
