# Requirements Document

## Introduction

The Dynamic Person Avatar feature enhances the Address Me assessment form by providing a visual representation of the user that updates progressively as they complete each step. This avatar serves as both a progress indicator and an engaging visual element that reflects the user's selections in real-time, making the form experience more interactive and personalized.

## Requirements

### Requirement 1

**User Story:** As a Hong Kong citizen completing the assessment form, I want to see a visual avatar that represents me and updates as I progress through each step, so that I can see my profile building up visually and feel more engaged with the process.

#### Acceptance Criteria

1. WHEN a user starts the assessment THEN the system SHALL display a placeholder avatar area with a generic person icon
2. WHEN a user completes the gender selection THEN the system SHALL update the avatar to show a gender-appropriate icon (male/female/neutral)
3. WHEN a user selects marital status as "married" THEN the system SHALL add a companion figure to the avatar display
4. WHEN a user indicates they have children THEN the system SHALL add child figure(s) to the avatar family representation
5. WHEN a user completes each step THEN the system SHALL smoothly animate the avatar updates with appropriate transitions

### Requirement 2

**User Story:** As a Hong Kong citizen using the assessment form, I want the avatar to reflect my specific demographic and lifestyle choices, so that I can see a personalized representation that matches my selections.

#### Acceptance Criteria

1. WHEN a user selects their district THEN the system SHALL display a location indicator or background element representing their area
2. WHEN a user selects their income range THEN the system SHALL update visual elements to reflect economic status (e.g., clothing style, accessories)
3. WHEN a user selects transportation modes THEN the system SHALL display relevant transportation icons around or near the avatar
4. WHEN a user selects education level THEN the system SHALL add appropriate visual indicators (e.g., graduation cap for higher education)
5. WHEN a user enters health conditions THEN the system SHALL add relevant health-related visual indicators (e.g., medical symbol for diabetes)

### Requirement 3

**User Story:** As a user progressing through the assessment, I want the avatar area to be visually appealing and consistent with the application's design, so that it feels integrated and professional.

#### Acceptance Criteria

1. WHEN displaying the avatar area THEN the system SHALL use the application's color scheme (blue primary, green secondary, orange accent)
2. WHEN showing avatar updates THEN the system SHALL use smooth CSS transitions and animations lasting 300-500ms
3. WHEN displaying on mobile devices THEN the system SHALL ensure the avatar area is appropriately sized and responsive
4. WHEN showing multiple elements (family, icons) THEN the system SHALL arrange them in a visually balanced and clear layout
5. WHEN the avatar is incomplete THEN the system SHALL use subtle visual cues to indicate areas that will be filled as the user progresses

### Requirement 4

**User Story:** As a developer maintaining the application, I want the avatar system to be modular and easily extensible, so that new visual elements can be added as the form evolves.

#### Acceptance Criteria

1. WHEN implementing the avatar system THEN the system SHALL use a component-based architecture with reusable icon components
2. WHEN adding new avatar elements THEN the system SHALL support easy addition of new icons and visual indicators
3. WHEN managing avatar state THEN the system SHALL integrate with the existing form state management system
4. WHEN rendering icons THEN the system SHALL use SVG-based icons for scalability and performance
5. WHEN updating the avatar THEN the system SHALL maintain performance with smooth animations even with multiple elements

### Requirement 5

**User Story:** As a user with the mock profile settings (male, single, Central & Western, HK$20,000-30,000, 1 child, bachelor's degree, bus & MTR, diabetes), I want to see a complete avatar representation, so that I can verify the system works correctly with a full profile.

#### Acceptance Criteria

1. WHEN using the mock profile THEN the system SHALL display a male avatar icon
2. WHEN using the mock profile THEN the system SHALL show a single child figure alongside the main avatar
3. WHEN using the mock profile THEN the system SHALL display Central & Western district indicator
4. WHEN using the mock profile THEN the system SHALL show bus and MTR transportation icons
5. WHEN using the mock profile THEN the system SHALL display education (graduation cap) and health (medical symbol) indicators
6. WHEN the mock profile is complete THEN the system SHALL show all elements in a cohesive, visually appealing layout