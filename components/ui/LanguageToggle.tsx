"use client";

import { useState } from "react";

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const [currentLang, setCurrentLang] = useState<"EN" | "繁">("EN");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative inline-flex items-center bg-gray-100 rounded-full p-1 cursor-not-allowed opacity-60"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Language toggle (coming soon)"
      >
        {/* Toggle background */}
        <div className="flex items-center">
          {/* EN option */}
          <div
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              currentLang === "EN"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            EN
          </div>
          
          {/* 繁 option */}
          <div
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              currentLang === "繁"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            繁
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-2 right-0 z-50">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Coming soon
            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}