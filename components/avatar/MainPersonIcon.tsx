'use client';

import { useMemo } from 'react';
import type { AvatarState, AvatarConfig } from '@/types';
import { MaleIcon, FemaleIcon, NeutralIcon } from './icons/PersonIcons';
import { AnimatedElement } from './AnimatedElement';

interface MainPersonIconProps {
  state: AvatarState;
  config: AvatarConfig;
  shouldAnimate?: boolean;
}

/**
 * Main person icon component that renders based on gender selection
 */
export const MainPersonIcon: React.FC<MainPersonIconProps> = ({
  state,
  config,
  shouldAnimate = false,
}) => {
  // Select the appropriate icon based on gender
  const IconComponent = useMemo(() => {
    switch (state.gender) {
      case 'male':
        return MaleIcon;
      case 'female':
        return FemaleIcon;
      case 'other':
      case 'neutral':
        return NeutralIcon;
      default:
        return null;
    }
  }, [state.gender]);

  // Don't render if no gender is selected
  if (!IconComponent || !state.gender) {
    return null;
  }

  const iconSize = config.layout.iconSizes['main-person'];
  const iconColor = config.colors.primary;

  return (
    <AnimatedElement
      animationType="fadeIn"
      duration={config.animations.duration}
      trigger={shouldAnimate}
    >
      <div 
        className="flex items-center justify-center"
        data-testid="main-person-icon"
      >
        <IconComponent
          size={iconSize}
          color={iconColor}
          animate={shouldAnimate}
          className="drop-shadow-sm"
        />
      </div>
    </AnimatedElement>
  );
};