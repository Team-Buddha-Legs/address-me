"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  href?: string;
  priority?: boolean;
  shadow?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

export default function Logo({
  size = "md",
  showText = true,
  className,
  href = "/",
  priority = false,
  shadow = false,
}: LogoProps) {
  const logoContent = (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-2xl bg-white py-2 px-4 gap-1",
        shadow && 'shadow-md',
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="Address Me Logo"
        width={
          size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 48 : 64
        }
        height={
          size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 48 : 64
        }
        className={cn("object-contain", sizeClasses[size], "rounded-md")}
        priority={priority}
      />
      {showText && (
        <span className={cn("font-bold text-gray-900", textSizeClasses[size])}>
          Address Me
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
