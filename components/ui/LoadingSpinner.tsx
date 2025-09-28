"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-neutral-300 border-t-primary ${getSizeClasses(size)}`}
      />
    </div>
  );
}
