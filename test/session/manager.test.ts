import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionManager } from '@/lib/session/manager';
import type { UserProfile, PersonalizedSummary } from '@/types';

// Mock sessionStorage
const mockSessionStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => mockSessionStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockSessionStorage.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockSessionStorage.store[key];
  }),
  clear: vi.fn(() => {
    mockSessionStorage.store = {};
  }),
};

// Mock window object
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

const mockUserProfile: UserProfile = {
  age: 30,
  gender: 'male',
  maritalStatus: 'single',
  district: 'central-western',
  incomeRange: '30k-50k',
  employmentStatus: 'employed-full-time',
  housingType: 'private-rental',
  hasChildren: false,
  educationLevel: 'bachelor',
  transportationMode: ['mtr', 'bus'],
};

const mockSummary: PersonalizedSummary = {
  overallScore: 85,
  relevantAreas: [],
  majorUpdates: [],
  recommendations: [],
  generatedAt: new Date('2024-01-15T10:30:00Z'),
};

describe('SessionManager', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('Session ID Management', () => {
    it('should generate a unique session ID', () => {
      const id1 = SessionManager.generateSessionId();
      const id2 = SessionManager.generateSessionId();
      
      expect(id1).toMatch(/^session-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^session-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should initialize a new session', () => {
      const sessionId = SessionManager.initializeSession();
      
      expect(sessionId).toMatch(/^session-\d+-[a-z0-9]+$/);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('address-me-session-id', sessionId);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('address-me-session-created', expect.any(String));
    });

    it('should get existing session ID', () => {
      const existingId = 'session-123-abc';
      mockSessionStorage.store['address-me-session-id'] = existingId;
      mockSessionStorage.store['address-me-session-created'] = new Date().toISOString();
      
      const sessionId = SessionManager.getSessionId();
      
      expect(sessionId).toBe(existingId);
    });

    it('should create new session if none exists', () => {
      const sessionId = SessionManager.getSessionId();
      
      expect(sessionId).toMatch(/^session-\d+-[a-z0-9]+$/);
      expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Session Expiration', () => {
    it('should detect expired session', () => {
      const expiredDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      mockSessionStorage.store['address-me-session-created'] = expiredDate.toISOString();
      
      const isExpired = SessionManager.isSessionExpired();
      
      expect(isExpired).toBe(true);
    });

    it('should detect valid session', () => {
      const recentDate = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago
      mockSessionStorage.store['address-me-session-created'] = recentDate.toISOString();
      
      const isExpired = SessionManager.isSessionExpired();
      
      expect(isExpired).toBe(false);
    });

    it('should treat missing creation date as expired', () => {
      const isExpired = SessionManager.isSessionExpired();
      
      expect(isExpired).toBe(true);
    });
  });

  describe('User Profile Management', () => {
    it('should save and retrieve user profile', () => {
      SessionManager.saveUserProfile(mockUserProfile);
      const retrieved = SessionManager.getUserProfile();
      
      expect(retrieved).toEqual(mockUserProfile);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'address-me-user-profile',
        JSON.stringify(mockUserProfile)
      );
    });

    it('should return null when no profile exists', () => {
      const profile = SessionManager.getUserProfile();
      
      expect(profile).toBeNull();
    });

    it('should handle JSON parse errors gracefully', () => {
      mockSessionStorage.store['address-me-user-profile'] = 'invalid-json';
      
      const profile = SessionManager.getUserProfile();
      
      expect(profile).toBeNull();
    });
  });

  describe('Form Step Management', () => {
    it('should save and retrieve current step', () => {
      SessionManager.saveCurrentStep(3);
      const step = SessionManager.getCurrentStep();
      
      expect(step).toBe(3);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('address-me-current-step', '3');
    });

    it('should return 1 as default step', () => {
      const step = SessionManager.getCurrentStep();
      
      expect(step).toBe(1);
    });
  });

  describe('Form Data Management', () => {
    it('should save and retrieve form data', () => {
      const formData = { field1: 'value1', field2: 'value2' };
      
      SessionManager.saveFormData(formData);
      const retrieved = SessionManager.getFormData();
      
      expect(retrieved).toEqual(formData);
    });

    it('should merge form data with existing data', () => {
      const initialData = { field1: 'value1' };
      const additionalData = { field2: 'value2' };
      
      SessionManager.saveFormData(initialData);
      SessionManager.saveFormData(additionalData);
      const retrieved = SessionManager.getFormData();
      
      expect(retrieved).toEqual({ field1: 'value1', field2: 'value2' });
    });

    it('should return empty object when no form data exists', () => {
      const formData = SessionManager.getFormData();
      
      expect(formData).toEqual({});
    });
  });

  describe('Summary Management', () => {
    it('should save and retrieve summary with date conversion', () => {
      SessionManager.saveSummary(mockSummary);
      const retrieved = SessionManager.getSummary();
      
      expect(retrieved).toEqual(mockSummary);
      expect(retrieved?.generatedAt).toBeInstanceOf(Date);
    });

    it('should return null when no summary exists', () => {
      const summary = SessionManager.getSummary();
      
      expect(summary).toBeNull();
    });
  });

  describe('Session Clearing', () => {
    it('should clear all session data', () => {
      // Set up some data
      SessionManager.saveUserProfile(mockUserProfile);
      SessionManager.saveCurrentStep(3);
      SessionManager.saveFormData({ test: 'data' });
      
      SessionManager.clearSession();
      
      expect(SessionManager.getUserProfile()).toBeNull();
      expect(SessionManager.getCurrentStep()).toBe(1);
      expect(SessionManager.getFormData()).toEqual({});
    });

    it('should clear only assessment data, keeping session ID', () => {
      const sessionId = SessionManager.initializeSession();
      SessionManager.saveUserProfile(mockUserProfile);
      SessionManager.saveCurrentStep(3);
      
      SessionManager.clearAssessmentData();
      
      expect(SessionManager.getSessionId()).toBe(sessionId);
      expect(SessionManager.getUserProfile()).toBeNull();
      expect(SessionManager.getCurrentStep()).toBe(1);
    });
  });

  describe('Assessment Status', () => {
    it('should detect active assessment with profile', () => {
      SessionManager.saveUserProfile(mockUserProfile);
      
      const hasActive = SessionManager.hasActiveAssessment();
      
      expect(hasActive).toBe(true);
    });

    it('should detect active assessment with form step > 1', () => {
      SessionManager.saveCurrentStep(2);
      
      const hasActive = SessionManager.hasActiveAssessment();
      
      expect(hasActive).toBe(true);
    });

    it('should detect active assessment with form data', () => {
      SessionManager.saveFormData({ field: 'value' });
      
      const hasActive = SessionManager.hasActiveAssessment();
      
      expect(hasActive).toBe(true);
    });

    it('should detect no active assessment when clean', () => {
      const hasActive = SessionManager.hasActiveAssessment();
      
      expect(hasActive).toBe(false);
    });

    it('should detect completed assessment', () => {
      SessionManager.saveSummary(mockSummary);
      SessionManager.saveReportId('test-report-123');
      
      const hasCompleted = SessionManager.hasCompletedAssessment();
      
      expect(hasCompleted).toBe(true);
    });

    it('should detect incomplete assessment', () => {
      const hasCompleted = SessionManager.hasCompletedAssessment();
      
      expect(hasCompleted).toBe(false);
    });
  });
});