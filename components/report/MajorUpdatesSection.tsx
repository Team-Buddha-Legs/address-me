"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { CityPlan } from "@/types";
import { ExpandableDetails } from "./ExpandableDetails";

interface MajorUpdatesSectionProps {
  updates: CityPlan[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function MajorUpdatesSection({
  updates,
  isExpanded,
  onToggle,
}: MajorUpdatesSectionProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Major City Updates
          </h2>
          <span className="bg-secondary-100 text-secondary-dark px-2 py-1 rounded-full text-sm font-medium">
            {updates.length} updates
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
            {updates.map((update) => (
              <div key={update.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral-600 font-medium">
                      Timeline: {update.timeline}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(update.impact)}`}
                    >
                      {update.impact} impact
                    </span>
                  </div>
                </div>
                <ExpandableDetails
                  title={update.title}
                  summary={update.description}
                  details={`${update.description}\n\nRelevance to You:\n${update.relevanceToUser}`}
                  icon="🏗️"
                  variant="highlight"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
