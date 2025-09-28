import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, getRateLimitStatus, resetRateLimit } from "@/lib/security/rate-limit";

describe("Rate Limiting", () => {
  const testConfig = {
    windowMs: 1000, // 1 second for testing
    maxRequests: 3,
  };

  beforeEach(async () => {
    // Reset rate limit for test identifier
    await resetRateLimit("test-user");
  });

  it("should allow requests within limit", async () => {
    const result1 = await rateLimit("test-user", testConfig);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = await rateLimit("test-user", testConfig);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = await rateLimit("test-user", testConfig);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("should block requests exceeding limit", async () => {
    // Use up all allowed requests
    for (let i = 0; i < testConfig.maxRequests; i++) {
      await rateLimit("test-user", testConfig);
    }

    // Next request should be blocked
    const result = await rateLimit("test-user", testConfig);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should reset after window expires", async () => {
    // Use up all requests
    for (let i = 0; i < testConfig.maxRequests; i++) {
      await rateLimit("test-user", testConfig);
    }

    // Should be blocked
    const blockedResult = await rateLimit("test-user", testConfig);
    expect(blockedResult.allowed).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, testConfig.windowMs + 100));

    // Should be allowed again
    const allowedResult = await rateLimit("test-user", testConfig);
    expect(allowedResult.allowed).toBe(true);
    expect(allowedResult.remaining).toBe(testConfig.maxRequests - 1);
  });

  it("should handle different identifiers separately", async () => {
    // Use up requests for user1
    for (let i = 0; i < testConfig.maxRequests; i++) {
      await rateLimit("user1", testConfig);
    }

    // user1 should be blocked
    const user1Result = await rateLimit("user1", testConfig);
    expect(user1Result.allowed).toBe(false);

    // user2 should still be allowed
    const user2Result = await rateLimit("user2", testConfig);
    expect(user2Result.allowed).toBe(true);
  });

  it("should get status without incrementing", async () => {
    // Make one request
    await rateLimit("test-user", testConfig);

    // Get status should not increment
    const status1 = await getRateLimitStatus("test-user", testConfig);
    expect(status1.remaining).toBe(2);

    const status2 = await getRateLimitStatus("test-user", testConfig);
    expect(status2.remaining).toBe(2); // Should be same
  });

  it("should reset rate limit manually", async () => {
    // Use up all requests
    for (let i = 0; i < testConfig.maxRequests; i++) {
      await rateLimit("test-user", testConfig);
    }

    // Should be blocked
    const blockedResult = await rateLimit("test-user", testConfig);
    expect(blockedResult.allowed).toBe(false);

    // Reset manually
    await resetRateLimit("test-user");

    // Should be allowed again
    const allowedResult = await rateLimit("test-user", testConfig);
    expect(allowedResult.allowed).toBe(true);
  });
});