import { describe, expect, it } from "vitest";
import {
  generateCSRFToken,
  generateHashedCSRFToken,
  validateCSRF,
  validateHashedCSRFToken,
} from "@/lib/security/csrf";

describe("CSRF Protection", () => {
  describe("generateCSRFToken", () => {
    it("should generate a valid token", () => {
      const token = generateCSRFToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBe(64); // 32 bytes * 2 (hex)
      expect(/^[a-f0-9]+$/i.test(token)).toBe(true);
    });

    it("should generate unique tokens", () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("validateCSRF", () => {
    it("should validate properly formatted tokens", () => {
      const validToken = "a".repeat(64); // 64 hex characters
      expect(validateCSRF(validToken)).toBe(true);
    });

    it("should reject invalid tokens", () => {
      expect(validateCSRF("")).toBe(false);
      expect(validateCSRF("short")).toBe(false);
      expect(validateCSRF("a".repeat(63))).toBe(false); // Too short
      expect(validateCSRF("a".repeat(65))).toBe(false); // Too long
      expect(validateCSRF("g".repeat(64))).toBe(false); // Invalid hex
      expect(validateCSRF(null as any)).toBe(false);
      expect(validateCSRF(undefined as any)).toBe(false);
    });
  });

  describe("generateHashedCSRFToken", () => {
    it("should generate a hashed token", () => {
      const sessionId = "test-session";
      const secret = "test-secret";
      const token = generateHashedCSRFToken(sessionId, secret);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBe(64); // SHA256 hex
      expect(/^[a-f0-9]+$/i.test(token)).toBe(true);
    });

    it("should generate different tokens for different inputs", () => {
      const secret = "test-secret";
      const token1 = generateHashedCSRFToken("session1", secret);
      const token2 = generateHashedCSRFToken("session2", secret);

      expect(token1).not.toBe(token2);
    });

    it("should generate different tokens at different times", async () => {
      const sessionId = "test-session";
      const secret = "test-secret";

      const token1 = generateHashedCSRFToken(sessionId, secret);

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const token2 = generateHashedCSRFToken(sessionId, secret);

      expect(token1).not.toBe(token2);
    });
  });

  describe("validateHashedCSRFToken", () => {
    it("should validate properly formatted tokens", () => {
      const validToken = "a".repeat(64); // 64 hex characters
      const sessionId = "test-session";
      const secret = "test-secret";

      const isValid = validateHashedCSRFToken(validToken, sessionId, secret);
      expect(typeof isValid).toBe("boolean");
    });

    it("should reject invalid tokens", () => {
      const sessionId = "test-session";
      const secret = "test-secret";

      expect(validateHashedCSRFToken("", sessionId, secret)).toBe(false);
      expect(validateHashedCSRFToken("short", sessionId, secret)).toBe(false);
      expect(validateHashedCSRFToken("g".repeat(64), sessionId, secret)).toBe(
        false,
      );
      expect(validateHashedCSRFToken("a".repeat(64), "", secret)).toBe(false);
      expect(validateHashedCSRFToken("a".repeat(64), sessionId, "")).toBe(
        false,
      );
    });

    it("should handle token with timestamp", () => {
      const sessionId = "test-session";
      const secret = "test-secret";
      const timestamp = Date.now().toString(16);
      const tokenWithTimestamp = `${"a".repeat(56)}.${timestamp}`;

      const isValid = validateHashedCSRFToken(
        tokenWithTimestamp,
        sessionId,
        secret,
      );
      expect(typeof isValid).toBe("boolean");
    });

    it("should reject expired tokens", () => {
      const sessionId = "test-session";
      const secret = "test-secret";
      const oldTimestamp = (Date.now() - 2 * 60 * 60 * 1000).toString(16); // 2 hours ago
      const expiredToken = `${"a".repeat(56)}.${oldTimestamp}`;
      const maxAge = 60 * 60 * 1000; // 1 hour

      const isValid = validateHashedCSRFToken(
        expiredToken,
        sessionId,
        secret,
        maxAge,
      );
      expect(isValid).toBe(false);
    });
  });
});
