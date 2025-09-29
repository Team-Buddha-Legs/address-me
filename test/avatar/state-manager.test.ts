import { describe, it, expect, beforeEach } from 'vitest';
import {
  createAvatarStateManager,
  createInitialAvatarState,
  getMockAvatarState,
  MOCK_AVATAR_PROFILE,
} from '@/lib/avatar/state-manager';
import type { UserProfile, AvatarState } from '@/types';

describe('Avatar State Manager', () => {
  describe('createInitialAvatarState', () => {
    it('should create initial state with null/empty values', () => {
      const state = createInitialAvatarState();
      
      expect(state).toEqual({
        gender: null,
        age: null,
        maritalStatus: null,
        hasChildren: false,
        childrenCount: 0,
        district: null,
        incomeRange: null,
        educationLevel: null,
        transportationModes: [],
        healthConditions: [],
        isAnimating: false,
        completedSteps: [],
      });
    });
  });

  describe('createAvatarStateManager', () => {
    let manager: ReturnType<typeof createAvatarStateManager>;

    beforeEach(() => {
      manager = createAvatarStateManager();
    });

    it('should create manager with initial state', () => {
      expect(manager.state).toEqual(createInitialAvatarState());
    });

    it('should create manager with custom initial state', () => {
      const customState: Partial<AvatarState> = {
        gender: 'male',
        age: 25,
        completedSteps: ['personal-info'],
      };
      
      const customManager = createAvatarStateManager(customState);
      
      expect(customManager.state.gender).toBe('male');
      expect(customManager.state.age).toBe(25);
      expect(customManager.state.completedSteps).toEqual(['personal-info']);
    });

    describe('updateFromFormData', () => {
      it('should update gender from form data', () => {
        const formData: Partial<UserProfile> = { gender: 'female' };
        
        manager.updateFromFormData(formData);
        
        expect(manager.state.gender).toBe('female');
      });

      it('should convert "prefer-not-to-say" to "neutral"', () => {
        const formData: Partial<UserProfile> = { gender: 'prefer-not-to-say' };
        
        manager.updateFromFormData(formData);
        
        expect(manager.state.gender).toBe('neutral');
      });

      it('should update family structure', () => {
        const formData: Partial<UserProfile> = {
          maritalStatus: 'married',
          hasChildren: true,
          childrenAges: [5, 8, 12],
        };
        
        manager.updateFromFormData(formData);
        
        expect(manager.state.maritalStatus).toBe('married');
        expect(manager.state.hasChildren).toBe(true);
        expect(manager.state.childrenCount).toBe(3);
      });

      it('should update location and lifestyle data', () => {
        const formData: Partial<UserProfile> = {
          district: 'central-western',
          incomeRange: '30k-50k',
          educationLevel: 'bachelor',
          transportationMode: ['mtr', 'bus'],
          healthConditions: ['diabetes', 'hypertension'],
        };
        
        manager.updateFromFormData(formData);
        
        expect(manager.state.district).toBe('central-western');
        expect(manager.state.incomeRange).toBe('30k-50k');
        expect(manager.state.educationLevel).toBe('bachelor');
        expect(manager.state.transportationModes).toEqual(['mtr', 'bus']);
        expect(manager.state.healthConditions).toEqual(['diabetes', 'hypertension']);
      });

      it('should set isAnimating to true when visual elements change', () => {
        const formData: Partial<UserProfile> = { gender: 'male' };
        
        manager.updateFromFormData(formData);
        
        expect(manager.state.isAnimating).toBe(true);
      });

      it('should not set isAnimating when no visual changes occur', () => {
        // First update to set initial state
        manager.updateFromFormData({ gender: 'male' });
        
        // Reset animation state manually (simulating component behavior)
        const currentState = { ...manager.state, isAnimating: false };
        const managerWithState = createAvatarStateManager(currentState);
        
        // Update with same data
        managerWithState.updateFromFormData({ gender: 'male' });
        
        expect(managerWithState.state.isAnimating).toBe(false);
      });
    });

    describe('getVisibleElements', () => {
      it('should return empty array for initial state', () => {
        const elements = manager.getVisibleElements();
        expect(elements).toEqual([]);
      });

      it('should return main-person when gender is set', () => {
        manager.updateFromFormData({ gender: 'male' });
        
        const elements = manager.getVisibleElements();
        expect(elements).toContain('main-person');
      });

      it('should return spouse when married', () => {
        manager.updateFromFormData({ 
          gender: 'female',
          maritalStatus: 'married' 
        });
        
        const elements = manager.getVisibleElements();
        expect(elements).toContain('main-person');
        expect(elements).toContain('spouse');
      });

      it('should return children when hasChildren is true', () => {
        manager.updateFromFormData({ 
          gender: 'male',
          hasChildren: true,
          childrenAges: [5]
        });
        
        const elements = manager.getVisibleElements();
        expect(elements).toContain('main-person');
        expect(elements).toContain('children');
      });

      it('should return all relevant elements for complete profile', () => {
        manager.updateFromFormData({
          gender: 'male',
          maritalStatus: 'married',
          hasChildren: true,
          childrenAges: [5],
          district: 'central-western',
          educationLevel: 'bachelor',
          transportationMode: ['mtr', 'bus'],
          healthConditions: ['diabetes'],
        });
        
        const elements = manager.getVisibleElements();
        expect(elements).toEqual([
          'main-person',
          'spouse',
          'children',
          'location',
          'transportation',
          'education',
          'health',
        ]);
      });
    });

    describe('shouldAnimate', () => {
      it('should return false when not animating', () => {
        const shouldAnimate = manager.shouldAnimate('main-person');
        expect(shouldAnimate).toBe(false);
      });

      it('should return true when animating and step not completed', () => {
        manager.updateFromFormData({ gender: 'male' }); // This sets isAnimating to true
        
        const shouldAnimate = manager.shouldAnimate('main-person');
        expect(shouldAnimate).toBe(true);
      });

      it('should return false when step is already completed', () => {
        manager.updateFromFormData({ gender: 'male' });
        manager.markStepCompleted('main-person');
        
        const shouldAnimate = manager.shouldAnimate('main-person');
        expect(shouldAnimate).toBe(false);
      });
    });

    describe('markStepCompleted', () => {
      it('should add step to completed steps', () => {
        manager.markStepCompleted('personal-info');
        
        expect(manager.state.completedSteps).toContain('personal-info');
      });

      it('should not add duplicate steps', () => {
        manager.markStepCompleted('personal-info');
        manager.markStepCompleted('personal-info');
        
        expect(manager.state.completedSteps).toEqual(['personal-info']);
      });

      it('should add multiple different steps', () => {
        manager.markStepCompleted('personal-info');
        manager.markStepCompleted('family-info');
        
        expect(manager.state.completedSteps).toEqual(['personal-info', 'family-info']);
      });
    });
  });

  describe('Mock Profile Functions', () => {
    describe('MOCK_AVATAR_PROFILE', () => {
      it('should contain expected mock data', () => {
        expect(MOCK_AVATAR_PROFILE).toEqual({
          age: 30,
          gender: 'male',
          maritalStatus: 'single',
          district: 'central-western',
          incomeRange: '20k-30k',
          employmentStatus: 'employed-full-time',
          housingType: 'private-rental',
          hasChildren: true,
          childrenAges: [5],
          educationLevel: 'bachelor',
          transportationMode: ['bus', 'mtr'],
          healthConditions: ['diabetes'],
        });
      });
    });

    describe('getMockAvatarState', () => {
      it('should return avatar state based on mock profile', () => {
        const mockState = getMockAvatarState();
        
        expect(mockState.gender).toBe('male');
        expect(mockState.age).toBe(30);
        expect(mockState.maritalStatus).toBe('single');
        expect(mockState.hasChildren).toBe(true);
        expect(mockState.childrenCount).toBe(1);
        expect(mockState.district).toBe('central-western');
        expect(mockState.incomeRange).toBe('20k-30k');
        expect(mockState.educationLevel).toBe('bachelor');
        expect(mockState.transportationModes).toEqual(['bus', 'mtr']);
        expect(mockState.healthConditions).toEqual(['diabetes']);
      });

      it('should have animation state set', () => {
        const mockState = getMockAvatarState();
        
        expect(mockState.isAnimating).toBe(true);
        expect(mockState.completedSteps).toEqual([]);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user journey', () => {
      const manager = createAvatarStateManager();
      
      // Step 1: Personal info
      manager.updateFromFormData({ 
        gender: 'female',
        age: 28 
      });
      expect(manager.getVisibleElements()).toEqual(['main-person']);
      manager.markStepCompleted('personal-info');
      
      // Step 2: Family info
      manager.updateFromFormData({ 
        maritalStatus: 'married',
        hasChildren: true,
        childrenAges: [3, 7]
      });
      expect(manager.getVisibleElements()).toEqual(['main-person', 'spouse', 'children']);
      expect(manager.state.childrenCount).toBe(2);
      manager.markStepCompleted('family-info');
      
      // Step 3: Location and lifestyle
      manager.updateFromFormData({
        district: 'wan-chai',
        educationLevel: 'master',
        transportationMode: ['mtr'],
        healthConditions: []
      });
      expect(manager.getVisibleElements()).toEqual([
        'main-person', 'spouse', 'children', 'location', 'transportation', 'education'
      ]);
      manager.markStepCompleted('lifestyle-info');
      
      // Verify final state
      expect(manager.state.completedSteps).toEqual([
        'personal-info', 'family-info', 'lifestyle-info'
      ]);
    });
  });
});