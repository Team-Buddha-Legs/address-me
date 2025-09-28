/**
 * Input sanitization utilities for server actions
 */

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return (
    input
      // Remove script tags and content first
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove javascript: URLs
      .replace(/javascript:/gi, "")
      // Remove data: URLs (except safe image types)
      .replace(/data:(?!image\/(png|jpg|jpeg|gif|webp|svg\+xml))[^;]*;/gi, "")
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*[^>]*/gi, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Sanitize HTML content while preserving safe formatting
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== "string") {
    return "";
  }

  // Allow only safe HTML tags
  const allowedTags = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "code",
    "pre",
  ];

  return (
    html
      // Remove script tags and content first
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove style tags and content
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      // Remove disallowed HTML tags (keep only allowed ones)
      .replace(
        /<(?!\/?(?:p|br|strong|b|em|i|u|ul|ol|li|h[1-6]|blockquote|code|pre)\b)[^>]*>/gi,
        "",
      )
      // Remove javascript: URLs
      .replace(/javascript:/gi, "")
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*[^>]*/gi, "")
      // Remove style attributes
      .replace(/\s*style\s*=\s*[^>]*/gi, "")
      .trim()
  );
}

/**
 * Sanitize object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item) : item,
      ) as T[typeof key];
    } else if (value && typeof value === "object") {
      sanitized[key] = sanitizeObject(
        value as Record<string, unknown>,
      ) as T[typeof key];
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== "string") {
    return null;
  }

  const sanitized = sanitizeInput(email).toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhoneNumber(phone: string): string {
  if (typeof phone !== "string") {
    return "";
  }

  // Remove all non-digit characters except + at the beginning
  return phone.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number | null {
  if (typeof input === "number") {
    return isFinite(input) ? input : null;
  }

  if (typeof input !== "string") {
    return null;
  }

  const sanitized = sanitizeInput(input);
  const number = Number(sanitized);

  return isFinite(number) ? number : null;
}

/**
 * Sanitize boolean input
 */
export function sanitizeBoolean(input: string | boolean): boolean {
  if (typeof input === "boolean") {
    return input;
  }

  if (typeof input === "string") {
    const sanitized = sanitizeInput(input).toLowerCase();
    return sanitized === "true" || sanitized === "1" || sanitized === "yes";
  }

  return false;
}

/**
 * Sanitize URL input
 */
export function sanitizeURL(url: string): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const sanitized = sanitizeInput(url);

  try {
    const urlObj = new URL(sanitized);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return null;
    }

    return urlObj.toString();
  } catch {
    return null;
  }
}

/**
 * Remove potentially dangerous characters from file names
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== "string") {
    return "";
  }

  return (
    fileName
      // Remove path traversal attempts
      .replace(/\.\./g, "")
      .replace(/[/\\]/g, "")
      // Remove potentially dangerous characters
      .replace(/[<>:"|?*]/g, "")
      // Remove control characters
      .replace(/[\x00-\x1f\x80-\x9f]/g, "")
      .trim()
  );
}

/**
 * Sanitize SQL-like input (basic protection)
 */
export function sanitizeSQLInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return (
    input
      // Remove dangerous characters
      .replace(/['";@]/g, "")
      // Remove SQL keywords (replace with spaces to maintain word boundaries)
      .replace(
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi,
        " ",
      )
      // Remove SQL comments
      .replace(/--/g, "")
      .replace(/\/\*/g, "")
      .replace(/\*\//g, "")
      // Clean up multiple spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}
