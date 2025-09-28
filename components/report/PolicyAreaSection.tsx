"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { PolicyArea } from "@/types";
import { ExpandableDetails } from "./ExpandableDetails";
import { PolicyRelevanceScore } from "./PolicyRelevanceScore";

interface PolicyAreaSectionProps {
  areas: PolicyArea[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function PolicyAreaSection({
  areas,
  isExpanded,
  onToggle,
}: PolicyAreaSectionProps) {
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-secondary-dark";
    if (score >= 80) return "text-secondary";
    if (score >= 70) return "text-accent";
    return "text-neutral-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Relevant Policy Areas
          </h2>
          <span className="bg-primary-100 text-primary-dark px-2 py-1 rounded-full text-sm font-medium">
            {areas.length} areas
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
          <div className="space-y-6">
            {areas.map((area, index) => (
              <div
                key={`${area.category}-${index}`}
                className="border-l-4 border-primary-200 pl-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getCategoryIcon(area.category)}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {area.title}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <PolicyRelevanceScore
                          score={area.relevanceScore}
                          size="sm"
                        />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(area.impact)}`}
                        >
                          {area.impact} impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">
                      Summary
                    </h4>
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {area.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">
                      Details
                    </h4>
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {area.details}
                    </p>
                  </div>

                  {area.actionItems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {area.actionItems.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-primary text-sm mt-1">•</span>
                            <span className="text-neutral-700 text-sm leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
