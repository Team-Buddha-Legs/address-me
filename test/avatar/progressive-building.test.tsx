import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PersonAvatarOverview } from '@/components/avatar/PersonAvatarOverview';
import type { UserProfile } from '@/types';

// Mock the form data sync hook
vi.mock('@/lib/avatar/useFormAvatarSync', () => ({
  useFormAvatarSync: vi.fn(),
}));

const mockUseFormAvatarSync = vi.mocked(
  await import('@/lib/avatar/useFormAvatarSync')
).useFormAvatarSync;

describe('Progressive Avatar Building', () => {
  beforeEach(() => {
    // Clear session storage before each test
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show placeholder when no form data is provided', () => {
    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
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
      },
      visibleElements: [],
      shouldElementAnimate: () => false,
      isAnimating: false,
      getAllFormData: () => ({}),
    });

    render(
      <PersonAvatarOverview 
        formData={{}} 
        currentStep="personal-info" 
      />
    );

    expect(screen.getByText('Start the assessment to see your avatar')).toBeInTheDocument();
  });

  it('should show main person icon when gender is selected', () => {
    const formData: Partial<UserProfile> = {
      gender: 'male',
    };

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'male',
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
        completedSteps: ['personal-info'],
      },
      visibleElements: ['main-person'],
      shouldElementAnimate: (elementId: string) => elementId === 'main-person',
      isAnimating: true,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="personal-info" 
      />
    );

    expect(screen.getByText('Updating avatar...')).toBeInTheDocument();
  });

  it('should add spouse when marital status is married', () => {
    const formData: Partial<UserProfile> = {
      gender: 'male',
      maritalStatus: 'married',
    };

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'male',
        age: null,
        maritalStatus: 'married',
        hasChildren: false,
        childrenCount: 0,
        district: null,
        incomeRange: null,
        educationLevel: null,
        transportationModes: [],
        healthConditions: [],
        isAnimating: false,
        completedSteps: ['personal-info'],
      },
      visibleElements: ['main-person', 'spouse'],
      shouldElementAnimate: (elementId: string) => elementId === 'spouse',
      isAnimating: false,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="personal-info" 
      />
    );

    expect(screen.getByText('2 elements visible')).toBeInTheDocument();
  });

  it('should show children when hasChildren is true', () => {
    const formData: Partial<UserProfile> = {
      gender: 'female',
      hasChildren: true,
      childrenAges: [5, 8],
    };

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'female',
        age: null,
        maritalStatus: null,
        hasChildren: true,
        childrenCount: 2,
        district: null,
        incomeRange: null,
        educationLevel: null,
        transportationModes: [],
        healthConditions: [],
        isAnimating: false,
        completedSteps: ['personal-info', 'family'],
      },
      visibleElements: ['main-person', 'children'],
      shouldElementAnimate: (elementId: string) => elementId === 'children',
      isAnimating: false,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="family" 
      />
    );

    expect(screen.getByText('2 elements visible')).toBeInTheDocument();
  });

  it('should display transportation icons based on form selections', () => {
    const formData: Partial<UserProfile> = {
      gender: 'male',
      transportationMode: ['bus', 'mtr'],
    };

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'male',
        age: null,
        maritalStatus: null,
        hasChildren: false,
        childrenCount: 0,
        district: null,
        incomeRange: null,
        educationLevel: null,
        transportationModes: ['bus', 'mtr'],
        healthConditions: [],
        isAnimating: false,
        completedSteps: ['personal-info', 'education-transport'],
      },
      visibleElements: ['main-person', 'transportation'],
      shouldElementAnimate: (elementId: string) => elementId === 'transportation',
      isAnimating: false,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="education-transport" 
      />
    );

    expect(screen.getByText('2 elements visible')).toBeInTheDocument();
  });

  it('should show education indicator based on education level', () => {
    const formData: Partial<UserProfile> = {
      gender: 'female',
      educationLevel: 'bachelor',
    };

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'female',
        age: null,
        maritalStatus: null,
        hasChildren: false,
        childrenCount: 0,
        district: null,
        incomeRange: null,
        educationLevel: 'bachelor',
        transportationModes: [],
        healthConditions: [],
        isAnimating: false,
        completedSteps: ['personal-info', 'education-transport'],
      },
      visibleElements: ['main-person', 'education'],
      shouldElementAnimate: (elementId: string) => elementId === 'education',
      isAnimating: false,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="education-transport" 
      />
    );

    expect(screen.getByText('2 elements visible')).toBeInTheDocument();
  });

  it('should display health indicators when health conditions are provided', () => {
    const formData: Partial<UserProfile> = {
      gender: 'male',
      healthConditions: ['diabetes'],
    };

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'male',
        age: null,
        maritalStatus: null,
        hasChildren: false,
        childrenCount: 0,
        district: null,
        incomeRange: null,
        educationLevel: null,
        transportationModes: [],
        healthConditions: ['diabetes'],
        isAnimating: false,
        completedSteps: ['personal-info', 'health'],
      },
      visibleElements: ['main-person', 'health'],
      shouldElementAnimate: (elementId: string) => elementId === 'health',
      isAnimating: false,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="health" 
      />
    );

    expect(screen.getByText('2 elements visible')).toBeInTheDocument();
  });

  it('should handle complete mock profile with all elements', () => {
    const mockProfile: UserProfile = {
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

    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'male',
        age: 30,
        maritalStatus: 'single',
        hasChildren: true,
        childrenCount: 1,
        district: 'central-western',
        incomeRange: '20k-30k',
        educationLevel: 'bachelor',
        transportationModes: ['bus', 'mtr'],
        healthConditions: ['diabetes'],
        isAnimating: false,
        completedSteps: ['personal-info', 'location', 'family', 'education-transport', 'health'],
      },
      visibleElements: ['main-person', 'children', 'location', 'transportation', 'education', 'health'],
      shouldElementAnimate: () => false,
      isAnimating: false,
      getAllFormData: () => mockProfile,
    });

    render(
      <PersonAvatarOverview 
        formData={mockProfile} 
        currentStep="health" 
      />
    );

    expect(screen.getByText('6 elements visible')).toBeInTheDocument();
  });

  it('should only show elements appropriate for current step', () => {
    const formData: Partial<UserProfile> = {
      gender: 'male',
      maritalStatus: 'married',
      hasChildren: true,
      childrenAges: [5],
      educationLevel: 'bachelor',
      transportationMode: ['bus'],
      healthConditions: ['diabetes'],
    };

    // Simulate being on the family step - should only show personal and family elements
    mockUseFormAvatarSync.mockReturnValue({
      avatarState: {
        gender: 'male',
        age: null,
        maritalStatus: 'married',
        hasChildren: true,
        childrenCount: 1,
        district: null,
        incomeRange: null,
        educationLevel: 'bachelor',
        transportationModes: ['bus'],
        healthConditions: ['diabetes'],
        isAnimating: false,
        completedSteps: ['personal-info', 'family'],
      },
      visibleElements: ['main-person', 'spouse', 'children'], // Only elements for completed steps
      shouldElementAnimate: () => false,
      isAnimating: false,
      getAllFormData: () => formData,
    });

    render(
      <PersonAvatarOverview 
        formData={formData} 
        currentStep="family" 
      />
    );

    expect(screen.getByText('3 elements visible')).toBeInTheDocument();
  });
});