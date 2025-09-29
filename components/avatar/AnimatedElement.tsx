'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  AnimationType, 
  AnimationConfig, 
  useOptimizedAnimations,
  getAnimationClasses 
} from '@/lib/avatar/animations';

export interface AnimatedElementProps {
  children: React.ReactNode;
  animationType: AnimationType;
  duration?: number;
  delay?: number;
  trigger?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animationType,
  duration,
  delay = 0,
  trigger = true,
  className,
  onAnimationComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { getAnimationConfig, isEnabled } = useOptimizedAnimations();

  const config = useMemo(() => {
    const baseConfig = getAnimationConfig(animationType);
    return {
      ...baseConfig,
      duration: duration ?? baseConfig.duration,
    };
  }, [animationType, duration, getAnimationConfig]);

  useEffect(() => {
    if (trigger && isEnabled) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setIsVisible(true);
        
        // Complete animation after duration
        const completeTimer = setTimeout(() => {
          setIsAnimating(false);
          onAnimationComplete?.();
        }, config.duration);

        return () => clearTimeout(completeTimer);
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (trigger && !isEnabled) {
      // If animations are disabled, show immediately
      setIsVisible(true);
      onAnimationComplete?.();
    }
  }, [trigger, delay, config.duration, isEnabled, onAnimationComplete]);

  const animationClasses = useMemo(() => {
    return getAnimationClasses(animationType, isVisible, isAnimating);
  }, [animationType, isVisible, isAnimating]);

  const style = useMemo(() => ({
    transitionDuration: `${config.duration}ms`,
    transitionTimingFunction: config.easing,
  }), [config.duration, config.easing]);

  return (
    <div
      className={cn(animationClasses, className)}
      style={style}
    >
      {children}
    </div>
  );
};