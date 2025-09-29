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

// Re-export types for convenience
export type {
  AvatarState,
  AvatarConfig,
  AvatarStateManager,
} from '@/types';