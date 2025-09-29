import React from 'react';
import { cn } from '@/lib/utils';
import { PersonIconProps } from './types';

export const MaleIcon: React.FC<PersonIconProps> = ({ 
  size = 48, 
  color = "#1e40af", 
  className, 
  animate = false,
  variant = 'default'
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
    data-testid="male-icon"
  >
    {/* Head */}
    <circle 
      cx="12" 
      cy="7" 
      r="3" 
      fill={variant === 'outline' ? 'none' : color}
      stroke={variant === 'outline' ? color : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
    />
    {/* Body */}
    <path 
      d="M12 14c-4 0-6 2-6 4v3h12v-3c0-2-2-4-6-4z" 
      fill={variant === 'outline' ? 'none' : color}
      stroke={variant === 'outline' ? color : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
    />
    {/* Male symbol indicator - small tie or collar */}
    <rect 
      x="11" 
      y="10" 
      width="2" 
      height="4" 
      fill={color} 
      opacity="0.7"
    />
  </svg>
);

export const FemaleIcon: React.FC<PersonIconProps> = ({ 
  size = 48, 
  color = "#1e40af", 
  className, 
  animate = false,
  variant = 'default'
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
    data-testid="female-icon"
  >
    {/* Head */}
    <circle 
      cx="12" 
      cy="7" 
      r="3" 
      fill={variant === 'outline' ? 'none' : color}
      stroke={variant === 'outline' ? color : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
    />
    {/* Body - slightly different shape */}
    <path 
      d="M12 14c-4 0-6 2-6 4v3h12v-3c0-2-2-4-6-4z" 
      fill={variant === 'outline' ? 'none' : color}
      stroke={variant === 'outline' ? color : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
    />
    {/* Female indicator - hair or dress detail */}
    <path 
      d="M9 6c0-1.5 1.5-3 3-3s3 1.5 3 3" 
      stroke={color} 
      strokeWidth="1" 
      fill="none"
      opacity="0.7"
    />
  </svg>
);

export const NeutralIcon: React.FC<PersonIconProps> = ({ 
  size = 48, 
  color = "#1e40af", 
  className, 
  animate = false,
  variant = 'default'
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
    data-testid="neutral-icon"
  >
    {/* Head */}
    <circle 
      cx="12" 
      cy="7" 
      r="3" 
      fill={variant === 'outline' ? 'none' : color}
      stroke={variant === 'outline' ? color : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
    />
    {/* Body - neutral representation */}
    <path 
      d="M12 14c-4 0-6 2-6 4v3h12v-3c0-2-2-4-6-4z" 
      fill={variant === 'outline' ? 'none' : color}
      stroke={variant === 'outline' ? color : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
    />
  </svg>
);