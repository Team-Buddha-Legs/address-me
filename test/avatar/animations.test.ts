import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { 
  useAvatarAnimations, 
  useOptimizedAnimations,
  getAnimationClasses,
  DEFAULT_ANIMATIONS 
} from '@/lib/avatar/animations';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Avatar Animations', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  describe('useAvatarAnimations', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useAvatarAnimations());
      
      expect(result.current.animatingElements.size).toBe(0);
      expect(result.current.isAnimating('test-element')).toBe(false);
      expect(result.current.hasAnimated('test-element')).toBe(false);
    });

    it('should animate element and track state', () => {
      const { result } = renderHook(() => useAvatarAnimations());
      
      act(() => {
        result.current.animateElement('test-element', 300);
      });

      expect(result.current.isAnimating('test-element')).toBe(true);
      expect(result.current.hasAnimated('test-element')).toBe(false);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isAnimating('test-element')).toBe(false);
      expect(result.current.hasAnimated('test-element')).toBe(true);
    });

    it('should reset animations', () => {
      const { result } = renderHook(() => useAvatarAnimations());
      
      act(() => {
        result.current.animateElement('test-element', 300);
      });

      act(() => {
        result.current.resetAnimations();
      });

      expect(result.current.animatingElements.size).toBe(0);
      expect(result.current.hasAnimated('test-element')).toBe(false);
    });
  });

  describe('useOptimizedAnimations', () => {
    it('should return normal config when motion is not reduced', () => {
      const { result } = renderHook(() => useOptimizedAnimations());
      
      const config = result.current.getAnimationConfig('fadeIn');
      expect(config.duration).toBe(DEFAULT_ANIMATIONS.fadeIn.duration);
      expect(config.easing).toBe(DEFAULT_ANIMATIONS.fadeIn.easing);
      expect(result.current.isEnabled).toBe(true);
    });

    it('should return reduced config when motion is reduced', () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useOptimizedAnimations());
      
      const config = result.current.getAnimationConfig('fadeIn');
      expect(config.duration).toBe(0);
      expect(config.easing).toBe('linear');
      expect(result.current.isEnabled).toBe(false);
    });
  });

  describe('getAnimationClasses', () => {
    it('should return correct classes for fadeIn animation', () => {
      const visibleClasses = getAnimationClasses('fadeIn', true);
      const hiddenClasses = getAnimationClasses('fadeIn', false);
      
      expect(visibleClasses).toContain('opacity-100');
      expect(hiddenClasses).toContain('opacity-0');
      expect(visibleClasses).toContain('transition-all');
      expect(hiddenClasses).toContain('transition-all');
    });

    it('should return correct classes for slideIn animation', () => {
      const visibleClasses = getAnimationClasses('slideIn', true);
      const hiddenClasses = getAnimationClasses('slideIn', false);
      
      expect(visibleClasses).toContain('translate-x-0');
      expect(hiddenClasses).toContain('translate-x-4');
    });

    it('should return correct classes for scale animation', () => {
      const visibleClasses = getAnimationClasses('scale', true);
      const hiddenClasses = getAnimationClasses('scale', false);
      
      expect(visibleClasses).toContain('scale-100');
      expect(hiddenClasses).toContain('scale-0');
    });

    it('should return pulse classes when animating', () => {
      const pulseClasses = getAnimationClasses('pulse', true, true);
      expect(pulseClasses).toContain('animate-pulse');
    });
  });
});