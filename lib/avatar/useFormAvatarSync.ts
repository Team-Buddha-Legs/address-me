import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AvatarState, AvatarStateManager, UserProfile } from '@/types';
import { createAvatarStateManager } from './state-manager';
import { formSteps } from '@/lib/form-steps';

/**
 * Hook to synchronize form data with avatar state and manage progressive avatar building
 */
export const useFormAvatarSync = (
  currentStep: string,
  formData?: Partial<UserProfile>
) => {
  const [avatarManager] = useState<AvatarStateManager>(() => 
    createAvatarStateManager()
  );
  const [animatingElements, setAnimatingElements] = useState<Set<string>>(new Set());

  // Get all form data from session storage
  const getAllFormData = useCallback((): Partial<UserProfile> => {
    if (typeof window === 'undefined') return {};

    const allData: Record<string, unknown> = {};
    
    // Collect data from all completed steps
    formSteps.forEach(step => {
      try {
        const stepData = sessionStorage.getItem(`form-step-${step.id}`);
        if (stepData) {
          const parsed = JSON.parse(stepData);
          Object.assign(allData, parsed);
        }
      } catch (error) {
        console.warn(`Failed to load data for step ${step.id}:`, error);
      }
    });

    // Include current form data if provided
    if (formData) {
      Object.assign(allData, formData);
    }

    return transformFormDataToProfile(allData);
  }, [formData]);

  // Transform raw form data to UserProfile format
  const transformFormDataToProfile = (rawData: Record<string, unknown>): Partial<UserProfile> => {
    const profile: Partial<UserProfile> = {};

    // Personal info transformations
    if (rawData.age) profile.age = Number(rawData.age);
    if (rawData.gender) profile.gender = rawData.gender as UserProfile['gender'];
    if (rawData.maritalStatus) profile.maritalStatus = rawData.maritalStatus as UserProfile['maritalStatus'];

    // Location
    if (rawData.district) profile.district = rawData.district as UserProfile['district'];

    // Economic
    if (rawData.incomeRange) profile.incomeRange = rawData.incomeRange as UserProfile['incomeRange'];
    if (rawData.employmentStatus) profile.employmentStatus = rawData.employmentStatus as UserProfile['employmentStatus'];
    if (rawData.housingType) profile.housingType = rawData.housingType as UserProfile['housingType'];

    // Family
    if (rawData.hasChildren !== undefined) {
      profile.hasChildren = rawData.hasChildren === 'true' || rawData.hasChildren === true;
    }
    if (rawData.childrenAges && typeof rawData.childrenAges === 'string') {
      profile.childrenAges = rawData.childrenAges
        .split(',')
        .map(age => parseInt(age.trim()))
        .filter(age => !isNaN(age));
    }

    // Education & Transport
    if (rawData.educationLevel) profile.educationLevel = rawData.educationLevel as UserProfile['educationLevel'];
    if (rawData.transportationMode) {
      profile.transportationMode = Array.isArray(rawData.transportationMode) 
        ? rawData.transportationMode as UserProfile['transportationMode']
        : [rawData.transportationMode as UserProfile['transportationMode'][0]];
    }

    // Health
    if (rawData.healthConditions && typeof rawData.healthConditions === 'string') {
      profile.healthConditions = rawData.healthConditions
        .split(',')
        .map(condition => condition.trim())
        .filter(condition => condition.length > 0);
    }

    return profile;
  };

  // Determine which elements should be visible based on completed steps
  const getVisibleElementsForStep = useCallback((stepId: string): string[] => {
    const stepIndex = formSteps.findIndex(step => step.id === stepId);
    const completedSteps = formSteps.slice(0, stepIndex + 1);
    const elements: string[] = [];

    completedSteps.forEach(step => {
      switch (step.id) {
        case 'personal-info':
          elements.push('main-person');
          break;
        case 'location':
          elements.push('location');
          break;
        case 'family':
          elements.push('spouse', 'children');
          break;
        case 'education-transport':
          elements.push('transportation', 'education');
          break;
        case 'health':
          elements.push('health');
          break;
      }
    });

    return elements;
  }, []);

  // Trigger animations for new elements
  const triggerAnimations = useCallback((newElements: string[]) => {
    const currentVisible = avatarManager.getVisibleElements();
    const elementsToAnimate = newElements.filter(element => 
      !currentVisible.includes(element)
    );

    if (elementsToAnimate.length > 0) {
      setAnimatingElements(new Set(elementsToAnimate));
      
      // Clear animations after duration
      setTimeout(() => {
        setAnimatingElements(new Set());
      }, 500);
    }
  }, [avatarManager]);

  // Update avatar state when form data changes
  useEffect(() => {
    const allFormData = getAllFormData();
    const previousVisibleElements = avatarManager.getVisibleElements();
    
    // Update avatar state
    avatarManager.updateFromFormData(allFormData);
    
    // Get elements that should be visible for current step
    const stepVisibleElements = getVisibleElementsForStep(currentStep);
    const actualVisibleElements = avatarManager.getVisibleElements();
    
    // Only show elements that are both visible in state AND allowed for current step
    const allowedVisibleElements = actualVisibleElements.filter(element =>
      stepVisibleElements.includes(element)
    );
    
    // Trigger animations for new elements
    const newElements = allowedVisibleElements.filter(element =>
      !previousVisibleElements.includes(element)
    );
    
    if (newElements.length > 0) {
      triggerAnimations(newElements);
    }

    // Mark step as completed for animation purposes
    avatarManager.markStepCompleted(currentStep);
  }, [currentStep, formData, getAllFormData, getVisibleElementsForStep, triggerAnimations, avatarManager]);

  // Get filtered visible elements based on current step
  const getFilteredVisibleElements = useCallback((): string[] => {
    const stepVisibleElements = getVisibleElementsForStep(currentStep);
    const actualVisibleElements = avatarManager.getVisibleElements();
    
    return actualVisibleElements.filter(element =>
      stepVisibleElements.includes(element)
    );
  }, [currentStep, getVisibleElementsForStep, avatarManager]);

  // Check if an element should animate
  const shouldElementAnimate = useCallback((elementId: string): boolean => {
    return animatingElements.has(elementId);
  }, [animatingElements]);

  return {
    avatarState: avatarManager.state,
    visibleElements: getFilteredVisibleElements(),
    shouldElementAnimate,
    isAnimating: animatingElements.size > 0,
    getAllFormData,
  };
};

/**
 * Hook for development/testing with mock profile
 */
export const useMockAvatarSync = (enabled: boolean = false) => {
  const mockProfile: UserProfile = useMemo(() => ({
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
  }), []);

  const [avatarManager] = useState<AvatarStateManager>(() => {
    const manager = createAvatarStateManager();
    if (enabled) {
      manager.updateFromFormData(mockProfile);
    }
    return manager;
  });

  useEffect(() => {
    if (enabled) {
      avatarManager.updateFromFormData(mockProfile);
    }
  }, [enabled, mockProfile, avatarManager]);

  return {
    avatarState: avatarManager.state,
    visibleElements: enabled ? avatarManager.getVisibleElements() : [],
    shouldElementAnimate: () => false,
    isAnimating: false,
    mockProfile,
  };
};