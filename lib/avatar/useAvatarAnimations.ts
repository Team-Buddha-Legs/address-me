import { useCallback, useEffect, useState } from 'react';
import type { AnimationType, AnimationConfig, AnimationQueueItem } from '@/types';

/**
 * Hook for managing avatar element animations with queue system
 */
export const useAvatarAnimations = () => {
  const [animationQueue, setAnimationQueue] = useState<AnimationQueueItem[]>([]);
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());

  // Default animation configurations
  const defaultConfigs: Record<AnimationType, AnimationConfig> = {
    fadeIn: { duration: 300, easing: 'ease-in-out' },
    slideIn: { duration: 400, easing: 'ease-out' },
    scale: { duration: 250, easing: 'ease-in-out' },
    pulse: { duration: 600, easing: 'ease-in-out' },
  };

  // Add animation to queue
  const queueAnimation = useCallback((
    elementId: string,
    animationType: AnimationType,
    config?: Partial<AnimationConfig>,
    priority: number = 0
  ) => {
    const animationConfig: AnimationConfig = {
      ...defaultConfigs[animationType],
      ...config,
    };

    const queueItem: AnimationQueueItem = {
      elementId,
      animationType,
      config: animationConfig,
      priority,
    };

    setAnimationQueue(prev => {
      // Remove any existing animation for this element
      const filtered = prev.filter(item => item.elementId !== elementId);
      // Add new animation and sort by priority (higher priority first)
      return [...filtered, queueItem].sort((a, b) => b.priority - a.priority);
    });
  }, [defaultConfigs]);

  // Process animation queue
  useEffect(() => {
    if (animationQueue.length === 0) return;

    const processNext = () => {
      const nextAnimation = animationQueue[0];
      if (!nextAnimation) return;

      // Mark element as animating
      setActiveAnimations(prev => new Set(prev).add(nextAnimation.elementId));

      // Remove from queue
      setAnimationQueue(prev => prev.slice(1));

      // Set timeout to remove from active animations
      setTimeout(() => {
        setActiveAnimations(prev => {
          const next = new Set(prev);
          next.delete(nextAnimation.elementId);
          return next;
        });
      }, nextAnimation.config.duration + (nextAnimation.config.delay || 0));
    };

    // Process animations with slight delay to allow for batching
    const timeoutId = setTimeout(processNext, 50);
    return () => clearTimeout(timeoutId);
  }, [animationQueue]);

  // Check if element is currently animating
  const isAnimating = useCallback((elementId: string): boolean => {
    return activeAnimations.has(elementId);
  }, [activeAnimations]);

  // Get animation config for element
  const getAnimationConfig = useCallback((elementId: string): AnimationConfig | null => {
    const queueItem = animationQueue.find(item => item.elementId === elementId);
    return queueItem?.config || null;
  }, [animationQueue]);

  // Clear all animations for an element
  const clearAnimations = useCallback((elementId: string) => {
    setAnimationQueue(prev => prev.filter(item => item.elementId !== elementId));
    setActiveAnimations(prev => {
      const next = new Set(prev);
      next.delete(elementId);
      return next;
    });
  }, []);

  // Clear all animations
  const clearAllAnimations = useCallback(() => {
    setAnimationQueue([]);
    setActiveAnimations(new Set());
  }, []);

  return {
    queueAnimation,
    isAnimating,
    getAnimationConfig,
    clearAnimations,
    clearAllAnimations,
    hasQueuedAnimations: animationQueue.length > 0,
    activeAnimationCount: activeAnimations.size,
  };
};

/**
 * Hook for optimized animations based on user preferences
 */
export const useOptimizedAnimations = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getOptimizedConfig = useCallback((
    baseConfig: AnimationConfig
  ): AnimationConfig => {
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
    getOptimizedConfig,
    isAnimationEnabled: !prefersReducedMotion,
  };
};

/**
 * Hook for element-specific animation states
 */
export const useElementAnimation = (
  elementId: string,
  animationType: AnimationType,
  trigger: boolean = false
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { getOptimizedConfig } = useOptimizedAnimations();

  const defaultConfig = {
    fadeIn: { duration: 300, easing: 'ease-in-out' },
    slideIn: { duration: 400, easing: 'ease-out' },
    scale: { duration: 250, easing: 'ease-in-out' },
    pulse: { duration: 600, easing: 'ease-in-out' },
  }[animationType];

  const config = getOptimizedConfig(defaultConfig);

  useEffect(() => {
    if (trigger && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, config.delay || 0);

      return () => clearTimeout(timer);
    }
  }, [trigger, hasAnimated, config.delay]);

  // Reset animation state when trigger becomes false
  useEffect(() => {
    if (!trigger) {
      setIsVisible(false);
      setHasAnimated(false);
    }
  }, [trigger]);

  const getAnimationClasses = useCallback(() => {
    const baseClasses = 'transition-all';
    const durationClass = `duration-${Math.round(config.duration / 100) * 100}`;
    const easingClass = config.easing === 'ease-in-out' ? 'ease-in-out' : 
                       config.easing === 'ease-out' ? 'ease-out' : 'ease-linear';

    const animationClasses = {
      fadeIn: isVisible ? 'opacity-100' : 'opacity-0',
      slideIn: isVisible ? 'translate-x-0' : 'translate-x-4',
      scale: isVisible ? 'scale-100' : 'scale-0',
      pulse: isVisible ? 'animate-pulse' : '',
    };

    return `${baseClasses} ${durationClass} ${easingClass} ${animationClasses[animationType]}`;
  }, [animationType, isVisible, config.duration, config.easing]);

  const getInlineStyles = useCallback(() => {
    return {
      transitionDuration: `${config.duration}ms`,
      transitionTimingFunction: config.easing,
    };
  }, [config.duration, config.easing]);

  return {
    isVisible,
    hasAnimated,
    isAnimating: trigger && !hasAnimated,
    getAnimationClasses,
    getInlineStyles,
    config,
  };
};