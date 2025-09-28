/**
 * Server-side session management for secure server actions
 * Uses in-memory storage for temporary sessions without persistence
 */

import type { UserProfile, PersonalizedSummary, UserSession } from "@/types";

// In-memory session storage
// In production, consider using Redis or similar for distributed systems
const sessionStore = new Map<string, UserSession>();

// Session configuration
const SESSION_CONFIG = {
  EXPIRATION_MS: 24 * 60 * 60 * 1000, // 24 hours
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
  MAX_SESSIONS: 10000, // Prevent memory exhaustion
};

// Periodic cleanup of expired sessions
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Initialize session cleanup
 */
function initializeCleanup(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    cleanupExpiredSessions();
  }, SESSION_CONFIG.CLEANUP_INTERVAL_MS);
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions(): void {
  const now = new Date();
  let cleanedCount = 0;

  for (const [sessionId, session] of sessionStore.entries()) {
    if (now > session.expiresAt) {
      sessionStore.delete(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired sessions`);
  }
}

/**
 * Generate a secure session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `sess_${timestamp}_${randomPart}${randomPart2}`;
}

/**
 * Create a new session
 */
export async function createSession(initialProfile?: Partial<UserProfile>): Promise<UserSession> {
  // Initialize cleanup if not already done
  initializeCleanup();

  // Check session limit
  if (sessionStore.size >= SESSION_CONFIG.MAX_SESSIONS) {
    cleanupExpiredSessions();
    
    if (sessionStore.size >= SESSION_CONFIG.MAX_SESSIONS) {
      throw new Error("Session limit reached. Please try again later.");
    }
  }

  const now = new Date();
  const sessionId = generateSessionId();
  
  const session: UserSession = {
    id: sessionId,
    profile: initialProfile as UserProfile || {} as UserProfile,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_CONFIG.EXPIRATION_MS),
  };

  sessionStore.set(sessionId, session);
  
  return session;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<UserSession | null> {
  if (!sessionId || typeof sessionId !== "string") {
    return null;
  }

  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    sessionStore.delete(sessionId);
    return null;
  }

  return session;
}

/**
 * Update session data
 */
export async function updateSession(
  sessionId: string,
  updates: {
    profile?: Partial<UserProfile>;
    summary?: PersonalizedSummary;
  }
): Promise<UserSession | null> {
  const session = await getSession(sessionId);
  
  if (!session) {
    return null;
  }

  // Update session data
  if (updates.profile) {
    session.profile = { ...session.profile, ...updates.profile };
  }

  if (updates.summary !== undefined) {
    session.summary = updates.summary;
  }

  // Extend session expiration on update
  session.expiresAt = new Date(Date.now() + SESSION_CONFIG.EXPIRATION_MS);

  sessionStore.set(sessionId, session);
  
  return session;
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!sessionId || typeof sessionId !== "string") {
    return false;
  }

  return sessionStore.delete(sessionId);
}

/**
 * Check if session exists and is valid
 */
export async function isValidSession(sessionId: string): Promise<boolean> {
  const session = await getSession(sessionId);
  return session !== null;
}

/**
 * Get session statistics (for monitoring)
 */
export function getSessionStats(): {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
} {
  const now = new Date();
  let activeSessions = 0;
  let expiredSessions = 0;

  for (const session of sessionStore.values()) {
    if (now > session.expiresAt) {
      expiredSessions++;
    } else {
      activeSessions++;
    }
  }

  return {
    totalSessions: sessionStore.size,
    activeSessions,
    expiredSessions,
  };
}

/**
 * Clear all sessions (for testing or emergency cleanup)
 */
export async function clearAllSessions(): Promise<void> {
  sessionStore.clear();
}

/**
 * Extend session expiration
 */
export async function extendSession(sessionId: string): Promise<UserSession | null> {
  const session = await getSession(sessionId);
  
  if (!session) {
    return null;
  }

  session.expiresAt = new Date(Date.now() + SESSION_CONFIG.EXPIRATION_MS);
  sessionStore.set(sessionId, session);
  
  return session;
}

/**
 * Get sessions by criteria (for admin purposes)
 */
export async function getSessionsByCriteria(criteria: {
  createdAfter?: Date;
  createdBefore?: Date;
  hasProfile?: boolean;
  hasSummary?: boolean;
}): Promise<UserSession[]> {
  const sessions: UserSession[] = [];

  for (const session of sessionStore.values()) {
    let matches = true;

    if (criteria.createdAfter && session.createdAt < criteria.createdAfter) {
      matches = false;
    }

    if (criteria.createdBefore && session.createdAt > criteria.createdBefore) {
      matches = false;
    }

    if (criteria.hasProfile !== undefined) {
      const hasProfile = Object.keys(session.profile).length > 0;
      if (criteria.hasProfile !== hasProfile) {
        matches = false;
      }
    }

    if (criteria.hasSummary !== undefined) {
      const hasSummary = !!session.summary;
      if (criteria.hasSummary !== hasSummary) {
        matches = false;
      }
    }

    if (matches) {
      sessions.push(session);
    }
  }

  return sessions;
}

/**
 * Cleanup function to be called on server shutdown
 */
export function cleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
  sessionStore.clear();
}