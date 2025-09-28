import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Home from "@/app/page";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Home Page", () => {
  it("should render the main heading", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("Get Your");
    expect(container.textContent).toContain("Personalized");
    expect(container.textContent).toContain("Policy Address Report");
  });

  it("should render the start assessment button", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("Start Your Assessment");
  });

  it("should render feature sections", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("Personalized Analysis");
    expect(container.textContent).toContain("Actionable Recommendations");
    expect(container.textContent).toContain("Instant Results");
  });

  it("should render how it works section", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("How It Works");
    expect(container.textContent).toContain("Complete Assessment");
    expect(container.textContent).toContain("AI Analysis");
    expect(container.textContent).toContain("Get Your Report");
  });

  it("should have assessment links pointing to the first step", () => {
    const { container } = render(<Home />);
    const links = container.querySelectorAll('a[href*="/assessment/"]');
    expect(links.length).toBeGreaterThan(0);
    
    // Check that links point to the first step
    links.forEach((link) => {
      expect(link.getAttribute("href")).toContain("/assessment/personal-info");
    });
  });

  it("should render the footer", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("Address Me");
    expect(container.textContent).toContain("Privacy Policy");
    expect(container.textContent).toContain("Terms of Service");
  });
});