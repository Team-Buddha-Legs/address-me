import React from 'react';
import { cn } from '@/lib/utils';
import { FamilyIconProps } from './types';

export const ChildIcon: React.FC<FamilyIconProps> = ({ 
  size = 32, 
  color = "#059669", 
  className, 
  animate = false,
  age = 'child'
}) => {
  const childSize = age === 'child' ? size * 0.8 : size;
  
  return (
    <svg 
      width={childSize} 
      height={childSize} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-all duration-300",
        animate && "animate-bounce",
        className
      )}
      data-testid="child-icon"
    >
      {/* Head - proportionally larger for child */}
      <circle 
        cx="12" 
        cy="8" 
        r="3.5" 
        fill={color}
      />
      {/* Body - smaller and shorter */}
      <path 
        d="M12 15c-3 0-4.5 1.5-4.5 3v2h9v-2c0-1.5-1.5-3-4.5-3z" 
        fill={color}
      />
      {/* Child-like features - rosy cheeks */}
      <circle cx="9.5" cy="8" r="0.5" fill="#ff6b9d" opacity="0.6" />
      <circle cx="14.5" cy="8" r="0.5" fill="#ff6b9d" opacity="0.6" />
    </svg>
  );
};

export const SpouseIcon: React.FC<FamilyIconProps> = ({ 
  size = 40, 
  color = "#7c3aed", 
  className, 
  animate = false,
  relationship = 'spouse'
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
    data-testid="spouse-icon"
  >
    {/* Head */}
    <circle 
      cx="12" 
      cy="7" 
      r="2.8" 
      fill={color}
    />
    {/* Body */}
    <path 
      d="M12 13.5c-3.5 0-5.5 1.8-5.5 3.5v2.5h11v-2.5c0-1.7-2-3.5-5.5-3.5z" 
      fill={color}
    />
    {/* Heart symbol to indicate relationship */}
    <path 
      d="M12 4.5c0-1 1-2 2-1.5s2 1.5 1 2.5l-3 3-3-3c-1-1 0-2 1-2.5s2 0.5 2 1.5z" 
      fill="#ff6b9d" 
      opacity="0.8"
      transform="scale(0.3) translate(20, -5)"
    />
  </svg>
);