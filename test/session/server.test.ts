import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  isValidSession,
  getSessionStats,
  clearAllSessions,
  extendSession,
  getSessionsByCriteria,
} from "@/lib/session/server";
import type { UserProfile } from "@/types";

describe("Server Session Management", () => {
  const mockProfile: UserProfile = {
    age: 30,
    gender: "male",
    maritalStatus: "married",
    district: "central-western",
    incomeRange: "50k-80k",
    employmentStatus: "employed-full-time",
    housingType: "private-rental",
    hasChildren: true,
    childrenAges: [5, 8],
    educationLevel: "bachelor",
    healthConditions: ["diabetes"],
    transportationMode: ["mtr", "bus"],
  };

  beforeEach(async () => {
    await clearAllSessions();
  });

  afterEach(async () => {
    await clearAllSessions();
  });

  describe("Session Creation", () => {
    it("should create a new session with generated ID", async () => {
      const session = await createSession();

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.id).toMatch(/^sess_/);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.expiresAt.getTime()).toBeGreaterThan(session.createdAt.getTime());
    });

    it("should create session with initial profile", async () => {
      const initialProfile = { age: 25 } as Partial<UserProfile>;
      const session = await createSession(initialProfile);

      expect(session.profile.age).toBe(25);
    });

    it("should create unique session IDs", async () => {
      const session1 = await createSession();
      const session2 = await createSession();

      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe("Session Retrieval", () => {
    it("should retrieve existing session", async () => {
      const createdSession = await createSession();
      const retrievedSession = await getSession(createdSession.id);

      expect(retrievedSession).toBeDefined();
      expect(retrievedSession!.id).toBe(createdSession.id);
    });

    it("should return null for non-existent session", async () => {
      const session = await getSession("non-existent-id");
      expect(session).toBeNull();
    });

    it("should return null for invalid session ID", async () => {
      const session = await getSession("");
      expect(session).toBeNull();
    });

    it("should return null for expired session", async () => {
      const session = await createSession();
      
      // Manually expire the session
      session.expiresAt = new Date(Date.now() - 1000);
      
      // Mock the session store to contain the expired session
      const retrievedSession = await getSession(session.id);
      expect(retrievedSession).toBeNull();
    });
  });

  describe("Session Updates", () => {
    it("should update session profile", async () => {
      const session = await createSession();
      const profileUpdate = { age: 35, gender: "female" as const };

      const updatedSession = await updateSession(session.id, { profile: profileUpdate });

      expect(updatedSession).toBeDefined();
      expect(updatedSession!.profile.age).toBe(35);
      expect(updatedSession!.profile.gender).toBe("female");
    });

    it("should merge profile updates", async () => {
      const session = await createSession({ age: 30 } as Partial<UserProfile>);
      const profileUpdate = { gender: "male" as const };

      const updatedSession = await updateSession(session.id, { profile: profileUpdate });

      expect(updatedSession!.profile.age).toBe(30);
      expect(updatedSession!.profile.gender).toBe("male");
    });

    it("should update session summary", async () => {
      const session = await createSession();
      const mockSummary = {
        overallScore: 85,
        relevantAreas: [],
        majorUpdates: [],
        recommendations: [],
        generatedAt: new Date(),
      };

      const updatedSession = await updateSession(session.id, { summary: mockSummary });

      expect(updatedSession!.summary).toBeDefined();
      expect(updatedSession!.summary!.overallScore).toBe(85);
    });

    it("should extend expiration on update", async () => {
      const session = await createSession();
      const originalExpiration = session.expiresAt.getTime();

      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedSession = await updateSession(session.id, { profile: { age: 31 } });

      expect(updatedSession!.expiresAt.getTime()).toBeGreaterThan(originalExpiration);
    });

    it("should return null for non-existent session update", async () => {
      const result = await updateSession("non-existent", { profile: { age: 30 } });
      expect(result).toBeNull();
    });
  });

  describe("Session Deletion", () => {
    it("should delete existing session", async () => {
      const session = await createSession();
      const deleted = await deleteSession(session.id);

      expect(deleted).toBe(true);

      const retrievedSession = await getSession(session.id);
      expect(retrievedSession).toBeNull();
    });

    it("should return false for non-existent session deletion", async () => {
      const deleted = await deleteSession("non-existent");
      expect(deleted).toBe(false);
    });

    it("should handle invalid session ID", async () => {
      const deleted = await deleteSession("");
      expect(deleted).toBe(false);
    });
  });

  describe("Session Validation", () => {
    it("should validate existing session", async () => {
      const session = await createSession();
      const isValid = await isValidSession(session.id);

      expect(isValid).toBe(true);
    });

    it("should invalidate non-existent session", async () => {
      const isValid = await isValidSession("non-existent");
      expect(isValid).toBe(false);
    });
  });

  describe("Session Extension", () => {
    it("should extend session expiration", async () => {
      const session = await createSession();
      const originalExpiration = session.expiresAt.getTime();

      await new Promise(resolve => setTimeout(resolve, 10));

      const extendedSession = await extendSession(session.id);

      expect(extendedSession).toBeDefined();
      expect(extendedSession!.expiresAt.getTime()).toBeGreaterThan(originalExpiration);
    });

    it("should return null for non-existent session extension", async () => {
      const result = await extendSession("non-existent");
      expect(result).toBeNull();
    });
  });

  describe("Session Statistics", () => {
    it("should provide accurate session statistics", async () => {
      await createSession();
      await createSession();
      await createSession();

      const stats = getSessionStats();

      expect(stats.totalSessions).toBe(3);
      expect(stats.activeSessions).toBe(3);
      expect(stats.expiredSessions).toBe(0);
    });

    it("should count expired sessions correctly", async () => {
      const session1 = await createSession();
      const session2 = await createSession();

      // Manually expire one session for testing
      session1.expiresAt = new Date(Date.now() - 1000);

      const stats = getSessionStats();

      expect(stats.totalSessions).toBe(2);
      expect(stats.activeSessions).toBe(1);
      expect(stats.expiredSessions).toBe(1);
    });
  });

  describe("Session Queries", () => {
    it("should find sessions by creation date", async () => {
      const now = new Date();
      const session1 = await createSession();
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const session2 = await createSession();

      const recentSessions = await getSessionsByCriteria({
        createdAfter: new Date(now.getTime() + 5),
      });

      expect(recentSessions).toHaveLength(1);
      expect(recentSessions[0].id).toBe(session2.id);
    });

    it("should find sessions with profile", async () => {
      await createSession(); // Empty profile
      await createSession(mockProfile); // With profile

      const sessionsWithProfile = await getSessionsByCriteria({
        hasProfile: true,
      });

      expect(sessionsWithProfile).toHaveLength(1);
      expect(Object.keys(sessionsWithProfile[0].profile)).toHaveLength(12); // mockProfile has 12 fields
    });

    it("should find sessions without summary", async () => {
      const session1 = await createSession();
      const session2 = await createSession();

      // Add summary to one session
      await updateSession(session2.id, {
        summary: {
          overallScore: 85,
          relevantAreas: [],
          majorUpdates: [],
          recommendations: [],
          generatedAt: new Date(),
        },
      });

      const sessionsWithoutSummary = await getSessionsByCriteria({
        hasSummary: false,
      });

      expect(sessionsWithoutSummary).toHaveLength(1);
      expect(sessionsWithoutSummary[0].id).toBe(session1.id);
    });
  });

  describe("Memory Management", () => {
    it("should handle session limit", async () => {
      // This test would need to be adjusted based on the actual session limit
      // For now, we'll just test that creating many sessions doesn't crash
      const sessions = [];
      for (let i = 0; i < 10; i++) {
        const session = await createSession();
        sessions.push(session);
      }

      expect(sessions).toHaveLength(10);
      
      const stats = getSessionStats();
      expect(stats.totalSessions).toBe(10);
    });

    it("should clear all sessions", async () => {
      await createSession();
      await createSession();
      await createSession();

      let stats = getSessionStats();
      expect(stats.totalSessions).toBe(3);

      await clearAllSessions();

      stats = getSessionStats();
      expect(stats.totalSessions).toBe(0);
    });
  });
});