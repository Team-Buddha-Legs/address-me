import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PersonAvatarOverview } from '@/components/avatar/PersonAvatarOverview';
import { AvatarContainer } from '@/components/avatar/AvatarContainer';
import { createAvatarConfig } from '@/lib/avatar/config';
import { createInitialAvatarState } from '@/lib/avatar/state-manager';
import type { UserProfile } from '@/types';

describe('Avatar Container Components', () => {
  const mockFormData: Partial<UserProfile> = {
    gender: 'male',
    age: 30,
    maritalStatus: 'single',
    district: 'central-western',
    hasChildren: true,
    childrenAges: [5],
    educationLevel: 'bachelor',
    transportationMode: ['bus', 'mtr'],
    healthConditions: ['diabetes'],
  };

  describe('PersonAvatarOverview', () => {
    it('should render with form data', () => {
      render(
        <PersonAvatarOverview 
          formData={mockFormData} 
          currentStep="personal-info" 
        />
      );
      
      expect(screen.getByTestId('avatar-overview')).toBeInTheDocument();
      expect(screen.getByText('Your Profile')).toBeInTheDocument();
    });

    it('should show placeholder when no form data', () => {
      render(
        <PersonAvatarOverview 
          formData={{}} 
          currentStep="personal-info" 
        />
      );
      
      expect(screen.getByText('Start the assessment to see your avatar')).toBeInTheDocument();
    });
  });

  describe('AvatarContainer', () => {
    it('should render with avatar state', () => {
      const state = createInitialAvatarState();
      state.gender = 'male';
      const config = createAvatarConfig();
      
      render(
        <AvatarContainer 
          state={state} 
          config={config} 
          currentStep="personal-info" 
        />
      );
      
      expect(screen.getByTestId('avatar-container')).toBeInTheDocument();
    });

    it('should show placeholder when no elements visible', () => {
      const state = createInitialAvatarState();
      const config = createAvatarConfig();
      
      render(
        <AvatarContainer 
          state={state} 
          config={config} 
          currentStep="personal-info" 
        />
      );
      
      expect(screen.getByTestId('avatar-placeholder')).toBeInTheDocument();
      expect(screen.getByText('Your avatar will appear here')).toBeInTheDocument();
    });
  });
});