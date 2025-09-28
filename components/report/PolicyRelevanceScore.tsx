"use client";

interface PolicyRelevanceScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function PolicyRelevanceScore({ 
  score, 
  size = "md", 
  showLabel = true 
}: PolicyRelevanceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-secondary-dark";
    if (score >= 80) return "text-secondary";
    if (score >= 70) return "text-accent";
    return "text-neutral-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-secondary-50 border-secondary-200";
    if (score >= 80) return "bg-secondary-50 border-secondary-200";
    if (score >= 70) return "bg-accent-50 border-accent-200";
    return "bg-neutral-50 border-neutral-200";
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm": return "text-sm px-2 py-1";
      case "lg": return "text-xl px-4 py-2";
      default: return "text-base px-3 py-1.5";
    }
  };

  return (
    <div className={`inline-flex items-center rounded-full border ${getScoreBackground(score)} ${getSizeClasses(size)}`}>
      <div className={`font-bold ${getScoreColor(score)}`}>
        {score}%
      </div>
      {showLabel && (
        <span className="ml-1 text-neutral-600 text-sm">
          relevant
        </span>
      )}
    </div>
  );
}