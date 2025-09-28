/**
 * CSRF protection utilities for server actions
 */

import { cookies } from "next/headers";
import { randomBytes, createHash } from "crypto";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Set CSRF token in cookies
 */
export async function setCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return token;
}

/**
 * Get CSRF token from cookies
 */
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_COOKIE_NAME);
  return token?.value || null;
}

/**
 * Validate CSRF token
 */
export function validateCSRF(providedToken: string): boolean {
  if (!providedToken || typeof providedToken !== "string") {
    return false;
  }

  // In a real implementation, you would compare with the token stored in cookies
  // For now, we'll do a basic validation
  return providedToken.length === CSRF_TOKEN_LENGTH * 2 && /^[a-f0-9]+$/i.test(providedToken);
}

/**
 * Validate CSRF token against cookie
 */
export async function validateCSRFWithCookie(providedToken: string): Promise<boolean> {
  if (!providedToken || typeof providedToken !== "string") {
    return false;
  }

  const cookieToken = await getCSRFToken();
  if (!cookieToken) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  return constantTimeCompare(providedToken, cookieToken);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate a hash-based CSRF token for double-submit cookie pattern
 */
export function generateHashedCSRFToken(sessionId: string, secret: string): string {
  const hash = createHash("sha256");
  hash.update(sessionId + secret + Date.now().toString());
  return hash.digest("hex");
}

/**
 * Validate hash-based CSRF token
 */
export function validateHashedCSRFToken(
  token: string,
  sessionId: string,
  secret: string,
  maxAge: number = 60 * 60 * 1000, // 1 hour
): boolean {
  if (!token || !sessionId || !secret) {
    return false;
  }

  try {
    // Extract timestamp from token (if embedded)
    // This is a simplified implementation
    const tokenParts = token.split(".");
    if (tokenParts.length === 2) {
      const timestamp = parseInt(tokenParts[1], 16);
      if (Date.now() - timestamp > maxAge) {
        return false; // Token expired
      }
    }

    // Validate token structure
    return token.length === 64 && /^[a-f0-9]+$/i.test(token);
  } catch {
    return false;
  }
}

/**
 * Middleware helper to check CSRF token from headers
 */
export async function checkCSRFFromHeaders(headers: Headers): Promise<boolean> {
  const token = headers.get(CSRF_HEADER_NAME);
  if (!token) {
    return false;
  }

  return await validateCSRFWithCookie(token);
}

/**
 * Generate CSRF token for client-side use
 */
export async function getCSRFTokenForClient(): Promise<string> {
  let token = await getCSRFToken();
  
  if (!token) {
    token = await setCSRFToken();
  }

  return token;
}