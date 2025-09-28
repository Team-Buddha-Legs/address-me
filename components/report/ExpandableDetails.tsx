"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ExpandableDetailsProps {
  title: string;
  summary: string;
  details: string;
  icon?: string;
  defaultExpanded?: boolean;
  variant?: "default" | "highlight" | "subtle";
}

export function ExpandableDetails({
  title,
  summary,
  details,
  icon,
  defaultExpanded = false,
  variant = "default",
}: ExpandableDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "highlight":
        return "bg-primary-50 border-primary-200 hover:bg-primary-100";
      case "subtle":
        return "bg-neutral-50 border-neutral-200 hover:bg-neutral-100";
      default:
        return "bg-white border-neutral-200 hover:bg-neutral-50";
    }
  };

  return (
    <div
      className={`rounded-lg border transition-colors duration-200 ${getVariantClasses(variant)}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-3 flex-1">
          {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-neutral-900 mb-1 leading-tight">
              {title}
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
              {summary}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-3">
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-neutral-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-neutral-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-neutral-200 bg-white bg-opacity-50">
          <div className="pt-3">
            <div className="prose prose-sm max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {details}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
