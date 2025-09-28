# Implementation Plan

- [x] 1. Set up project foundation and type definitions

  - Update package.json with required dependencies (framer-motion, react-hook-form, zod, @react-pdf/renderer, @aws-sdk/client-bedrock-runtime)
  - Create TypeScript type definitions for UserProfile, PolicyContent, PersonalizedSummary interfaces
  - Set up custom Tailwind color scheme with CSS variables for professional blue, green, and orange
  - Update root layout with proper metadata and color scheme
  - _Requirements: 1.1, 3.1, 5.3_

- [x] 2. Implement core utility functions and validation

  - Create Zod schemas for form validation (user profile, form steps)
  - Implement pure utility functions for data processing and validation
  - Write unit tests for validation functions and utility helpers
  - Create Hong Kong specific enums (districts, income ranges, housing types)
  - _Requirements: 1.3, 1.4, 5.4_

- [x] 3. Build multi-page form system foundation
- [x] 3.1 Create form step configuration and routing

  - Define form step configuration with questions, validation, and flow logic
  - Implement dynamic routing structure for `/assessment/[step]` pages
  - Create form step navigation utilities and progress calculation functions
  - Write unit tests for form step logic and navigation
  - _Requirements: 1.1, 1.2_

- [x] 3.2 Implement form components and validation

  - Build reusable form input components (select, radio, checkbox, number input)
  - Implement form step wrapper component with progress indicator
  - Add real-time validation with error display components
  - Create form state management using React Hook Form
  - Write component tests for form inputs and validation
  - _Requirements: 1.3, 1.4, 3.1_

- [x] 3.3 Add animations and responsive design

  - Implement smooth page transitions using Framer Motion
  - Create responsive mobile-first layouts for form pages
  - Add loading states and micro-interactions for better UX
  - Implement back/next navigation with proper state management
  - Test animations and responsiveness across different screen sizes
  - _Requirements: 1.2, 3.4, 3.5_

- [x] 4. Create AI integration and policy analysis system
- [x] 4.1 Implement swappable AI provider architecture

  - Create functional AI provider interface with configuration types
  - Implement AWS Bedrock provider as initial AI service (Claude or Titan models)
  - Build AI service factory function for provider switching
  - Write unit tests with mocked AI responses
  - _Requirements: 2.1, 5.3_

- [x] 4.2 Build policy content processing functions

  - Create mock policy content data structure for Hong Kong Policy Address
  - Implement policy analysis functions that match user profiles to relevant content
  - Build scoring algorithm for policy relevance (minimum 70% score requirement)
  - Write unit tests for policy matching and scoring logic
  - _Requirements: 2.1, 2.2_

- [x] 4.3 Implement personalized summary generation

  - Create summary generation function that combines user profile with policy analysis
  - Implement recommendation engine for actionable advice
  - Build content categorization for different policy areas (housing, transport, etc.)
  - Add error handling and fallback mechanisms for AI service failures
  - Write integration tests for complete summary generation flow
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 5. Build report display and interaction system
- [x] 5.1 Create report page layout and components

  - Implement single-page report layout with overall score display
  - Build expandable section components for different policy areas
  - Create toggle functionality for section expansion/collapse
  - Add responsive design optimized for mobile viewing
  - Write component tests for report display and interactions
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [x] 5.2 Implement report content rendering

  - Create components for displaying policy relevance scores and explanations
  - Build recommendation display components with actionable advice
  - Implement major city updates section with expandable details
  - Add proper typography and spacing using Tailwind classes
  - Test content rendering with various summary data structures
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 3.3_

- [x] 6. Add download and retry functionality
- [x] 6.1 Implement report download system

  - Create PDF generation function using React-PDF
  - Build download trigger components with proper file naming
  - Add loading states and error handling for download operations
  - Write tests for PDF generation
  - _Requirements: 4.1, 4.2_

- [x] 6.2 Add assessment retry functionality

  - Implement "retake assessment" functionality with data clearing
  - Create session management for temporary data storage
  - Add confirmation dialogs for restarting the process
  - Ensure proper cleanup of previous assessment data
  - Write tests for retry flow and data management
  - _Requirements: 4.3, 4.4_

- [x] 7. Implement security measures and server actions
- [x] 7.1 Create secure server actions

  - Implement Next.js server actions for form processing and AI integration
  - Add input sanitization and validation on server side
  - Create rate limiting middleware for API protection
  - Implement CSRF protection and security headers
  - Write security tests and validate protection mechanisms
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 7.2 Add session management and data privacy

  - Implement temporary session storage without persistent data
  - Create data expiration and cleanup mechanisms
  - Add privacy-focused data handling throughout the application
  - Implement proper error logging without exposing sensitive data
  - Write tests for data privacy and session management
  - _Requirements: 5.4, 5.5_

- [x] 8. Create landing page and user flow integration
- [x] 8.1 Build landing page with clear value proposition

  - Create hero section with professional blue gradient background
  - Implement "Start Assessment" call-to-action button
  - Add brief process explanation and benefits overview
  - Ensure responsive design and proper navigation to assessment
  - Write tests for landing page functionality and navigation
  - _Requirements: 1.1, 3.4, 3.5_

- [x] 8.2 Implement processing page and flow transitions

  - Create loading/processing page with progress animations
  - Add estimated completion time and status updates
  - Implement smooth transitions between form, processing, and report pages
  - Add proper error handling and user feedback throughout the flow
  - Write end-to-end tests for complete user journey
  - _Requirements: 2.1, 3.3_

- [x] 9. Add final polish and optimization
<!-- - [ ] 9.1 Implement performance optimizations

  - Add code splitting for heavy components and AI providers
  - Optimize bundle size and implement lazy loading where appropriate
  - Add proper caching strategies for static content
  - Implement Core Web Vitals monitoring and optimization
  - Write performance tests and validate optimization results
  - _Requirements: 3.4, 3.5_ -->

- [x] 9.2 Complete testing and error handling
  - Add comprehensive error boundaries and fallback UI components
  - Implement graceful degradation for JavaScript-disabled users
  <!-- - Create comprehensive end-to-end test suite covering all user flows -->
  <!-- - Add accessibility testing and WCAG compliance validation -->
  <!-- - Perform final integration testing and bug fixes -->
  - _Requirements: 1.4, 2.1, 3.3, 4.4, 5.5_
