'use client';

import { useMemo } from 'react';
import type { AvatarState, AvatarConfig } from '@/types';
import { LocationIcon, BuildingIcon } from './icons/LifestyleIcons';
import { AnimatedElement } from './AnimatedElement';

interface LocationIndicatorProps {
  state: AvatarState;
  config: AvatarConfig;
  shouldAnimate?: boolean;
}

/**
 * Component for district representation
 */
export const LocationIndicator: React.FC<LocationIndicatorProps> = ({
  state,
  config,
  shouldAnimate = false,
}) => {
  // District display name mapping
  const districtName = useMemo(() => {
    const districtNames = {
      'central-western': 'Central & Western',
      'wan-chai': 'Wan Chai',
      'eastern': 'Eastern',
      'southern': 'Southern',
      'yau-tsim-mong': 'Yau Tsim Mong',
      'sham-shui-po': 'Sham Shui Po',
      'kowloon-city': 'Kowloon City',
      'wong-tai-sin': 'Wong Tai Sin',
      'kwun-tong': 'Kwun Tong',
      'tsuen-wan': 'Tsuen Wan',
      'tuen-mun': 'Tuen Mun',
      'yuen-long': 'Yuen Long',
      'north': 'North',
      'tai-po': 'Tai Po',
      'sha-tin': 'Sha Tin',
      'sai-kung': 'Sai Kung',
      'islands': 'Islands',
    };

    return state.district ? districtNames[state.district] || state.district : null;
  }, [state.district]);

  // Select icon based on district (use building for urban areas, location for others)
  const IconComponent = useMemo(() => {
    const urbanDistricts = [
      'central-western',
      'wan-chai',
      'yau-tsim-mong',
      'sham-shui-po',
      'kowloon-city',
    ];

    if (state.district && urbanDistricts.includes(state.district)) {
      return BuildingIcon;
    }
    return LocationIcon;
  }, [state.district]);

  // Don't render if no district is selected
  if (!state.district || !districtName) {
    return null;
  }

  const iconSize = config.layout.iconSizes.location;

  return (
    <AnimatedElement
      animationType="fadeIn"
      duration={config.animations.duration}
      delay={50}
      trigger={shouldAnimate}
    >
      <div 
        className="flex items-center space-x-1 bg-white/80 rounded-full px-2 py-1 shadow-sm"
        data-testid="location-indicator"
      >
        <IconComponent
          size={iconSize}
          color="#7c3aed" // Purple color for location
          animate={shouldAnimate}
          className="flex-shrink-0"
        />
        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
          {districtName}
        </span>
      </div>
    </AnimatedElement>
  );
};