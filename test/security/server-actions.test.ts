import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateSummary } from "@/lib/actions/ai-actions";
import {
  completeAssessment,
  processFormStep,
} from "@/lib/actions/form-actions";

// Mock dependencies
vi.mock("@/lib/session", () => ({
  createSession: vi.fn(),
  getSession: vi.fn(),
  updateSession: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCSRF: vi.fn(),
}));

vi.mock("@/lib/security/sanitization", () => ({
  sanitizeInput: vi.fn((input) => input),
}));

vi.mock("@/lib/ai", () => ({
  generatePersonalizedSummary: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { redirect } from "next/navigation";
import { generatePersonalizedSummary } from "@/lib/ai";
import { validateCSRF } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/rate-limit";
import { createSession, getSession, updateSession } from "@/lib/session";

describe("Server Actions Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("processFormStep", () => {
    it("should reject requests without client ID", async () => {
      const formData = new FormData();
      formData.append("csrfToken", "valid-token");

      const result = await processFormStep("personal-info", formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Client ID is required");
    });

    it("should reject requests without CSRF token", async () => {
      const formData = new FormData();
      formData.append("clientId", "test-client");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: true,
        remaining: 5,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(validateCSRF).mockReturnValue(false);

      const result = await processFormStep("personal-info", formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid CSRF token");
    });

    it("should reject rate-limited requests", async () => {
      const formData = new FormData();
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
      });

      const result = await processFormStep("personal-info", formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Rate limit exceeded");
    });

    it("should reject invalid step IDs", async () => {
      const formData = new FormData();
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: true,
        remaining: 5,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(validateCSRF).mockReturnValue(true);

      const result = await processFormStep("invalid-step", formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid step ID");
    });

    it("should process valid form step", async () => {
      const formData = new FormData();
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");
      formData.append("age", "25");
      formData.append("gender", "male");
      formData.append("maritalStatus", "single");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: true,
        remaining: 5,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(validateCSRF).mockReturnValue(true);

      const mockSession = {
        id: "test-session",
        profile: {},
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      vi.mocked(createSession).mockResolvedValue(mockSession);
      vi.mocked(updateSession).mockResolvedValue(mockSession);

      const result = await processFormStep("personal-info", formData);

      expect(result.success).toBe(true);
      expect(result.sessionId).toBe("test-session");
      expect(result.nextStep).toBe("location");
    });
  });

  describe("completeAssessment", () => {
    it("should validate complete user profile", async () => {
      const formData = new FormData();
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: true,
        remaining: 5,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(validateCSRF).mockReturnValue(true);

      const incompleteSession = {
        id: "test-session",
        profile: { age: 25 }, // Incomplete profile
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      vi.mocked(getSession).mockResolvedValue(incompleteSession);

      const result = await completeAssessment("test-session", formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Required");
    });
  });

  describe("generateSummary", () => {
    it("should enforce AI rate limiting", async () => {
      const formData = new FormData();
      formData.append("sessionId", "test-session");
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
      });

      const result = await generateSummary(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain(
        "AI service temporarily unavailable due to high demand",
      );
    });

    it("should validate session before AI generation", async () => {
      const formData = new FormData();
      formData.append("sessionId", "invalid-session");
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: true,
        remaining: 2,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(validateCSRF).mockReturnValue(true);
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await generateSummary(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid session");
    });

    it("should handle AI generation errors gracefully", async () => {
      const formData = new FormData();
      formData.append("sessionId", "test-session");
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockResolvedValue({
        allowed: true,
        remaining: 2,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(validateCSRF).mockReturnValue(true);

      const mockSession = {
        id: "test-session",
        profile: {
          age: 25,
          gender: "male" as const,
          maritalStatus: "single" as const,
          district: "central-western" as const,
          incomeRange: "30k-50k" as const,
          employmentStatus: "employed-full-time" as const,
          housingType: "private-rental" as const,
          hasChildren: false,
          educationLevel: "bachelor" as const,
          transportationMode: ["mtr" as const],
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(generatePersonalizedSummary).mockRejectedValue(
        new Error("AI service error"),
      );

      const result = await generateSummary(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("AI service error");
    });
  });

  describe("Error Message Sanitization", () => {
    it("should sanitize sensitive information from error messages", async () => {
      const formData = new FormData();
      formData.append("clientId", "test-client");
      formData.append("csrfToken", "valid-token");

      vi.mocked(rateLimit).mockRejectedValue(
        new Error("Database connection failed at 192.168.1.1"),
      );

      const result = await processFormStep("personal-info", formData);

      expect(result.success).toBe(false);
      expect(result.error).not.toContain("192.168.1.1");
      expect(result.error).toBe("Service temporarily unavailable");
    });
  });
});
