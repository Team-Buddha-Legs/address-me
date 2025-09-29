# Implementation Plan

- [x] 1. Create core avatar state management system

  - Implement AvatarState interface and types in a new types file
  - Create AvatarStateManager class with methods for updating state from form data
  - Write unit tests for state management logic
  - _Requirements: 4.1, 4.3_

- [x] 2. Build SVG icon component library

  - [x] 2.1 Create base icon components for person representations

    - Implement MaleIcon, FemaleIcon, and NeutralIcon SVG components
    - Create ChildIcon and SpouseIcon components
    - Add proper TypeScript interfaces for icon props
    - _Requirements: 1.2, 2.1, 5.1, 5.2_

  - [x] 2.2 Implement transportation and lifestyle icons

    - Create BusIcon, MTRIcon, and other transportation SVG components
    - Implement GraduationCapIcon for education levels
    - Create MedicalIcon for health conditions
    - Add LocationIcon for district representation
    - _Requirements: 2.2, 2.3, 2.4, 5.4, 5.5_

  - [x] 2.3 Create icon mapping and selection system
    - Implement ICON_MAPPINGS constant with all icon associations
    - Create utility functions for selecting appropriate icons based on form data
    - Add fallback icon handling for edge cases
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Develop animation system

  - [x] 3.1 Create animation hook and utilities

    - Implement useAvatarAnimations hook for managing element animations
    - Create AnimatedElement component with fadeIn, slideIn, scale, and pulse animations
    - Add useOptimizedAnimations hook for reduced motion preferences
    - _Requirements: 1.5, 3.2, 4.4_

  - [x] 3.2 Implement smooth transition system
    - Create transition utilities for avatar element updates
    - Add timing and easing configuration for consistent animations
    - Implement animation queuing for multiple simultaneous updates
    - _Requirements: 1.5, 3.2_

- [x] 4. Build main avatar container components

  - [x] 4.1 Create PersonAvatarOverview component

    - Implement main container component that receives form data and current step
    - Add responsive layout with proper mobile and desktop sizing
    - Integrate with avatar state management system
    - _Requirements: 1.1, 3.3, 3.4_

  - [x] 4.2 Implement AvatarContainer layout component

    - Create container with gradient background using app color scheme
    - Implement flexible layout system for positioning avatar elements
    - Add proper spacing and visual hierarchy for multiple elements
    - _Requirements: 3.1, 3.5_

  - [x] 4.3 Build individual avatar element components
    - Create MainPersonIcon component that renders based on gender selection
    - Implement FamilyMembers component for spouse and children
    - Create IndicatorGroup component for transportation, education, and health icons
    - Add LocationIndicator component for district representation
    - _Requirements: 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Implement progressive avatar building logic

  - [ ] 5.1 Create form data integration system

    - Implement useFormAvatarSync hook to synchronize form data with avatar state
    - Add logic to determine which avatar elements should be visible based on completed steps
    - Create system to trigger animations when new elements are added
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 5.2 Add step-by-step avatar updates
    - Implement logic to update avatar when gender is selected
    - Add spouse figure when marital status is "married"
    - Show children when hasChildren is true
    - Display transportation, education, and health indicators based on form selections
    - _Requirements: 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [ ] 6. Integrate avatar with existing form system

  - [ ] 6.1 Modify AssessmentStepClient component

    - Update component layout to include avatar overview area
    - Add responsive grid layout for form and avatar sections
    - Integrate avatar component with existing form state management
    - _Requirements: 1.1, 3.3, 3.4_

  - [ ] 6.2 Connect with FormStepWrapper
    - Modify FormStepWrapper to pass form data changes to avatar component
    - Ensure avatar updates in real-time as user progresses through steps
    - Add proper error boundaries for avatar rendering
    - _Requirements: 1.5, 4.1, 4.2_

- [ ] 7. Implement mock profile testing system

  - Create mock profile data with all specified characteristics (male, single, Central & Western, etc.)
  - Add development mode toggle to use mock profile for testing
  - Implement avatar preview with complete mock profile to verify all elements render correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 8. Add error handling and accessibility features

  - [ ] 8.1 Implement error boundaries and fallbacks

    - Create AvatarErrorBoundary component for graceful error handling
    - Add IconWithFallback component for individual icon loading failures
    - Implement placeholder avatar when rendering fails
    - _Requirements: 4.2_

  - [ ] 8.2 Add accessibility support
    - Implement AvatarDescription component for screen readers
    - Add proper ARIA labels and live regions for avatar updates
    - Ensure keyboard navigation support for interactive elements
    - _Requirements: 3.1, 3.4_

- [ ] 9. Write comprehensive tests

  - [ ] 9.1 Create unit tests for avatar components

    - Test PersonAvatarOverview component with various form data combinations
    - Test individual icon components render correctly
    - Test animation system and state management
    - _Requirements: 4.4_

  - [ ] 9.2 Add integration tests
    - Test complete avatar building flow with mock profile
    - Test avatar updates as user progresses through form steps
    - Test error handling and fallback scenarios
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 10. Optimize performance and finalize styling

  - [ ] 10.1 Implement performance optimizations

    - Add memoization for expensive avatar calculations
    - Optimize SVG icons for minimal bundle size
    - Implement lazy loading for complex animations
    - _Requirements: 4.4_

  - [ ] 10.2 Polish visual design and animations
    - Fine-tune animation timing and easing for smooth transitions
    - Ensure consistent styling with app color scheme (blue, green, orange)
    - Add final responsive design adjustments for mobile and desktop
    - Test and refine visual hierarchy and element positioning
    - _Requirements: 3.1, 3.2, 3.4, 3.5_
