'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AnimationQueue, 
  getAnimationQueue, 
  AvatarElement, 
  getAvatarTransition,
  batchAnimate 
} from './transitions';
import { AnimationType } from '@/types';

// Hook for managing avatar transitions
export const useAvatarTransitions = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [animatingElements, setAnimatingElements] = useState<Set<string>>(new Set());
  const queueRef = useRef<AnimationQueue>(getAnimationQueue());

  // Show element with animation
  const showElement = useCallback((
    elementId: string, 
    avatarElement: AvatarElement,
    animationType: AnimationType = 'fadeIn',
    priority = 1
  ) => {
    const config = getAvatarTransition(avatarElement, 'enter');
    
    // Add to animating set
    setAnimatingElements(prev => new Set(prev).add(elementId));
    
    // Queue the animation
    queueRef.current.enqueue({
      elementId,
      animationType,
      config,
      priority,
    });

    // Show element immediately (CSS will handle the transition)
    setVisibleElements(prev => new Set(prev).add(elementId));

    // Remove from animating set after animation completes
    setTimeout(() => {
      setAnimatingElements(prev => {
        const next = new Set(prev);
        next.delete(elementId);
        return next;
      });
    }, config.duration + (config.delay || 0));
  }, []);

  // Hide element with animation
  const hideElement = useCallback((
    elementId: string,
    avatarElement: AvatarElement,
    animationType: AnimationType = 'fadeIn'
  ) => {
    const config = getAvatarTransition(avatarElement, 'exit');
    
    // Add to animating set
    setAnimatingElements(prev => new Set(prev).add(elementId));
    
    // Hide element after delay
    setTimeout(() => {
      setVisibleElements(prev => {
        const next = new Set(prev);
        next.delete(elementId);
        return next;
      });
      
      setAnimatingElements(prev => {
        const next = new Set(prev);
        next.delete(elementId);
        return next;
      });
    }, config.duration);
  }, []);

  // Show multiple elements with staggered animation
  const showElements = useCallback((
    elements: Array<{
      id: string;
      avatarElement: AvatarElement;
      animationType?: AnimationType;
    }>,
    staggerDelay = 100
  ) => {
    elements.forEach(({ id, avatarElement, animationType = 'fadeIn' }, index) => {
      setTimeout(() => {
        showElement(id, avatarElement, animationType, elements.length - index);
      }, index * staggerDelay);
    });
  }, [showElement]);

  // Hide multiple elements
  const hideElements = useCallback((elementIds: string[]) => {
    elementIds.forEach(id => {
      // Use a default avatar element for hiding
      hideElement(id, 'mainPerson', 'fadeIn');
    });
  }, [hideElement]);

  // Check if element is visible
  const isVisible = useCallback((elementId: string) => {
    return visibleElements.has(elementId);
  }, [visibleElements]);

  // Check if element is animating
  const isAnimating = useCallback((elementId: string) => {
    return animatingElements.has(elementId) || queueRef.current.isAnimating(elementId);
  }, [animatingElements]);

  // Clear all animations and reset state
  const reset = useCallback(() => {
    queueRef.current.clear();
    setVisibleElements(new Set());
    setAnimatingElements(new Set());
  }, []);

  // Get current animation queue status
  const getQueueStatus = useCallback(() => {
    return queueRef.current.getStatus();
  }, []);

  return {
    // State
    visibleElements: Array.from(visibleElements),
    animatingElements: Array.from(animatingElements),
    
    // Actions
    showElement,
    hideElement,
    showElements,
    hideElements,
    
    // Queries
    isVisible,
    isAnimating,
    
    // Utilities
    reset,
    getQueueStatus,
  };
};

// Hook for managing element-specific transitions
export const useElementTransition = (
  elementId: string,
  avatarElement: AvatarElement,
  shouldShow: boolean,
  animationType: AnimationType = 'fadeIn'
) => {
  const { showElement, hideElement, isVisible, isAnimating } = useAvatarTransitions();
  const previousShouldShow = useRef(shouldShow);

  useEffect(() => {
    if (shouldShow !== previousShouldShow.current) {
      if (shouldShow) {
        showElement(elementId, avatarElement, animationType);
      } else {
        hideElement(elementId, avatarElement, animationType);
      }
      previousShouldShow.current = shouldShow;
    }
  }, [shouldShow, elementId, avatarElement, animationType, showElement, hideElement]);

  return {
    isVisible: isVisible(elementId),
    isAnimating: isAnimating(elementId),
  };
};