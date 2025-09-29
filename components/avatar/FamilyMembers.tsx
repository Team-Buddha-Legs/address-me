'use client';

import { useMemo } from 'react';
import type { AvatarState, AvatarConfig } from '@/types';
import { MaleIcon, FemaleIcon, NeutralIcon } from './icons/PersonIcons';
import { AVATAR_POSITIONS } from '@/lib/avatar/config';
import { AnimatedElement } from './AnimatedElement';

interface FamilyMembersProps {
  state: AvatarState;
  config: AvatarConfig;
  visibleElements: string[];
  shouldElementAnimate?: (elementId: string) => boolean;
}

/**
 * Component for rendering spouse and children figures
 */
export const FamilyMembers: React.FC<FamilyMembersProps> = ({
  state,
  config,
  visibleElements,
  shouldElementAnimate = () => false,
}) => {
  // Determine spouse icon (assume opposite gender for simplicity)
  const SpouseIcon = useMemo(() => {
    if (state.gender === 'male') return FemaleIcon;
    if (state.gender === 'female') return MaleIcon;
    return NeutralIcon;
  }, [state.gender]);

  const spouseSize = config.layout.iconSizes.spouse;
  const childSize = config.layout.iconSizes.child;
  const spouseColor = config.colors.primary;
  const childColor = config.colors.secondary;

  return (
    <>
      {/* Spouse */}
      {visibleElements.includes('spouse') && state.maritalStatus === 'married' && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${AVATAR_POSITIONS.spouse.x}%`,
            top: `${AVATAR_POSITIONS.spouse.y}%`,
          }}
        >
          <AnimatedElement
            animationType="slideIn"
            duration={config.animations.duration}
            delay={100}
            trigger={shouldElementAnimate('spouse')}
          >
            <div data-testid="spouse-icon">
              <SpouseIcon
                size={spouseSize}
                color={spouseColor}
                animate={shouldElementAnimate('spouse')}
                className="drop-shadow-sm opacity-90"
              />
            </div>
          </AnimatedElement>
        </div>
      )}

      {/* Children */}
      {visibleElements.includes('children') && state.hasChildren && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${AVATAR_POSITIONS.children.x}%`,
            top: `${AVATAR_POSITIONS.children.y}%`,
          }}
        >
          <AnimatedElement
            animationType="scale"
            duration={config.animations.duration}
            delay={200}
            trigger={shouldElementAnimate('children')}
          >
            <div 
              className="flex items-center justify-center space-x-1"
              data-testid="children-icons"
            >
              {Array.from({ length: Math.min(state.childrenCount, 3) }).map((_, index) => (
                <div key={index} data-testid="child-icon">
                  <NeutralIcon
                    size={childSize}
                    color={childColor}
                    animate={shouldElementAnimate('children')}
                    className="drop-shadow-sm opacity-80"
                  />
                </div>
              ))}
              {state.childrenCount > 3 && (
                <div className="text-xs text-gray-600 ml-1">
                  +{state.childrenCount - 3}
                </div>
              )}
            </div>
          </AnimatedElement>
        </div>
      )}
    </>
  );
};