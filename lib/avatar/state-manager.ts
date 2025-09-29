import type { AvatarState, AvatarStateManager, UserProfile } from '@/types';

/**
 * Creates an initial avatar state with default values
 */
export const createInitialAvatarState = (): AvatarState => ({
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

/**
 * Creates an avatar state manager instance
 */
export const createAvatarStateManager = (
  initialState?: Partial<AvatarState>
): AvatarStateManager => {
  let state: AvatarState = {
    ...createInitialAvatarState(),
    ...initialState,
  };

  const updateFromFormData = (formData: Partial<UserProfile>): void => {
    const previousState = { ...state };
    const newState = { ...state };

    // Update personal characteristics
    if (formData.gender !== undefined) {
      newState.gender = formData.gender === 'prefer-not-to-say' ? 'neutral' : formData.gender;
    }
    if (formData.age !== undefined) {
      newState.age = formData.age;
    }

    // Update family structure
    if (formData.maritalStatus !== undefined) {
      newState.maritalStatus = formData.maritalStatus;
    }
    if (formData.hasChildren !== undefined) {
      newState.hasChildren = formData.hasChildren;
      newState.childrenCount = formData.childrenAges?.length || 0;
    }

    // Update location and lifestyle
    if (formData.district !== undefined) {
      newState.district = formData.district;
    }
    if (formData.incomeRange !== undefined) {
      newState.incomeRange = formData.incomeRange;
    }
    if (formData.educationLevel !== undefined) {
      newState.educationLevel = formData.educationLevel;
    }
    if (formData.transportationMode !== undefined) {
      newState.transportationModes = formData.transportationMode;
    }
    if (formData.healthConditions !== undefined) {
      newState.healthConditions = formData.healthConditions;
    }

    // Check if any visual elements have changed to trigger animations
    const hasVisualChanges = 
      previousState.gender !== newState.gender ||
      previousState.maritalStatus !== newState.maritalStatus ||
      previousState.hasChildren !== newState.hasChildren ||
      previousState.childrenCount !== newState.childrenCount ||
      previousState.district !== newState.district ||
      previousState.educationLevel !== newState.educationLevel ||
      JSON.stringify(previousState.transportationModes) !== JSON.stringify(newState.transportationModes) ||
      JSON.stringify(previousState.healthConditions) !== JSON.stringify(newState.healthConditions);

    if (hasVisualChanges) {
      newState.isAnimating = true;
      // Reset animation flag after a short delay (handled by consuming components)
    }

    state = newState;
  };

  const getVisibleElements = (): string[] => {
    const elements: string[] = [];

    if (state.gender) elements.push('main-person');
    if (state.maritalStatus === 'married') elements.push('spouse');
    if (state.hasChildren) elements.push('children');
    if (state.district) elements.push('location');
    if (state.transportationModes.length > 0) elements.push('transportation');
    if (state.educationLevel) elements.push('education');
    if (state.healthConditions.length > 0) elements.push('health');

    return elements;
  };

  const shouldAnimate = (elementId: string): boolean => {
    return state.isAnimating && !state.completedSteps.includes(elementId);
  };

  const markStepCompleted = (stepId: string): void => {
    if (!state.completedSteps.includes(stepId)) {
      state = {
        ...state,
        completedSteps: [...state.completedSteps, stepId],
      };
    }
  };

  return {
    get state() {
      return state;
    },
    updateFromFormData,
    getVisibleElements,
    shouldAnimate,
    markStepCompleted,
  };
};

/**
 * Mock profile data for testing avatar system
 */
export const MOCK_AVATAR_PROFILE: UserProfile = {
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
};

/**
 * Creates a mock avatar state for testing
 */
export const getMockAvatarState = (): AvatarState => {
  const manager = createAvatarStateManager();
  manager.updateFromFormData(MOCK_AVATAR_PROFILE);
  return manager.state;
};