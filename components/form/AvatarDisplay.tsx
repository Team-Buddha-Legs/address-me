"use client";

import Image from "next/image";
import { useMemo } from "react";

interface AvatarDisplayProps {
  formData: Record<string, Record<string, unknown>>;
}

export default function AvatarDisplay({ formData }: AvatarDisplayProps) {
  const avatarImage = useMemo(() => {
    // Get values from form data
    const personalInfo = formData["personal-info"] || {};
    const familyInfo = formData["family"] || {};
    console.log('familyInfo: ', familyInfo);
    
    const gender = personalInfo.gender as string;
    const maritalStatus = personalInfo.maritalStatus as string;
    const hasChildren = familyInfo.hasChildren;

    // Determine avatar based on selections (priority: children > married > male)
    if (hasChildren) {
      return {
        src: "/images/family.jpeg",
        alt: "Family avatar",
        title: "Family"
      };
    }
    
    if (maritalStatus === "married") {
      return {
        src: "/images/married.png",
        alt: "Married couple avatar",
        title: "Married"
      };
    }
    
    if (gender === "male") {
      return {
        src: "/images/single-man.png",
        alt: "Single man avatar",
        title: "Single Male"
      };
    }

    // Default fallback - no avatar shown
    return null;
  }, [formData]);

  if (!avatarImage) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-32 h-40 sm:w-40 sm:h-48 lg:w-48 lg:h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Default avatar placeholder"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Complete the form to see your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-40 sm:w-40 sm:h-48 lg:w-48 lg:h-70 rounded-lg overflow-hidden bg-white transition-all duration-300">
        <Image
          src={avatarImage.src}
          alt={avatarImage.alt}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>
      <p className="text-sm font-medium text-gray-600 text-center transition-all duration-300">
        {avatarImage.title}
      </p>
    </div>
  );
}