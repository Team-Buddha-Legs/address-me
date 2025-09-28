import { beforeEach, describe, expect, it, vi } from "vitest";
import { LogLevel, PrivacyLogger } from "@/lib/privacy/logger";
import type { PersonalizedSummary, UserProfile } from "@/types";

describe("Privacy Logger", () => {
  let logger: PrivacyLogger;

  const mockUserProfile: UserProfile = {
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

  const mockSummary: PersonalizedSummary = {
    overallScore: 85,
    relevantAreas: [
      {
        category: "housing",
        title: "Housing Policies",
        relevanceScore: 90,
        summary: "Relevant housing information",
        details: "Detailed housing information",
        actionItems: ["Apply for housing scheme"],
        impact: "high",
      },
    ],
    majorUpdates: [
      {
        id: "update1",
        title: "Major Update",
        description: "Important city update",
        relevanceToUser: "High relevance",
        timeline: "2024",
        impact: "high",
      },
    ],
    recommendations: [
      {
        id: "rec1",
        title: "Recommendation",
        description: "Important recommendation",
        actionSteps: ["Step 1", "Step 2"],
        priority: "high",
        category: "housing",
      },
    ],
    generatedAt: new Date(),
  };

  beforeEach(() => {
    logger = PrivacyLogger.getInstance();
    logger.clearLogs();
    logger.setEnabled(true);
  });

  describe("Basic Logging", () => {
    it("should log messages at different levels", () => {
      logger.error("Error message");
      logger.warn("Warning message");
      logger.info("Info message");
      logger.debug("Debug message");

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(4);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[1].level).toBe(LogLevel.WARN);
      expect(logs[2].level).toBe(LogLevel.INFO);
      expect(logs[3].level).toBe(LogLevel.DEBUG);
    });

    it("should sanitize log messages", () => {
      logger.info(
        "User email: user@example.com, IP: 192.168.1.1, API key: abc123",
      );

      const logs = logger.getRecentLogs();
      expect(logs[0].message).toBe(
        "User email: [EMAIL], IP: [IP], API key: abc123",
      );
    });

    it("should hash session IDs", () => {
      const sessionId = "session-123-456";
      logger.info("Test message", {}, sessionId);

      const logs = logger.getRecentLogs();
      expect(logs[0].sessionId).toBeDefined();
      expect(logs[0].sessionId).not.toBe(sessionId);
      expect(typeof logs[0].sessionId).toBe("string");
    });
  });

  describe("Privacy Compliance", () => {
    it("should sanitize data containing sensitive fields", () => {
      const sensitiveData = {
        age: 30,
        gender: "male",
        name: "John",
        publicInfo: "Safe data",
      };

      logger.info(
        "Test with sensitive data",
        sensitiveData,
        "session-123",
        "test_operation",
      );

      const logs = logger.getRecentLogs();
      const logData = logs[0].data as any;

      expect(logData.age_present).toBe(true);
      expect(logData.gender_present).toBe(true);
      expect(logData.name).toBe("John");
      expect(logData.publicInfo).toBe("Safe data");
      expect(logData).not.toHaveProperty("age");
      expect(logData).not.toHaveProperty("gender");
    });

    it("should detect and handle privacy violations", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const violatingData = { age: 30, gender: "male" };
      logger.info(
        "Test message",
        violatingData,
        "session-123",
        "log_user_data",
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Privacy compliance violation:",
        expect.arrayContaining([
          "Sensitive field 'age' should not be logged directly",
          "Sensitive field 'gender' should not be logged directly",
        ]),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("User Activity Logging", () => {
    it("should log user activity with anonymized profile", () => {
      logger.logUserActivity(
        "form_submission",
        mockUserProfile,
        "session-123",
        {
          step: "personal-info",
        },
      );

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("User activity: form_submission");

      const logData = logs[0].data as any;
      expect(logData.action).toBe("form_submission");
      expect(logData.step).toBe("personal-info");
      expect(logData.profile.profileType).toBe("user_profile");
      expect(logData.profile.hasAge).toBe(true);
      expect(logData.profile).not.toHaveProperty("age");
    });
  });

  describe("AI Summary Logging", () => {
    it("should log summary generation with anonymized data", () => {
      logger.logSummaryGeneration(
        mockUserProfile,
        mockSummary,
        "session-123",
        5000,
      );

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("AI summary generated");

      const logData = logs[0].data as any;
      expect(logData.duration_ms).toBe(5000);
      expect(logData.profile.profileType).toBe("user_profile");
      expect(logData.summary.summaryType).toBe("personalized_summary");
      expect(logData.summary.overallScore).toBe(85);
      expect(logData.summary).not.toHaveProperty("relevantAreas");
    });
  });

  describe("Security Event Logging", () => {
    it("should log security events with sanitized details", () => {
      const securityDetails = {
        attemptedAction: "unauthorized_access",
        userAgent: "Mozilla/5.0...",
        ip: "192.168.1.100",
        timestamp: new Date().toISOString(),
      };

      logger.logSecurityEvent(
        "failed_authentication",
        securityDetails,
        "session-123",
      );

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Security event: failed_authentication");

      const logData = logs[0].data as any;
      expect(logData.attemptedAction).toBe("unauthorized_access");
      expect(logData.ip).toBe("[IP]");
    });
  });

  describe("Rate Limit Logging", () => {
    it("should log rate limit events with hashed identifiers", () => {
      logger.logRateLimit("user-123", "form_submission", 0, Date.now() + 60000);

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Rate limit triggered");

      const logData = logs[0].data as any;
      expect(logData.identifier).toBeDefined();
      expect(logData.identifier).not.toBe("user-123");
      expect(logData.action).toBe("form_submission");
      expect(logData.remaining).toBe(0);
    });
  });

  describe("Log Management", () => {
    it("should maintain log statistics", () => {
      logger.error("Error 1");
      logger.error("Error 2");
      logger.warn("Warning 1");
      logger.info("Info 1");
      logger.debug("Debug 1");

      const stats = logger.getLogStats();
      expect(stats.totalLogs).toBe(5);
      expect(stats.errorCount).toBe(2);
      expect(stats.warnCount).toBe(1);
      expect(stats.infoCount).toBe(1);
      expect(stats.debugCount).toBe(1);
    });

    it("should limit recent logs retrieval", () => {
      // Add more logs than requested
      for (let i = 0; i < 10; i++) {
        logger.info(`Message ${i}`);
      }

      const recentLogs = logger.getRecentLogs(5);
      expect(recentLogs).toHaveLength(5);
      expect(recentLogs[0].message).toBe("Message 5");
      expect(recentLogs[4].message).toBe("Message 9");
    });

    it("should clear logs", () => {
      logger.info("Test message");
      expect(logger.getRecentLogs()).toHaveLength(1);

      logger.clearLogs();
      expect(logger.getRecentLogs()).toHaveLength(0);
    });

    it("should respect enabled/disabled state", () => {
      logger.setEnabled(false);
      logger.info("This should not be logged");
      expect(logger.getRecentLogs()).toHaveLength(0);

      logger.setEnabled(true);
      logger.info("This should be logged");
      expect(logger.getRecentLogs()).toHaveLength(1);
    });
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = PrivacyLogger.getInstance();
      const instance2 = PrivacyLogger.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
