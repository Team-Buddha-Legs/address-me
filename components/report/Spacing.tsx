"use client";

import type { ReactNode } from "react";

interface SpacingProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  direction?: "vertical" | "horizontal" | "all";
  className?: string;
}

export function Spacing({
  children,
  size = "md",
  direction = "vertical",
  className = "",
}: SpacingProps) {
  const getSpacingClasses = (size: string, direction: string) => {
    const spacingMap = {
      xs: { vertical: "space-y-1", horizontal: "space-x-1", all: "gap-1" },
      sm: { vertical: "space-y-2", horizontal: "space-x-2", all: "gap-2" },
      md: { vertical: "space-y-4", horizontal: "space-x-4", all: "gap-4" },
      lg: { vertical: "space-y-6", horizontal: "space-x-6", all: "gap-6" },
      xl: { vertical: "space-y-8", horizontal: "space-x-8", all: "gap-8" },
      "2xl": {
        vertical: "space-y-12",
        horizontal: "space-x-12",
        all: "gap-12",
      },
    };

    return spacingMap[size as keyof typeof spacingMap][
      direction as keyof typeof spacingMap.md
    ];
  };

  const containerClass = direction === "all" ? "flex flex-col" : "div";

  return (
    <div className={`${getSpacingClasses(size, direction)} ${className}`}>
      {children}
    </div>
  );
}

// Specialized spacing components
export function VerticalStack({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  return (
    <Spacing size={size} direction="vertical" className={className}>
      {children}
    </Spacing>
  );
}

export function HorizontalStack({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  return (
    <div
      className={`flex items-center ${size === "xs" ? "space-x-1" : size === "sm" ? "space-x-2" : size === "md" ? "space-x-4" : size === "lg" ? "space-x-6" : size === "xl" ? "space-x-8" : "space-x-12"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`mb-8 ${className}`}>{children}</section>;
}

export function Card({
  children,
  className = "",
  padding = "md",
}: {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}) {
  const getPaddingClasses = (padding: string) => {
    switch (padding) {
      case "sm":
        return "p-4";
      case "lg":
        return "p-8";
      default:
        return "p-6";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${getPaddingClasses(padding)} ${className}`}
    >
      {children}
    </div>
  );
}
