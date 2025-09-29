'use client';

import { useMemo } from 'react';
import type { UserProfile } from '@/types';
import { createAvatarStateManager } from '@/lib/avatar/state-manager';
import { createAvatarConfig } from '@/lib/avatar/config';
import { AvatarContainer } from './AvatarContainer';

interface PersonAvatarOverviewProps {
  formData: Partial<UserProfile>;
  currentStep: string;
  className?: string;
}

/**
 * Main avatar overview component that displays a visual representation
 * of the user based on their form data and current step progress
 */
export const PersonAvatarOverview: React.FC<PersonAvatarOverviewProps> = ({
  formData,
  currentStep,
  className = '',
}) => {
  // Create avatar state manager and update with form data
  const avatarState = useMemo(() => {
    const manager = createAvatarStateManager();
    manager.updateFromFormData(formData);
    return manager.state;
  }, [formData]);

  // Create avatar configuration
  const config = useMemo(() => createAvatarConfig(), []);

  return (
    <div 
      className={`w-full ${className}`}
      data-testid="avatar-overview"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Your Profile
        </h3>
        <p className="text-sm text-gray-600">
          Watch your avatar build as you complete each step
        </p>
      </div>

      {/* Avatar Container */}
      <div className="relative">
        <AvatarContainer 
          state={avatarState} 
          config={config}
          currentStep={currentStep}
        />
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">
          {avatarState.gender ? (
            <span className="text-blue-600 font-medium">
              Profile building...
            </span>
          ) : (
            <span>
              Start the assessment to see your avatar
            </span>
          )}
        </div>
      </div>
    </div>
  );
};