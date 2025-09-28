import { describe, it, expect } from "vitest";
import {
  sanitizeInput,
  sanitizeHTML,
  sanitizeObject,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeNumber,
  sanitizeBoolean,
  sanitizeURL,
  sanitizeFileName,
  sanitizeSQLInput,
} from "@/lib/security/sanitization";

describe("Input Sanitization", () => {
  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      const input = "<script>alert('xss')</script>Hello World";
      const result = sanitizeInput(input);
      expect(result).toBe("Hello World");
    });

    it("should remove script tags and content", () => {
      const input = "Safe text <script>malicious code</script> more safe text";
      const result = sanitizeInput(input);
      expect(result).toBe("Safe text more safe text");
    });

    it("should remove javascript: URLs", () => {
      const input = "Click <a href='javascript:alert(1)'>here</a>";
      const result = sanitizeInput(input);
      expect(result).toBe("Click here");
    });

    it("should remove event handlers", () => {
      const input = "<div onclick='alert(1)'>Click me</div>";
      const result = sanitizeInput(input);
      expect(result).toBe("Click me");
    });

    it("should normalize whitespace", () => {
      const input = "  Multiple   spaces   and\n\nnewlines  ";
      const result = sanitizeInput(input);
      expect(result).toBe("Multiple spaces and newlines");
    });

    it("should handle non-string input", () => {
      expect(sanitizeInput(null as any)).toBe("");
      expect(sanitizeInput(undefined as any)).toBe("");
      expect(sanitizeInput(123 as any)).toBe("");
    });
  });

  describe("sanitizeHTML", () => {
    it("should preserve safe HTML tags", () => {
      const input = "<p>Safe <strong>content</strong> with <em>formatting</em></p>";
      const result = sanitizeHTML(input);
      expect(result).toBe("<p>Safe <strong>content</strong> with <em>formatting</em></p>");
    });

    it("should remove dangerous HTML tags", () => {
      const input = "<p>Safe</p><script>alert('xss')</script><div>More safe</div>";
      const result = sanitizeHTML(input);
      expect(result).toBe("<p>Safe</p>More safe");
    });

    it("should remove style attributes", () => {
      const input = "<p style='color: red;'>Styled text</p>";
      const result = sanitizeHTML(input);
      expect(result).toBe("<p>Styled text</p>");
    });
  });

  describe("sanitizeObject", () => {
    it("should sanitize all string values in object", () => {
      const input = {
        name: "<script>alert('xss')</script>John",
        description: "Safe description",
        tags: ["<b>tag1</b>", "tag2"],
        nested: {
          value: "<div onclick='alert(1)'>nested</div>",
        },
      };

      const result = sanitizeObject(input);
      
      expect(result.name).toBe("John");
      expect(result.description).toBe("Safe description");
      expect(result.tags).toEqual(["tag1", "tag2"]);
      expect(result.nested.value).toBe("nested");
    });
  });

  describe("sanitizeEmail", () => {
    it("should validate and sanitize valid emails", () => {
      expect(sanitizeEmail("test@example.com")).toBe("test@example.com");
      expect(sanitizeEmail("USER@DOMAIN.COM")).toBe("user@domain.com");
    });

    it("should reject invalid emails", () => {
      expect(sanitizeEmail("invalid-email")).toBe(null);
      expect(sanitizeEmail("@domain.com")).toBe(null);
      expect(sanitizeEmail("user@")).toBe(null);
      expect(sanitizeEmail("<script>alert(1)</script>@domain.com")).toBe(null);
    });

    it("should handle non-string input", () => {
      expect(sanitizeEmail(null as any)).toBe(null);
      expect(sanitizeEmail(123 as any)).toBe(null);
    });
  });

  describe("sanitizePhoneNumber", () => {
    it("should remove non-digit characters except leading +", () => {
      expect(sanitizePhoneNumber("+1 (555) 123-4567")).toBe("+15551234567");
      expect(sanitizePhoneNumber("555.123.4567")).toBe("5551234567");
      expect(sanitizePhoneNumber("555 123 4567 ext 123")).toBe("5551234567123");
    });

    it("should handle non-string input", () => {
      expect(sanitizePhoneNumber(null as any)).toBe("");
      expect(sanitizePhoneNumber(123 as any)).toBe("");
    });
  });

  describe("sanitizeNumber", () => {
    it("should handle valid numbers", () => {
      expect(sanitizeNumber("123")).toBe(123);
      expect(sanitizeNumber("123.45")).toBe(123.45);
      expect(sanitizeNumber(456)).toBe(456);
    });

    it("should reject invalid numbers", () => {
      expect(sanitizeNumber("abc")).toBe(null);
      expect(sanitizeNumber("123abc")).toBe(null);
      expect(sanitizeNumber(Infinity)).toBe(null);
      expect(sanitizeNumber(NaN)).toBe(null);
    });
  });

  describe("sanitizeBoolean", () => {
    it("should handle boolean values", () => {
      expect(sanitizeBoolean(true)).toBe(true);
      expect(sanitizeBoolean(false)).toBe(false);
    });

    it("should handle string representations", () => {
      expect(sanitizeBoolean("true")).toBe(true);
      expect(sanitizeBoolean("TRUE")).toBe(true);
      expect(sanitizeBoolean("1")).toBe(true);
      expect(sanitizeBoolean("yes")).toBe(true);
      expect(sanitizeBoolean("false")).toBe(false);
      expect(sanitizeBoolean("0")).toBe(false);
      expect(sanitizeBoolean("no")).toBe(false);
      expect(sanitizeBoolean("")).toBe(false);
    });
  });

  describe("sanitizeURL", () => {
    it("should validate and return valid URLs", () => {
      expect(sanitizeURL("https://example.com")).toBe("https://example.com/");
      expect(sanitizeURL("http://test.org/path")).toBe("http://test.org/path");
    });

    it("should reject invalid protocols", () => {
      expect(sanitizeURL("javascript:alert(1)")).toBe(null);
      expect(sanitizeURL("data:text/html,<script>alert(1)</script>")).toBe(null);
      expect(sanitizeURL("ftp://example.com")).toBe(null);
    });

    it("should reject malformed URLs", () => {
      expect(sanitizeURL("not-a-url")).toBe(null);
      expect(sanitizeURL("")).toBe(null);
    });
  });

  describe("sanitizeFileName", () => {
    it("should remove dangerous characters", () => {
      expect(sanitizeFileName("../../../etc/passwd")).toBe("etcpasswd");
      expect(sanitizeFileName("file<>:\"|?*.txt")).toBe("file.txt");
      expect(sanitizeFileName("normal-file_name.pdf")).toBe("normal-file_name.pdf");
    });

    it("should handle non-string input", () => {
      expect(sanitizeFileName(null as any)).toBe("");
      expect(sanitizeFileName(123 as any)).toBe("");
    });
  });

  describe("sanitizeSQLInput", () => {
    it("should remove SQL injection patterns", () => {
      expect(sanitizeSQLInput("'; DROP TABLE users; --")).toBe("TABLE users");
      expect(sanitizeSQLInput("1 OR 1=1")).toBe("1 OR 1=1");
      expect(sanitizeSQLInput("UNION SELECT * FROM passwords")).toBe("* FROM passwords");
    });

    it("should preserve safe input", () => {
      expect(sanitizeSQLInput("John Doe")).toBe("John Doe");
      expect(sanitizeSQLInput("user@example.com")).toBe("userexample.com");
    });
  });
});