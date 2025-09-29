import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  AnimationQueue,
  getAnimationQueue,
  createTransition,
  createStaggeredAnimations,
  getAvatarTransition,
  getTransitionClasses,
  TIMING_PRESETS,
  AVATAR_TRANSITIONS 
} from '@/lib/avatar/transitions';

describe('Avatar Transitions', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  describe('AnimationQueue', () => {
    it('should initialize empty queue', () => {
      const queue = new AnimationQueue();
      const status = queue.getStatus();
      
      expect(status.queued).toBe(0);
      expect(status.running).toBe(0);
      expect(status.total).toBe(0);
    });

    it('should enqueue animations by priority', () => {
      const queue = new AnimationQueue();
      
      queue.enqueue({
        elementId: 'low-priority',
        animationType: 'fadeIn',
        config: { duration: 300, easing: 'ease' },
        priority: 1,
      });

      queue.enqueue({
        elementId: 'high-priority',
        animationType: 'fadeIn',
        config: { duration: 300, easing: 'ease' },
        priority: 5,
      });

      const status = queue.getStatus();
      expect(status.total).toBe(2);
    });

    it('should process animations with concurrency limit', () => {
      const queue = new AnimationQueue(2); // Max 2 concurrent
      
      // Add 3 animations
      for (let i = 0; i < 3; i++) {
        queue.enqueue({
          elementId: `element-${i}`,
          animationType: 'fadeIn',
          config: { duration: 300, easing: 'ease' },
          priority: 1,
        });
      }

      const status = queue.getStatus();
      expect(status.running).toBeLessThanOrEqual(2);
    });

    it('should clear animations for specific element', () => {
      const queue = new AnimationQueue();
      
      queue.enqueue({
        elementId: 'test-element',
        animationType: 'fadeIn',
        config: { duration: 300, easing: 'ease' },
        priority: 1,
      });

      queue.clearElement('test-element');
      expect(queue.isAnimating('test-element')).toBe(false);
    });

    it('should clear entire queue', () => {
      const queue = new AnimationQueue();
      
      queue.enqueue({
        elementId: 'test-element',
        animationType: 'fadeIn',
        config: { duration: 300, easing: 'ease' },
        priority: 1,
      });

      queue.clear();
      const status = queue.getStatus();
      expect(status.total).toBe(0);
    });
  });

  describe('createTransition', () => {
    it('should create transition string for single property', () => {
      const transition = createTransition('opacity', { duration: 300, easing: 'ease-in-out' });
      expect(transition).toBe('opacity 300ms ease-in-out');
    });

    it('should create transition string for multiple properties', () => {
      const transition = createTransition(
        ['opacity', 'transform'], 
        { duration: 300, easing: 'ease-in-out' }
      );
      expect(transition).toBe('opacity 300ms ease-in-out, transform 300ms ease-in-out');
    });
  });

  describe('createStaggeredAnimations', () => {
    it('should create staggered animations with increasing delays', () => {
      const elements = ['element1', 'element2', 'element3'];
      const animations = createStaggeredAnimations(
        elements,
        { duration: 300, easing: 'ease' },
        100
      );

      expect(animations).toHaveLength(3);
      expect(animations[0].config.delay).toBe(0);
      expect(animations[1].config.delay).toBe(100);
      expect(animations[2].config.delay).toBe(200);
      
      // Check priority order (earlier elements have higher priority)
      expect(animations[0].priority).toBe(3);
      expect(animations[1].priority).toBe(2);
      expect(animations[2].priority).toBe(1);
    });
  });

  describe('getAvatarTransition', () => {
    it('should return enter transition config', () => {
      const config = getAvatarTransition('mainPerson', 'enter');
      expect(config).toEqual(AVATAR_TRANSITIONS.mainPerson.enter);
    });

    it('should return exit transition config', () => {
      const config = getAvatarTransition('spouse', 'exit');
      expect(config).toEqual(AVATAR_TRANSITIONS.spouse.exit);
    });

    it('should default to enter transition', () => {
      const config = getAvatarTransition('children');
      expect(config).toEqual(AVATAR_TRANSITIONS.children.enter);
    });
  });

  describe('getTransitionClasses', () => {
    it('should return correct classes for visible element', () => {
      const classes = getTransitionClasses('mainPerson', true, 'fadeIn');
      expect(classes).toContain('transition-all');
      expect(classes).toContain('opacity-100');
    });

    it('should return correct classes for hidden element', () => {
      const classes = getTransitionClasses('spouse', false, 'slideIn');
      expect(classes).toContain('transition-all');
      expect(classes).toContain('translate-x-4');
    });

    it('should include duration class', () => {
      const classes = getTransitionClasses('children', true, 'scale');
      expect(classes).toMatch(/duration-\d+/);
    });
  });

  describe('TIMING_PRESETS', () => {
    it('should have all required presets', () => {
      expect(TIMING_PRESETS.instant).toBeDefined();
      expect(TIMING_PRESETS.fast).toBeDefined();
      expect(TIMING_PRESETS.normal).toBeDefined();
      expect(TIMING_PRESETS.slow).toBeDefined();
      expect(TIMING_PRESETS.bounce).toBeDefined();
    });

    it('should have instant preset with zero duration', () => {
      expect(TIMING_PRESETS.instant.duration).toBe(0);
      expect(TIMING_PRESETS.instant.easing).toBe('linear');
    });
  });

  describe('AVATAR_TRANSITIONS', () => {
    it('should have transitions for all avatar elements', () => {
      const elements = [
        'mainPerson', 'spouse', 'children', 
        'transportation', 'education', 'health', 'location'
      ];
      
      elements.forEach(element => {
        expect(AVATAR_TRANSITIONS[element as keyof typeof AVATAR_TRANSITIONS]).toBeDefined();
        expect(AVATAR_TRANSITIONS[element as keyof typeof AVATAR_TRANSITIONS].enter).toBeDefined();
        expect(AVATAR_TRANSITIONS[element as keyof typeof AVATAR_TRANSITIONS].exit).toBeDefined();
      });
    });

    it('should have staggered delays for enter animations', () => {
      const mainPersonDelay = AVATAR_TRANSITIONS.mainPerson.enter.delay || 0;
      const spouseDelay = AVATAR_TRANSITIONS.spouse.enter.delay || 0;
      const childrenDelay = AVATAR_TRANSITIONS.children.enter.delay || 0;
      
      expect(spouseDelay).toBeGreaterThan(mainPersonDelay);
      expect(childrenDelay).toBeGreaterThan(spouseDelay);
    });
  });

  describe('getAnimationQueue', () => {
    it('should return singleton instance', () => {
      const queue1 = getAnimationQueue();
      const queue2 = getAnimationQueue();
      expect(queue1).toBe(queue2);
    });
  });
});