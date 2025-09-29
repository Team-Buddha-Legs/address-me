'use client';

import { useMemo } from 'react';
import type { AvatarState, AvatarConfig } from '@/types';
import { AVATAR_POSITIONS } from '@/lib/avatar/config';
import { MainPersonIcon } from './MainPersonIcon';
import { FamilyMembers } from './FamilyMembers';
import { IndicatorGroup } from './IndicatorGroup';
import { LocationIndicator } from './LocationIndicator';

interface AvatarContainerProps {
  state: AvatarState;
  config: AvatarConfig;
  currentStep: string;
}

/**
 * Container component that manages the layout and positioning of all avatar elements
 * with a gradient background using the app's color scheme
 */
export const AvatarContainer: React.FC<AvatarContainerProps> = ({
  state,
  config,
  currentStep,
}) => {
  // Determine which elements should be visible
  const visibleElements = useMemo(() => {
    const elements: string[] = [];
    
    if (state.gender) elements.push('main-person');
    if (state.maritalStatus === 'married') elements.push('spouse');
    if (state.hasChildren) elements.push('children');
    if (state.district) elements.push('location');
    if (state.transportationModes.length > 0) elements.push('transportation');
    if (state.educationLevel) elements.push('education');
    if (state.healthConditions.length > 0) elements.push('health');
    
    return elements;
  }, [state]);

  // Container dimensions from config
  const { width, height } = config.layout.containerSize;

  return (
    <div 
      className="relative overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        minWidth: '280px', // Responsive minimum
        minHeight: '200px'
      }}
      data-testid="avatar-container"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-green-500 to-orange-400" />
      </div>

      {/* Main Person Icon */}
      {visibleElements.includes('main-person') && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            left: `${AVATAR_POSITIONS['main-person'].x}%`,
            top: `${AVATAR_POSITIONS['main-person'].y}%`,
          }}
        >
          <MainPersonIcon 
            state={state} 
            config={config}
            shouldAnimate={state.isAnimating}
          />
        </div>
      )}

      {/* Family Members (Spouse and Children) */}
      {(visibleElements.includes('spouse') || visibleElements.includes('children')) && (
        <FamilyMembers 
          state={state} 
          config={config}
          visibleElements={visibleElements}
        />
      )}

      {/* Location Indicator */}
      {visibleElements.includes('location') && (
        <div
          className="absolute"
          style={{
            left: `${AVATAR_POSITIONS.location.x}%`,
            top: `${AVATAR_POSITIONS.location.y}%`,
          }}
        >
          <LocationIndicator 
            state={state} 
            config={config}
            shouldAnimate={state.isAnimating}
          />
        </div>
      )}

      {/* Transportation, Education, and Health Indicators */}
      <IndicatorGroup 
        state={state} 
        config={config}
        visibleElements={visibleElements}
      />

      {/* Placeholder when no elements are visible */}
      {visibleElements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center" data-testid="avatar-placeholder">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 opacity-50" />
            <p className="text-xs text-gray-500">
              Your avatar will appear here
            </p>
          </div>
        </div>
      )}

      {/* Responsive overlay for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />
      </div>
    </div>
  );
};