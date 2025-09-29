import { describe, it, expect } from 'vitest';
import {
  createAvatarConfig,
  DEFAULT_AVATAR_CONFIG,
  AVATAR_POSITIONS,
  ANIMATION_PRESETS,
} from '@/lib/avatar/config';
import type { AvatarConfig } from '@/types';

describe('Avatar Configuration', () => {
  describe('DEFAULT_AVATAR_CONFIG', () => {
    it('should have correct color scheme', () => {
      expect(DEFAULT_AVATAR_CONFIG.colors).toEqual({
        primary: '#1e40af',    // Blue-700
        secondary: '#059669',  // Green-600
        accent: '#ea580c',     // Orange-600
        neutral: '#6b7280',    // Gray-500
      });
    });

    it('should have appropriate animation settings', () => {
      expect(DEFAULT_AVATAR_CONFIG.animations).toEqual({
        duration: 300,
        easing: 'ease-in-out',
      });
    });

    it('should have proper layout configuration', () => {
      expect(DEFAULT_AVATAR_CONFIG.layout.containerSize).toEqual({
        width: 320,
        height: 256,
      });
      
      expect(DEFAULT_AVATAR_CONFIG.layout.iconSizes).toEqual({
        'main-person': 48,
        'spouse': 40,
        'child': 32,
        'transportation': 24,
        'education': 20,
        'health': 20,
        'location': 16,
      });
      
      expect(DEFAULT_AVATAR_CONFIG.layout.spacing).toBe(8);
    });
  });

  describe('createAvatarConfig', () => {
    it('should return default config when no overrides provided', () => {
      const config = createAvatarConfig();
      expect(config).toEqual(DEFAULT_AVATAR_CONFIG);
    });

    it('should merge color overrides correctly', () => {
      const overrides: Partial<AvatarConfig> = {
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
        },
      };
      
      const config = createAvatarConfig(overrides);
      
      expect(config.colors.primary).toBe('#ff0000');
      expect(config.colors.secondary).toBe('#00ff00');
      expect(config.colors.accent).toBe(DEFAULT_AVATAR_CONFIG.colors.accent);
      expect(config.colors.neutral).toBe(DEFAULT_AVATAR_CONFIG.colors.neutral);
    });

    it('should merge animation overrides correctly', () => {
      const overrides: Partial<AvatarConfig> = {
        animations: {
          duration: 500,
        },
      };
      
      const config = createAvatarConfig(overrides);
      
      expect(config.animations.duration).toBe(500);
      expect(config.animations.easing).toBe(DEFAULT_AVATAR_CONFIG.animations.easing);
    });

    it('should merge layout overrides correctly', () => {
      const overrides: Partial<AvatarConfig> = {
        layout: {
          containerSize: { width: 400, height: 300 },
          iconSizes: {
            'main-person': 60,
          },
          spacing: 12,
        },
      };
      
      const config = createAvatarConfig(overrides);
      
      expect(config.layout.containerSize).toEqual({ width: 400, height: 300 });
      expect(config.layout.iconSizes['main-person']).toBe(60);
      expect(config.layout.iconSizes['spouse']).toBe(DEFAULT_AVATAR_CONFIG.layout.iconSizes['spouse']);
      expect(config.layout.spacing).toBe(12);
    });

    it('should handle partial overrides without affecting other properties', () => {
      const overrides: Partial<AvatarConfig> = {
        colors: {
          primary: '#custom',
        },
      };
      
      const config = createAvatarConfig(overrides);
      
      expect(config.colors.primary).toBe('#custom');
      expect(config.animations).toEqual(DEFAULT_AVATAR_CONFIG.animations);
      expect(config.layout).toEqual(DEFAULT_AVATAR_CONFIG.layout);
    });
  });

  describe('AVATAR_POSITIONS', () => {
    it('should have positions for all avatar elements', () => {
      const expectedElements = [
        'main-person',
        'spouse',
        'children',
        'location',
        'transportation',
        'education',
        'health',
      ];
      
      expectedElements.forEach(element => {
        expect(AVATAR_POSITIONS[element as keyof typeof AVATAR_POSITIONS]).toBeDefined();
        expect(typeof AVATAR_POSITIONS[element as keyof typeof AVATAR_POSITIONS].x).toBe('number');
        expect(typeof AVATAR_POSITIONS[element as keyof typeof AVATAR_POSITIONS].y).toBe('number');
      });
    });

    it('should have reasonable position values (0-100)', () => {
      Object.values(AVATAR_POSITIONS).forEach(position => {
        expect(position.x).toBeGreaterThanOrEqual(0);
        expect(position.x).toBeLessThanOrEqual(100);
        expect(position.y).toBeGreaterThanOrEqual(0);
        expect(position.y).toBeLessThanOrEqual(100);
      });
    });

    it('should position main person in center area', () => {
      const mainPersonPos = AVATAR_POSITIONS['main-person'];
      expect(mainPersonPos.x).toBeGreaterThan(30);
      expect(mainPersonPos.x).toBeLessThan(70);
      expect(mainPersonPos.y).toBeGreaterThan(40);
      expect(mainPersonPos.y).toBeLessThan(80);
    });
  });

  describe('ANIMATION_PRESETS', () => {
    it('should have presets for all avatar elements', () => {
      const expectedElements = [
        'main-person',
        'spouse',
        'children',
        'location',
        'transportation',
        'education',
        'health',
      ];
      
      expectedElements.forEach(element => {
        expect(ANIMATION_PRESETS[element as keyof typeof ANIMATION_PRESETS]).toBeDefined();
      });
    });

    it('should have valid animation types', () => {
      const validTypes = ['fadeIn', 'slideIn', 'scale', 'pulse'];
      
      Object.values(ANIMATION_PRESETS).forEach(preset => {
        expect(validTypes).toContain(preset.type);
        expect(typeof preset.duration).toBe('number');
        expect(preset.duration).toBeGreaterThan(0);
        expect(typeof preset.delay).toBe('number');
        expect(preset.delay).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have reasonable duration values', () => {
      Object.values(ANIMATION_PRESETS).forEach(preset => {
        expect(preset.duration).toBeGreaterThanOrEqual(200);
        expect(preset.duration).toBeLessThanOrEqual(500);
      });
    });

    it('should have staggered delays for visual appeal', () => {
      const delays = Object.values(ANIMATION_PRESETS).map(preset => preset.delay);
      const uniqueDelays = [...new Set(delays)];
      
      // Should have some variety in delays
      expect(uniqueDelays.length).toBeGreaterThan(1);
    });

    it('should use appropriate animation types for different elements', () => {
      expect(ANIMATION_PRESETS['main-person'].type).toBe('fadeIn');
      expect(ANIMATION_PRESETS['spouse'].type).toBe('slideIn');
      expect(ANIMATION_PRESETS['children'].type).toBe('scale');
      expect(ANIMATION_PRESETS['education'].type).toBe('pulse');
    });
  });

  describe('Configuration Integration', () => {
    it('should work together for complete avatar setup', () => {
      const config = createAvatarConfig({
        colors: { primary: '#custom' },
        animations: { duration: 400 },
      });
      
      // Verify config is properly structured
      expect(config.colors.primary).toBe('#custom');
      expect(config.animations.duration).toBe(400);
      
      // Verify positions and presets are available
      expect(AVATAR_POSITIONS['main-person']).toBeDefined();
      expect(ANIMATION_PRESETS['main-person']).toBeDefined();
      
      // Verify they work together logically
      const mainPersonPreset = ANIMATION_PRESETS['main-person'];
      expect(mainPersonPreset.duration).toBeLessThanOrEqual(config.animations.duration + 100);
    });
  });
});