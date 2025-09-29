// Avatar state management exports
export {
  createAvatarStateManager,
  createInitialAvatarState,
  getMockAvatarState,
  MOCK_AVATAR_PROFILE,
} from './state-manager';

// Avatar configuration exports
export {
  createAvatarConfig,
  DEFAULT_AVATAR_CONFIG,
  AVATAR_POSITIONS,
  ANIMATION_PRESETS,
} from './config';

// Animation system exports
export {
  useAvatarAnimations,
  useOptimizedAnimations,
  getAnimationClasses,
  DEFAULT_ANIMATIONS,
} from './animations';

// Transition system exports
export {
  AnimationQueue,
  getAnimationQueue,
  createTransition,
  createStaggeredAnimations,
  batchAnimate,
  getAvatarTransition,
  getTransitionClasses,
  TIMING_PRESETS,
  AVATAR_TRANSITIONS,
} from './transitions';

export {
  useAvatarTransitions,
  useElementTransition,
} from './useAvatarTransitions';

// Re-export types for convenience
export type {
  AvatarState,
  AvatarConfig,
  AvatarStateManager,
  AnimationType,
  AnimationConfig,
} from '@/types';