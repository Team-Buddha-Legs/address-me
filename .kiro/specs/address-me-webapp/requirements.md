# Requirements Document

## Introduction

AddressMe is a Next.js web application that provides personalized AI-powered summaries of Hong Kong's 2025-2026 Policy Address to individual citizens. The application collects user profile information through an interactive form and generates tailored summaries highlighting relevant policies, impacts, and recommendations based on the user's personal circumstances such as age, gender, marital status, district, and income range.

## Requirements

### Requirement 1

**User Story:** As a Hong Kong citizen, I want to provide my personal profile information through an intuitive multi-page form, so that I can receive a personalized summary of the Policy Address relevant to my circumstances.

#### Acceptance Criteria

1. WHEN a user visits the application THEN the system SHALL present a multi-page form journey with professional blue primary color, green secondary color, and orange accent color
2. WHEN a user progresses through form pages THEN the system SHALL display smooth animations and good graphics for each transition
3. WHEN a user completes each form page THEN the system SHALL validate the input and allow progression to the next page
4. IF a user provides invalid input THEN the system SHALL display clear error messages and prevent progression
5. WHEN a user completes the form THEN the system SHALL collect age, gender, marriage status, district, income range, and other relevant profile data

### Requirement 2

**User Story:** As a Hong Kong citizen, I want to receive a personalized AI-generated summary of the Policy Address, so that I can understand what policies matter most to me without reading the entire document.

#### Acceptance Criteria

1. WHEN a user submits their profile information THEN the system SHALL generate a personalized summary using pre-digested Policy Address content and user context
2. WHEN generating the summary THEN the system SHALL include an overall policy score (minimum 70%) for the user's profile
3. WHEN displaying results THEN the system SHALL organize content into expandable sections for different areas (transportation, housing, etc.)
4. WHEN showing policy impacts THEN the system SHALL highlight relevant points with detailed explanations for each area
5. WHEN presenting the summary THEN the system SHALL include major city plans or updates the user should be aware of
6. WHEN completing the analysis THEN the system SHALL provide personalized recommendations for maximizing benefits from the Policy Address

### Requirement 3

**User Story:** As a Hong Kong citizen, I want to view my personalized summary in a well-organized report format, so that I can easily understand and navigate through the relevant information.

#### Acceptance Criteria

1. WHEN the summary is generated THEN the system SHALL display results on a single responsive page optimized for mobile devices
2. WHEN displaying the report THEN the system SHALL show all sections expanded by default with toggle functionality for each section
3. WHEN a user interacts with section toggles THEN the system SHALL smoothly expand or collapse content with appropriate animations
4. WHEN viewing on desktop THEN the system SHALL provide a reasonably scaled responsive version of the mobile layout
5. WHEN displaying content THEN the system SHALL maintain professional blue, green, and orange color scheme throughout

### Requirement 4

**User Story:** As a Hong Kong citizen, I want to download my personalized summary and retake the assessment, so that I can save the information for later reference or update my profile if circumstances change.

#### Acceptance Criteria

1. WHEN viewing the summary report THEN the system SHALL provide a download option for the results in text or PDF format
2. WHEN a user requests download THEN the system SHALL generate and deliver the file containing the complete personalized summary
3. WHEN a user wants to retake the assessment THEN the system SHALL provide a clear option to restart the process
4. WHEN restarting THEN the system SHALL clear previous data and return to the initial form page
5. WHEN downloading or restarting THEN the system SHALL maintain user data privacy and security

### Requirement 5

**User Story:** As a system administrator, I want the application to be secure and use swappable AI integration, so that we can protect our backend endpoints and easily switch between different AI providers.

#### Acceptance Criteria

1. WHEN implementing backend functionality THEN the system SHALL use Next.js 15 server actions with appropriate security measures
2. WHEN protecting endpoints THEN the system SHALL implement rate limiting, input validation, and other security measures without requiring user authentication
3. WHEN integrating AI services THEN the system SHALL use a swappable architecture that allows switching between different AI providers
4. WHEN processing user data THEN the system SHALL ensure data privacy and not store personal information unnecessarily
5. WHEN handling AI requests THEN the system SHALL implement error handling and fallback mechanisms for service availability