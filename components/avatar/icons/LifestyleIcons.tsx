import React from 'react';
import { cn } from '@/lib/utils';
import { IconProps } from './types';

export const GraduationCapIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#ea580c", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-bounce",
      className
    )}
    data-testid="graduation-cap-icon"
  >
    {/* Cap base */}
    <path 
      d="M2 10 L12 6 L22 10 L12 14 L2 10 Z" 
      fill={color}
    />
    {/* Cap top */}
    <path 
      d="M12 6 L12 14 L8 12 L8 8 L12 6 Z" 
      fill={color}
      opacity="0.8"
    />
    {/* Tassel */}
    <circle cx="20" cy="8" r="1" fill="#fbbf24" />
    <path d="M20 9 L20 12" stroke="#fbbf24" strokeWidth="1" />
    <circle cx="20" cy="12" r="0.5" fill="#fbbf24" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#ea580c", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-pulse",
      className
    )}
    data-testid="book-icon"
  >
    {/* Book cover */}
    <rect x="4" y="3" width="16" height="18" rx="1" fill={color} />
    {/* Pages */}
    <rect x="5" y="4" width="14" height="16" fill="white" opacity="0.9" />
    {/* Binding */}
    <rect x="4" y="3" width="2" height="18" fill={color} opacity="0.8" />
    {/* Lines on pages */}
    <path d="M7 7 L17 7" stroke={color} strokeWidth="0.5" opacity="0.5" />
    <path d="M7 9 L17 9" stroke={color} strokeWidth="0.5" opacity="0.5" />
    <path d="M7 11 L17 11" stroke={color} strokeWidth="0.5" opacity="0.5" />
  </svg>
);

export const DiplomaIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#ea580c", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-pulse",
      className
    )}
    data-testid="diploma-icon"
  >
    {/* Diploma scroll */}
    <rect x="3" y="6" width="18" height="12" rx="1" fill={color} />
    {/* Ribbon */}
    <rect x="10" y="18" width="4" height="4" fill="#dc2626" />
    <path d="M12 18 L10 22 L14 22 Z" fill="#dc2626" />
    {/* Text lines */}
    <path d="M6 9 L18 9" stroke="white" strokeWidth="1" opacity="0.8" />
    <path d="M6 12 L18 12" stroke="white" strokeWidth="1" opacity="0.8" />
    <path d="M6 15 L18 15" stroke="white" strokeWidth="1" opacity="0.8" />
  </svg>
);

export const MedicalIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#dc2626", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-pulse",
      className
    )}
    data-testid="medical-icon"
  >
    {/* Medical cross background */}
    <circle cx="12" cy="12" r="10" fill="white" stroke={color} strokeWidth="2" />
    {/* Cross vertical */}
    <rect x="10" y="6" width="4" height="12" fill={color} />
    {/* Cross horizontal */}
    <rect x="6" y="10" width="12" height="4" fill={color} />
  </svg>
);

export const AccessibilityIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#dc2626", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-pulse",
      className
    )}
    data-testid="accessibility-icon"
  >
    {/* Wheelchair symbol */}
    <circle cx="12" cy="12" r="10" fill="white" stroke={color} strokeWidth="2" />
    {/* Person head */}
    <circle cx="10" cy="8" r="1.5" fill={color} />
    {/* Person body */}
    <path d="M10 10 L10 14 L12 14" stroke={color} strokeWidth="2" fill="none" />
    {/* Wheelchair wheel */}
    <circle cx="14" cy="16" r="3" stroke={color} strokeWidth="2" fill="none" />
    {/* Wheelchair frame */}
    <path d="M10 14 L14 16" stroke={color} strokeWidth="2" />
  </svg>
);

export const LocationIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#7c3aed", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-pulse",
      className
    )}
    data-testid="location-icon"
  >
    {/* Location pin */}
    <path 
      d="M12 2 C8.5 2 6 4.5 6 8 C6 12 12 22 12 22 S18 12 18 8 C18 4.5 15.5 2 12 2 Z" 
      fill={color}
    />
    {/* Pin center */}
    <circle cx="12" cy="8" r="3" fill="white" />
    <circle cx="12" cy="8" r="1.5" fill={color} />
  </svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = "#7c3aed", 
  className, 
  animate = false 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "transition-all duration-300",
      animate && "animate-pulse",
      className
    )}
    data-testid="building-icon"
  >
    {/* Building base */}
    <rect x="4" y="8" width="16" height="14" fill={color} />
    {/* Building top */}
    <rect x="6" y="4" width="12" height="4" fill={color} opacity="0.8" />
    {/* Windows */}
    <rect x="6" y="10" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="10" y="10" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="14" y="10" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="6" y="14" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="10" y="14" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="14" y="14" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="6" y="18" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="10" y="18" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="14" y="18" width="2" height="2" fill="white" opacity="0.9" />
    {/* Door */}
    <rect x="17" y="18" width="2" height="4" fill="#374151" />
  </svg>
);