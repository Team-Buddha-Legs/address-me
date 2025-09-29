"use client";

interface OverallScoreDisplayProps {
  score: number;
}

export function OverallScoreDisplay({ score }: OverallScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary-dark";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-accent";
    return "text-neutral-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-white border-primary-200";
    if (score >= 80) return "bg-white border-primary-200";
    if (score >= 70) return "bg-white border-accent-200";
    return "bg-neutral-50 border-neutral-200";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90)
      return "Excellent match - many policies are highly relevant to you";
    if (score >= 80)
      return "Good match - several policies will benefit you significantly";
    if (score >= 70)
      return "Moderate match - some policies are relevant to your situation";
    return "Limited match - few policies directly apply to your profile";
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${getScoreBackground(score)}`}>
      <div className="text-center">
        <div className="mb-4">
          <div
            className={`text-5xl sm:text-6xl font-bold ${getScoreColor(score)}`}
          >
            {score}
          </div>
          <div className="text-lg sm:text-xl font-medium text-neutral-700 mt-1">
            Overall Relevance Score
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            {getScoreDescription(score)}
          </p>
        </div>

        {/* Score breakdown visual */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-xs text-neutral-500 mb-2">
            <span>70</span>
            <span>80</span>
            <span>90</span>
            <span>100</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3 relative">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                score >= 90
                  ? "bg-primary"
                  : score >= 80
                    ? "bg-primary-light"
                    : score >= 70
                      ? "bg-accent"
                      : "bg-neutral-400"
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, (score - 70) * (100 / 30)))}%`,
              }}
            />
            {/* Score markers */}
            <div className="absolute top-0 left-0 w-full h-3 flex justify-between">
              <div className="w-0.5 h-3 bg-neutral-400" />
              <div className="w-0.5 h-3 bg-neutral-400" />
              <div className="w-0.5 h-3 bg-neutral-400" />
              <div className="w-0.5 h-3 bg-neutral-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
