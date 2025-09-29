'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

// Animation types
export type AnimationType = 'fadeIn' | 'slideIn' | 'scale' | 'pulse';

// Animation configuration
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// Default animation configurations
export const DEFAULT_ANIMATIONS: Record<AnimationType, AnimationConfig> = {
  fadeIn: { duration: 300, easing: 'ease-in-out' },
  slideIn: { duration: 300, easing: 'ease-out' },
  scale: { duration: 250, easing: 'ease-out' },
  pulse: { duration: 1000, easing: 'ease-in-out' },
};

// Hook for managing avatar element animations
export const useAvatarAnimations = () => {
  const [animatingElements, setAnimatingElements] = useState<Set<string>>(new Set());
  const [completedAnimations, setCompletedAnimations] = useState<Set<string>>(new Set());

  const animateElement = useCallback((elementId: string, duration = 300) => {
    setAnimatingElements(prev => new Set(prev).add(elementId));
    
    setTimeout(() => {
      setAnimatingElements(prev => {
        const next = new Set(prev);
        next.delete(elementId);
        return next;
      });
      
      setCompletedAnimations(prev => new Set(prev).add(elementId));
    }, duration);
  }, []);

  const isAnimating = useCallback((elementId: string) => {
    return animatingElements.has(elementId);
  }, [animatingElements]);

  const hasAnimated = useCallback((elementId: string) => {
    return completedAnimations.has(elementId);
  }, [completedAnimations]);

  const resetAnimations = useCallback(() => {
    setAnimatingElements(new Set());
    setCompletedAnimations(new Set());
  }, []);

  return {
    animatingElements,
    animateElement,
    isAnimating,
    hasAnimated,
    resetAnimations,
  };
};

// Hook for optimized animations based on user preferences
export const useOptimizedAnimations = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getAnimationConfig = useCallback((type: AnimationType): AnimationConfig => {
    const baseConfig = DEFAULT_ANIMATIONS[type];
    
    if (prefersReducedMotion) {
      return {
        ...baseConfig,
        duration: 0,
        easing: 'linear',
      };
    }
    
    return baseConfig;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getAnimationConfig,
    isEnabled: !prefersReducedMotion,
  };
};

// Animation class generators
export const getAnimationClasses = (
  type: AnimationType,
  isVisible: boolean,
  isAnimating: boolean = false
): string => {
  const baseClasses = 'transition-all';
  
  const animationClasses = {
    fadeIn: isVisible ? 'opacity-100' : 'opacity-0',
    slideIn: isVisible ? 'translate-x-0' : 'translate-x-4',
    scale: isVisible ? 'scale-100' : 'scale-0',
    pulse: isAnimating ? 'animate-pulse' : '',
  };

  return `${baseClasses} ${animationClasses[type]}`;
};