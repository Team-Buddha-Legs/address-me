import React from 'react';
import { cn } from '@/lib/utils';
import { IconProps } from './types';

export const BusIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#059669", 
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
    data-testid="bus-icon"
  >
    {/* Bus body */}
    <rect x="3" y="6" width="18" height="10" rx="2" fill={color} />
    {/* Windows */}
    <rect x="5" y="8" width="3" height="2" fill="white" opacity="0.9" />
    <rect x="9" y="8" width="3" height="2" fill="white" opacity="0.9" />
    <rect x="13" y="8" width="3" height="2" fill="white" opacity="0.9" />
    <rect x="17" y="8" width="2" height="2" fill="white" opacity="0.9" />
    {/* Wheels */}
    <circle cx="7" cy="18" r="2" fill="#374151" />
    <circle cx="17" cy="18" r="2" fill="#374151" />
    {/* Door */}
    <rect x="19" y="11" width="1" height="4" fill="#374151" />
  </svg>
);

export const MTRIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#059669", 
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
    data-testid="mtr-icon"
  >
    {/* Train body */}
    <rect x="2" y="7" width="20" height="8" rx="3" fill={color} />
    {/* Front nose */}
    <path d="M2 11 L2 13 L0 12 Z" fill={color} />
    {/* Windows */}
    <rect x="4" y="9" width="2.5" height="2" fill="white" opacity="0.9" />
    <rect x="7.5" y="9" width="2.5" height="2" fill="white" opacity="0.9" />
    <rect x="11" y="9" width="2.5" height="2" fill="white" opacity="0.9" />
    <rect x="14.5" y="9" width="2.5" height="2" fill="white" opacity="0.9" />
    <rect x="18" y="9" width="2.5" height="2" fill="white" opacity="0.9" />
    {/* Doors */}
    <rect x="6.5" y="12" width="1" height="3" fill="#374151" />
    <rect x="13.5" y="12" width="1" height="3" fill="#374151" />
    {/* Rails */}
    <rect x="0" y="16" width="24" height="1" fill="#6b7280" />
    <rect x="0" y="18" width="24" height="1" fill="#6b7280" />
  </svg>
);

export const MinibusIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#059669", 
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
    data-testid="minibus-icon"
  >
    {/* Minibus body */}
    <rect x="4" y="8" width="16" height="8" rx="2" fill={color} />
    {/* Front */}
    <rect x="4" y="6" width="16" height="2" rx="1" fill={color} />
    {/* Windows */}
    <rect x="6" y="9" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="9" y="9" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="13" y="9" width="2" height="2" fill="white" opacity="0.9" />
    <rect x="16" y="9" width="2" height="2" fill="white" opacity="0.9" />
    {/* Wheels */}
    <circle cx="8" cy="18" r="2" fill="#374151" />
    <circle cx="16" cy="18" r="2" fill="#374151" />
  </svg>
);

export const TaxiIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#eab308", 
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
    data-testid="taxi-icon"
  >
    {/* Car body */}
    <rect x="3" y="10" width="18" height="6" rx="1" fill={color} />
    {/* Car roof */}
    <rect x="6" y="7" width="12" height="3" rx="1" fill={color} />
    {/* Taxi sign */}
    <rect x="9" y="5" width="6" height="2" rx="1" fill="#dc2626" />
    <text x="12" y="6.5" textAnchor="middle" fontSize="3" fill="white">TAXI</text>
    {/* Windows */}
    <rect x="7" y="8" width="3" height="2" fill="white" opacity="0.9" />
    <rect x="14" y="8" width="3" height="2" fill="white" opacity="0.9" />
    {/* Wheels */}
    <circle cx="7" cy="18" r="2" fill="#374151" />
    <circle cx="17" cy="18" r="2" fill="#374151" />
  </svg>
);

export const CarIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#059669", 
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
    data-testid="car-icon"
  >
    {/* Car body */}
    <rect x="3" y="10" width="18" height="6" rx="1" fill={color} />
    {/* Car roof */}
    <rect x="6" y="7" width="12" height="3" rx="1" fill={color} />
    {/* Windows */}
    <rect x="7" y="8" width="3" height="2" fill="white" opacity="0.9" />
    <rect x="14" y="8" width="3" height="2" fill="white" opacity="0.9" />
    {/* Wheels */}
    <circle cx="7" cy="18" r="2" fill="#374151" />
    <circle cx="17" cy="18" r="2" fill="#374151" />
    {/* Headlights */}
    <circle cx="21" cy="12" r="1" fill="#fbbf24" />
  </svg>
);

export const BikeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#059669", 
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
    data-testid="bike-icon"
  >
    {/* Wheels */}
    <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="18" cy="18" r="3" stroke={color} strokeWidth="2" fill="none" />
    {/* Frame */}
    <path d="M6 18 L12 8 L18 18" stroke={color} strokeWidth="2" fill="none" />
    <path d="M9 15 L15 15" stroke={color} strokeWidth="2" />
    {/* Handlebars */}
    <path d="M10 8 L14 8" stroke={color} strokeWidth="2" />
    {/* Seat */}
    <rect x="11" y="6" width="2" height="1" fill={color} />
  </svg>
);

export const WalkingIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "#059669", 
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
    data-testid="walking-icon"
  >
    {/* Head */}
    <circle cx="12" cy="4" r="2" fill={color} />
    {/* Body */}
    <path d="M12 6 L12 14" stroke={color} strokeWidth="2" />
    {/* Arms */}
    <path d="M12 9 L9 11" stroke={color} strokeWidth="2" />
    <path d="M12 9 L15 7" stroke={color} strokeWidth="2" />
    {/* Legs - walking position */}
    <path d="M12 14 L10 20" stroke={color} strokeWidth="2" />
    <path d="M12 14 L14 18" stroke={color} strokeWidth="2" />
    {/* Feet */}
    <circle cx="10" cy="20" r="1" fill={color} />
    <circle cx="14" cy="18" r="1" fill={color} />
  </svg>
);