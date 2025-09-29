'use client';

import { AnimationType, AnimationConfig } from '@/types';

// Timing and easing configurations
export const TIMING_PRESETS = {
  instant: { duration: 0, easing: 'linear' },
  fast: { duration: 150, easing: 'ease-out' },
  normal: { duration: 300, easing: 'ease-in-out' },
  slow: { duration: 500, easing: 'ease-in-out' },
  bounce: { duration: 400, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
} as const;

export type TimingPreset = keyof typeof TIMING_PRESETS;

// Animation queue item
export interface AnimationQueueItem {
  elementId: string;
  animationType: AnimationType;
  config: AnimationConfig;
  priority: number;
}

// Animation queue manager
export class AnimationQueue {
  private queue: AnimationQueueItem[] = [];
  private running: Set<string> = new Set();
  private maxConcurrent: number = 3;

  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  // Add animation to queue
  enqueue(item: AnimationQueueItem): void {
    // Remove existing animation for same element
    this.queue = this.queue.filter(q => q.elementId !== item.elementId);
    
    // Insert based on priority (higher priority first)
    const insertIndex = this.queue.findIndex(q => q.priority < item.priority);
    if (insertIndex === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(insertIndex, 0, item);
    }

    this.processQueue();
  }

  // Process the animation queue
  private processQueue(): void {
    while (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.running.add(item.elementId);
      this.executeAnimation(item);
    }
  }

  // Execute a single animation
  private executeAnimation(item: AnimationQueueItem): void {
    const { elementId, config } = item;

    setTimeout(() => {
      this.running.delete(elementId);
      this.processQueue(); // Process next items in queue
    }, config.duration + (config.delay || 0));
  }

  // Check if element is currently animating
  isAnimating(elementId: string): boolean {
    return this.running.has(elementId);
  }

  // Clear all animations for an element
  clearElement(elementId: string): void {
    this.queue = this.queue.filter(q => q.elementId !== elementId);
    this.running.delete(elementId);
  }

  // Clear entire queue
  clear(): void {
    this.queue = [];
    this.running.clear();
  }

  // Get queue status
  getStatus() {
    return {
      queued: this.queue.length,
      running: this.running.size,
      total: this.queue.length + this.running.size,
    };
  }
}

// Global animation queue instance
let globalAnimationQueue: AnimationQueue | null = null;

export const getAnimationQueue = (): AnimationQueue => {
  if (!globalAnimationQueue) {
    globalAnimationQueue = new AnimationQueue();
  }
  return globalAnimationQueue;
};

// Transition utilities
export const createTransition = (
  property: string | string[],
  config: AnimationConfig
): string => {
  const properties = Array.isArray(property) ? property : [property];
  return properties
    .map(prop => `${prop} ${config.duration}ms ${config.easing}`)
    .join(', ');
};

// Staggered animation helper
export const createStaggeredAnimations = (
  elements: string[],
  baseConfig: AnimationConfig,
  staggerDelay = 100
): AnimationQueueItem[] => {
  return elements.map((elementId, index) => ({
    elementId,
    animationType: 'fadeIn' as AnimationType,
    config: {
      ...baseConfig,
      delay: (baseConfig.delay || 0) + (index * staggerDelay),
    },
    priority: elements.length - index, // Earlier elements have higher priority
  }));
};

// Preset transition configurations for common avatar elements
export const AVATAR_TRANSITIONS = {
  // Main person icon
  mainPerson: {
    enter: { ...TIMING_PRESETS.normal, delay: 0 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
  
  // Family members
  spouse: {
    enter: { ...TIMING_PRESETS.normal, delay: 200 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
  
  children: {
    enter: { ...TIMING_PRESETS.bounce, delay: 400 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
  
  // Indicators
  transportation: {
    enter: { ...TIMING_PRESETS.normal, delay: 600 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
  
  education: {
    enter: { ...TIMING_PRESETS.normal, delay: 700 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
  
  health: {
    enter: { ...TIMING_PRESETS.normal, delay: 800 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
  
  location: {
    enter: { ...TIMING_PRESETS.slow, delay: 100 },
    exit: { ...TIMING_PRESETS.fast, delay: 0 },
  },
} as const;

export type AvatarElement = keyof typeof AVATAR_TRANSITIONS;

// Helper to get transition config for avatar elements
export const getAvatarTransition = (
  element: AvatarElement,
  type: 'enter' | 'exit' = 'enter'
): AnimationConfig => {
  return AVATAR_TRANSITIONS[element][type];
};

// Batch animation helper for multiple elements
export const batchAnimate = (
  elements: Array<{
    id: string;
    type: AnimationType;
    element: AvatarElement;
  }>,
  priority = 1
): void => {
  const queue = getAnimationQueue();
  
  elements.forEach(({ id, type, element }) => {
    const config = getAvatarTransition(element, 'enter');
    queue.enqueue({
      elementId: id,
      animationType: type,
      config,
      priority,
    });
  });
};

// CSS class generators for transitions
export const getTransitionClasses = (
  element: AvatarElement,
  isVisible: boolean,
  animationType: AnimationType = 'fadeIn'
): string => {
  const config = getAvatarTransition(element, isVisible ? 'enter' : 'exit');
  
  const baseClasses = 'transition-all';
  const durationClass = `duration-${config.duration}`;
  
  const visibilityClasses = {
    fadeIn: isVisible ? 'opacity-100' : 'opacity-0',
    slideIn: isVisible ? 'translate-x-0' : 'translate-x-4',
    scale: isVisible ? 'scale-100' : 'scale-0',
    pulse: 'animate-pulse',
  };
  
  return `${baseClasses} ${durationClass} ${visibilityClasses[animationType]}`;
};