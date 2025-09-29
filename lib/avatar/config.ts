import type { AvatarConfig } from '@/types';

/**
 * Default avatar configuration
 */
export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  colors: {
    primary: '#1e40af',    // Blue-700 (main person)
    secondary: '#059669',  // Green-600 (transportation, positive indicators)
    accent: '#ea580c',     // Orange-600 (education, achievements)
    neutral: '#6b7280',    // Gray-500 (neutral elements)
  },
  animations: {
    duration: 300,         // Animation duration in milliseconds
    easing: 'ease-in-out', // CSS easing function
  },
  layout: {
    containerSize: { width: 320, height: 256 }, // Container dimensions
    iconSizes: {
      'main-person': 48,   // Main person icon size
      'spouse': 40,        // Spouse icon size
      'child': 32,         // Child icon size
      'transportation': 24, // Transportation icons
      'education': 20,     // Education indicators
      'health': 20,        // Health indicators
      'location': 16,      // Location indicators
    },
    spacing: 8,            // Base spacing unit
  },
};

/**
 * Creates avatar configuration with optional overrides
 */
export const createAvatarConfig = (
  overrides?: Partial<AvatarConfig>
): AvatarConfig => ({
  ...DEFAULT_AVATAR_CONFIG,
  ...overrides,
  colors: {
    ...DEFAULT_AVATAR_CONFIG.colors,
    ...overrides?.colors,
  },
  animations: {
    ...DEFAULT_AVATAR_CONFIG.animations,
    ...overrides?.animations,
  },
  layout: {
    ...DEFAULT_AVATAR_CONFIG.layout,
    ...overrides?.layout,
    iconSizes: {
      ...DEFAULT_AVATAR_CONFIG.layout.iconSizes,
      ...overrides?.layout?.iconSizes,
    },
  },
});

/**
 * Avatar element positioning utilities
 */
export const AVATAR_POSITIONS = {
  'main-person': { x: 50, y: 60 },      // Center position (percentage)
  'spouse': { x: 70, y: 60 },           // Right of main person
  'children': { x: 50, y: 80 },         // Below main person
  'location': { x: 10, y: 10 },         // Top left
  'transportation': { x: 90, y: 20 },   // Top right
  'education': { x: 10, y: 90 },        // Bottom left
  'health': { x: 90, y: 90 },           // Bottom right
} as const;

/**
 * Animation presets for different element types
 */
export const ANIMATION_PRESETS = {
  'main-person': {
    type: 'fadeIn' as const,
    duration: 400,
    delay: 0,
  },
  'spouse': {
    type: 'slideIn' as const,
    duration: 300,
    delay: 100,
  },
  'children': {
    type: 'scale' as const,
    duration: 350,
    delay: 200,
  },
  'location': {
    type: 'fadeIn' as const,
    duration: 250,
    delay: 50,
  },
  'transportation': {
    type: 'slideIn' as const,
    duration: 300,
    delay: 150,
  },
  'education': {
    type: 'pulse' as const,
    duration: 400,
    delay: 100,
  },
  'health': {
    type: 'fadeIn' as const,
    duration: 300,
    delay: 200,
  },
} as const;