import type { UserProfile, PersonalizedSummary, UserSession } from '@/types';

// Session storage keys
const SESSION_KEYS = {
  USER_PROFILE: 'address-me-user-profile',
  CURRENT_STEP: 'address-me-current-step',
  FORM_DATA: 'address-me-form-data',
  REPORT_ID: 'address-me-report-id',
  SUMMARY: 'address-me-summary',
  SESSION_ID: 'address-me-session-id',
  SESSION_CREATED: 'address-me-session-created',
} as const;

// Session expiration time (24 hours)
const SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export class SessionManager {
  /**
   * Generate a new session ID
   */
  static generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize a new session
   */
  static initializeSession(): string {
    const sessionId = this.generateSessionId();
    const now = new Date().toISOString();
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEYS.SESSION_ID, sessionId);
      sessionStorage.setItem(SESSION_KEYS.SESSION_CREATED, now);
    }
    
    return sessionId;
  }

  /**
   * Get current session ID, creating one if it doesn't exist
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') {
      return this.generateSessionId();
    }

    let sessionId = sessionStorage.getItem(SESSION_KEYS.SESSION_ID);
    
    if (!sessionId || this.isSessionExpired()) {
      sessionId = this.initializeSession();
    }
    
    return sessionId;
  }

  /**
   * Check if current session is expired
   */
  static isSessionExpired(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const createdAt = sessionStorage.getItem(SESSION_KEYS.SESSION_CREATED);
    if (!createdAt) {
      return true;
    }

    const sessionAge = Date.now() - new Date(createdAt).getTime();
    return sessionAge > SESSION_EXPIRATION_MS;
  }

  /**
   * Save user profile to session
   */
  static saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(SESSION_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile to session:', error);
    }
  }

  /**
   * Get user profile from session
   */
  static getUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    try {
      const profileData = sessionStorage.getItem(SESSION_KEYS.USER_PROFILE);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Failed to retrieve user profile from session:', error);
      return null;
    }
  }

  /**
   * Save current form step
   */
  static saveCurrentStep(step: number): void {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(SESSION_KEYS.CURRENT_STEP, step.toString());
  }

  /**
   * Get current form step
   */
  static getCurrentStep(): number {
    if (typeof window === 'undefined') return 1;

    const step = sessionStorage.getItem(SESSION_KEYS.CURRENT_STEP);
    return step ? parseInt(step, 10) : 1;
  }

  /**
   * Save partial form data
   */
  static saveFormData(data: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    try {
      const existingData = this.getFormData();
      const mergedData = { ...existingData, ...data };
      sessionStorage.setItem(SESSION_KEYS.FORM_DATA, JSON.stringify(mergedData));
    } catch (error) {
      console.error('Failed to save form data to session:', error);
    }
  }

  /**
   * Get partial form data
   */
  static getFormData(): Record<string, any> {
    if (typeof window === 'undefined') return {};

    try {
      const formData = sessionStorage.getItem(SESSION_KEYS.FORM_DATA);
      return formData ? JSON.parse(formData) : {};
    } catch (error) {
      console.error('Failed to retrieve form data from session:', error);
      return {};
    }
  }

  /**
   * Save report ID
   */
  static saveReportId(reportId: string): void {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(SESSION_KEYS.REPORT_ID, reportId);
  }

  /**
   * Get report ID
   */
  static getReportId(): string | null {
    if (typeof window === 'undefined') return null;

    return sessionStorage.getItem(SESSION_KEYS.REPORT_ID);
  }

  /**
   * Save personalized summary
   */
  static saveSummary(summary: PersonalizedSummary): void {
    if (typeof window === 'undefined') return;

    try {
      const summaryData = {
        ...summary,
        generatedAt: summary.generatedAt.toISOString(),
      };
      sessionStorage.setItem(SESSION_KEYS.SUMMARY, JSON.stringify(summaryData));
    } catch (error) {
      console.error('Failed to save summary to session:', error);
    }
  }

  /**
   * Get personalized summary
   */
  static getSummary(): PersonalizedSummary | null {
    if (typeof window === 'undefined') return null;

    try {
      const summaryData = sessionStorage.getItem(SESSION_KEYS.SUMMARY);
      if (!summaryData) return null;

      const parsed = JSON.parse(summaryData);
      return {
        ...parsed,
        generatedAt: new Date(parsed.generatedAt),
      };
    } catch (error) {
      console.error('Failed to retrieve summary from session:', error);
      return null;
    }
  }

  /**
   * Clear all session data (for retry functionality)
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;

    Object.values(SESSION_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Clear only assessment-related data (keep session ID)
   */
  static clearAssessmentData(): void {
    if (typeof window === 'undefined') return;

    const keysToKeep = [SESSION_KEYS.SESSION_ID, SESSION_KEYS.SESSION_CREATED];
    
    Object.values(SESSION_KEYS).forEach(key => {
      if (!keysToKeep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Get complete session data
   */
  static getSession(): UserSession | null {
    if (typeof window === 'undefined') return null;

    const sessionId = this.getSessionId();
    const profile = this.getUserProfile();
    const summary = this.getSummary();
    const createdAt = sessionStorage.getItem(SESSION_KEYS.SESSION_CREATED);

    if (!sessionId || !createdAt) return null;

    return {
      id: sessionId,
      profile: profile!,
      summary,
      createdAt: new Date(createdAt),
      expiresAt: new Date(new Date(createdAt).getTime() + SESSION_EXPIRATION_MS),
    };
  }

  /**
   * Check if user has an active assessment in progress
   */
  static hasActiveAssessment(): boolean {
    if (typeof window === 'undefined') return false;

    const profile = this.getUserProfile();
    const currentStep = this.getCurrentStep();
    const formData = this.getFormData();

    return !!(profile || currentStep > 1 || Object.keys(formData).length > 0);
  }

  /**
   * Check if user has completed assessment
   */
  static hasCompletedAssessment(): boolean {
    if (typeof window === 'undefined') return false;

    const summary = this.getSummary();
    const reportId = this.getReportId();

    return !!(summary && reportId);
  }
}