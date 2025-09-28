"use client";

interface ErrorDisplayProps {
  errors: string[];
  className?: string;
}

export default function ErrorDisplay({
  errors,
  className = "",
}: ErrorDisplayProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {errors.length === 1 ? "There was an error:" : "There were errors:"}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {errors.length === 1 ? (
              <p>{errors[0]}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={`error-${index}-${error.slice(0, 10)}`}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
