'use client';

import { useMemo } from 'react';
import type { AvatarState, AvatarConfig } from '@/types';
import { AVATAR_POSITIONS } from '@/lib/avatar/config';
import { AnimatedElement } from './AnimatedElement';
import { 
  BusIcon, 
  MTRIcon, 
  MinibusIcon, 
  TaxiIcon, 
  CarIcon, 
  BikeIcon, 
  WalkingIcon 
} from './icons/TransportationIcons';
import { 
  GraduationCapIcon, 
  BookIcon, 
  DiplomaIcon, 
  MedicalIcon, 
  AccessibilityIcon 
} from './icons/LifestyleIcons';

interface IndicatorGroupProps {
  state: AvatarState;
  config: AvatarConfig;
  visibleElements: string[];
  shouldElementAnimate?: (elementId: string) => boolean;
}

/**
 * Component for transportation, education, and health indicators
 */
export const IndicatorGroup: React.FC<IndicatorGroupProps> = ({
  state,
  config,
  visibleElements,
  shouldElementAnimate = () => false,
}) => {
  // Transportation icon mapping
  const transportationIcons = useMemo(() => {
    const iconMap = {
      mtr: MTRIcon,
      bus: BusIcon,
      minibus: MinibusIcon,
      taxi: TaxiIcon,
      'private-car': CarIcon,
      bicycle: BikeIcon,
      walking: WalkingIcon,
    };

    return state.transportationModes
      .slice(0, 3) // Limit to 3 icons for space
      .map(mode => iconMap[mode])
      .filter(Boolean);
  }, [state.transportationModes]);

  // Education icon based on level
  const EducationIcon = useMemo(() => {
    switch (state.educationLevel) {
      case 'primary':
      case 'secondary':
        return BookIcon;
      case 'post-secondary':
        return DiplomaIcon;
      case 'bachelor':
      case 'master':
      case 'doctorate':
        return GraduationCapIcon;
      default:
        return null;
    }
  }, [state.educationLevel]);

  // Health icons based on conditions
  const healthIcons = useMemo(() => {
    return state.healthConditions
      .slice(0, 2) // Limit to 2 icons for space
      .map(condition => {
        if (condition.toLowerCase().includes('mobility')) {
          return AccessibilityIcon;
        }
        return MedicalIcon; // Default medical icon for other conditions
      });
  }, [state.healthConditions]);

  const transportSize = config.layout.iconSizes.transportation;
  const educationSize = config.layout.iconSizes.education;
  const healthSize = config.layout.iconSizes.health;

  return (
    <>
      {/* Transportation Indicators */}
      {visibleElements.includes('transportation') && transportationIcons.length > 0 && (
        <div
          className="absolute"
          style={{
            left: `${AVATAR_POSITIONS.transportation.x}%`,
            top: `${AVATAR_POSITIONS.transportation.y}%`,
            transform: 'translate(-100%, 0)',
          }}
        >
          <AnimatedElement
            animationType="slideIn"
            duration={config.animations.duration}
            delay={150}
            trigger={shouldElementAnimate('transportation')}
          >
            <div 
              className="flex flex-col space-y-1"
              data-testid="transportation-icons"
            >
              {transportationIcons.map((IconComponent, index) => (
                <div key={index} data-testid={`transportation-icon-${index}`}>
                  <IconComponent
                    size={transportSize}
                    color={config.colors.secondary}
                    animate={shouldElementAnimate('transportation')}
                    className="drop-shadow-sm"
                  />
                </div>
              ))}
            </div>
          </AnimatedElement>
        </div>
      )}

      {/* Education Indicator */}
      {visibleElements.includes('education') && EducationIcon && (
        <div
          className="absolute"
          style={{
            left: `${AVATAR_POSITIONS.education.x}%`,
            top: `${AVATAR_POSITIONS.education.y}%`,
          }}
        >
          <AnimatedElement
            animationType="pulse"
            duration={config.animations.duration}
            delay={100}
            trigger={shouldElementAnimate('education')}
          >
            <div data-testid="education-icon">
              <EducationIcon
                size={educationSize}
                color={config.colors.accent}
                animate={shouldElementAnimate('education')}
                className="drop-shadow-sm"
              />
            </div>
          </AnimatedElement>
        </div>
      )}

      {/* Health Indicators */}
      {visibleElements.includes('health') && healthIcons.length > 0 && (
        <div
          className="absolute"
          style={{
            left: `${AVATAR_POSITIONS.health.x}%`,
            top: `${AVATAR_POSITIONS.health.y}%`,
            transform: 'translate(-100%, -100%)',
          }}
        >
          <AnimatedElement
            animationType="fadeIn"
            duration={config.animations.duration}
            delay={200}
            trigger={shouldElementAnimate('health')}
          >
            <div 
              className="flex flex-col space-y-1"
              data-testid="health-icons"
            >
              {healthIcons.map((IconComponent, index) => (
                <div key={index} data-testid={`health-icon-${index}`}>
                  <IconComponent
                    size={healthSize}
                    color="#dc2626" // Red color for health indicators
                    animate={shouldElementAnimate('health')}
                    className="drop-shadow-sm"
                  />
                </div>
              ))}
            </div>
          </AnimatedElement>
        </div>
      )}
    </>
  );
};