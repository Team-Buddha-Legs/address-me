/**
 * Privacy-compliant logging system
 * Ensures no sensitive data is exposed in logs
 */

import type { PersonalizedSummary, UserProfile } from "@/types";
import {
  anonymizePersonalizedSummary,
  anonymizeUserProfile,
  sanitizeForLogging,
  validatePrivacyCompliance,
} from "./data-handler";

// Log levels
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

// Log entry interface
interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  sessionId?: string;
  operation?: string;
}

// In-memory log storage (in production, use external logging service)
const logStore: LogEntry[] = [];
const MAX_LOG_ENTRIES = 1000; // Prevent memory overflow

/**
 * Privacy-compliant logger
 */
export class PrivacyLogger {
  private static instance: PrivacyLogger;
  private enabled: boolean = process.env.NODE_ENV !== "test";

  private constructor() {}

  static getInstance(): PrivacyLogger {
    if (!PrivacyLogger.instance) {
      PrivacyLogger.instance = new PrivacyLogger();
    }
    return PrivacyLogger.instance;
  }

  /**
   * Log an error with privacy compliance
   */
  error(
    message: string,
    data?: unknown,
    sessionId?: string,
    operation?: string,
  ): void {
    this.log(LogLevel.ERROR, message, data, sessionId, operation);
  }

  /**
   * Log a warning with privacy compliance
   */
  warn(
    message: string,
    data?: unknown,
    sessionId?: string,
    operation?: string,
  ): void {
    this.log(LogLevel.WARN, message, data, sessionId, operation);
  }

  /**
   * Log info with privacy compliance
   */
  info(
    message: string,
    data?: unknown,
    sessionId?: string,
    operation?: string,
  ): void {
    this.log(LogLevel.INFO, message, data, sessionId, operation);
  }

  /**
   * Log debug info with privacy compliance
   */
  debug(
    message: string,
    data?: unknown,
    sessionId?: string,
    operation?: string,
  ): void {
    this.log(LogLevel.DEBUG, message, data, sessionId, operation);
  }

  /**
   * Log user profile activity (anonymized)
   */
  logUserActivity(
    action: string,
    profile: UserProfile,
    sessionId: string,
    additionalData?: Record<string, unknown>,
  ): void {
    const anonymizedProfile = anonymizeUserProfile(profile);
    const logData = {
      action,
      profile: anonymizedProfile,
      ...additionalData,
    };

    this.info(`User activity: ${action}`, logData, sessionId, "user_activity");
  }

  /**
   * Log AI summary generation (anonymized)
   */
  logSummaryGeneration(
    profile: UserProfile,
    summary: PersonalizedSummary,
    sessionId: string,
    duration?: number,
  ): void {
    const anonymizedProfile = anonymizeUserProfile(profile);
    const anonymizedSummary = anonymizePersonalizedSummary(summary);

    const logData = {
      profile: anonymizedProfile,
      summary: anonymizedSummary,
      duration_ms: duration,
    };

    this.info("AI summary generated", logData, sessionId, "ai_generation");
  }

  /**
   * Log security events
   */
  logSecurityEvent(
    event: string,
    details: Record<string, unknown>,
    sessionId?: string,
  ): void {
    // Security events need special handling to avoid exposing attack vectors
    const sanitizedDetails = sanitizeForLogging(details);

    this.warn(
      `Security event: ${event}`,
      sanitizedDetails,
      sessionId,
      "security",
    );
  }

  /**
   * Log rate limiting events
   */
  logRateLimit(
    identifier: string,
    action: string,
    remaining: number,
    resetTime: number,
  ): void {
    // Hash the identifier to avoid exposing user identifiers
    const hashedId = this.hashIdentifier(identifier);

    const logData = {
      identifier: hashedId,
      action,
      remaining,
      resetTime: new Date(resetTime).toISOString(),
    };

    this.warn("Rate limit triggered", logData, undefined, "rate_limit");
  }

  /**
   * Core logging method with privacy validation
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    sessionId?: string,
    operation?: string,
  ): void {
    if (!this.enabled) return;

    // Validate privacy compliance
    const compliance = validatePrivacyCompliance(operation || "log", data);
    if (!compliance.compliant) {
      // Log compliance violations but sanitize the data
      console.error("Privacy compliance violation:", compliance.violations);
      data = sanitizeForLogging(data);
    }

    // Create log entry
    const logEntry: LogEntry = {
      level,
      message: this.sanitizeMessage(message),
      data: data ? sanitizeForLogging(data) : undefined,
      timestamp: new Date().toISOString(),
      sessionId: sessionId ? this.hashIdentifier(sessionId) : undefined,
      operation,
    };

    // Store log entry
    this.storeLogEntry(logEntry);

    // Output to console in development
    if (process.env.NODE_ENV === "development") {
      this.outputToConsole(logEntry);
    }
  }

  /**
   * Store log entry with rotation
   */
  private storeLogEntry(entry: LogEntry): void {
    logStore.push(entry);

    // Rotate logs if we exceed max entries
    if (logStore.length > MAX_LOG_ENTRIES) {
      logStore.splice(0, logStore.length - MAX_LOG_ENTRIES);
    }
  }

  /**
   * Output log entry to console
   */
  private outputToConsole(entry: LogEntry): void {
    const logMessage = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(logMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, entry.data);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.data);
        break;
    }
  }

  /**
   * Sanitize log messages to remove sensitive information
   */
  private sanitizeMessage(message: string): string {
    return message
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        "[EMAIL]",
      )
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]")
      .replace(/\b\d{8,}\b/g, "[ID]")
      .replace(/api[_-]?key/gi, "[API_KEY]")
      .replace(/token/gi, "[TOKEN]");
  }

  /**
   * Hash identifier for privacy
   */
  private hashIdentifier(identifier: string): string {
    // Simple hash function (in production, use crypto.createHash)
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get recent logs (for debugging, with privacy protection)
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return logStore.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    logStore.length = 0;
  }

  /**
   * Get log statistics
   */
  getLogStats(): {
    totalLogs: number;
    errorCount: number;
    warnCount: number;
    infoCount: number;
    debugCount: number;
  } {
    const stats = {
      totalLogs: logStore.length,
      errorCount: 0,
      warnCount: 0,
      infoCount: 0,
      debugCount: 0,
    };

    for (const entry of logStore) {
      switch (entry.level) {
        case LogLevel.ERROR:
          stats.errorCount++;
          break;
        case LogLevel.WARN:
          stats.warnCount++;
          break;
        case LogLevel.INFO:
          stats.infoCount++;
          break;
        case LogLevel.DEBUG:
          stats.debugCount++;
          break;
      }
    }

    return stats;
  }

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const logger = PrivacyLogger.getInstance();
