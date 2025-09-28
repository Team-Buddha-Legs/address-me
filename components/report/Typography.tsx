"use client";

import { JSX, ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "label";
  className?: string;
  color?: "primary" | "secondary" | "neutral" | "accent" | "muted";
}

export function Typography({ 
  children, 
  variant = "body", 
  className = "", 
  color = "neutral" 
}: TypographyProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "h1": return "text-2xl sm:text-3xl font-bold leading-tight";
      case "h2": return "text-xl sm:text-2xl font-semibold leading-tight";
      case "h3": return "text-lg sm:text-xl font-semibold leading-tight";
      case "h4": return "text-base sm:text-lg font-medium leading-tight";
      case "body": return "text-sm sm:text-base leading-relaxed";
      case "caption": return "text-xs sm:text-sm leading-relaxed";
      case "label": return "text-sm font-medium leading-normal";
      default: return "text-sm sm:text-base leading-relaxed";
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary": return "text-primary-dark";
      case "secondary": return "text-secondary-dark";
      case "accent": return "text-accent-dark";
      case "muted": return "text-neutral-600";
      default: return "text-neutral-900";
    }
  };

  const Component = variant.startsWith("h") ? variant as keyof JSX.IntrinsicElements : "p";

  return (
    <Component className={`${getVariantClasses(variant)} ${getColorClasses(color)} ${className}`}>
      {children}
    </Component>
  );
}

// Specialized typography components for common use cases
export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Typography variant="h2" className={`mb-4 ${className}`}>
      {children}
    </Typography>
  );
}

export function SubsectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Typography variant="h3" className={`mb-3 ${className}`}>
      {children}
    </Typography>
  );
}

export function BodyText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Typography variant="body" className={`mb-3 ${className}`}>
      {children}
    </Typography>
  );
}

export function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Typography variant="caption" color="muted" className={className}>
      {children}
    </Typography>
  );
}