import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
    expect(container.textContent).toContain("AddressMe");
    expect(container.textContent).toContain("Privacy Policy");
    expect(container.textContent).toContain("Terms of Service");
  });

  it("should have professional blue gradient background", () => {
    const { container } = render(<Home />);
    const mainDiv = container.querySelector("div");
    expect(mainDiv?.className).toContain("bg-gradient-to-br");
    expect(mainDiv?.className).toContain("from-primary-50");
  });

  it("should display clear value proposition in hero section", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("Get Your");
    expect(container.textContent).toContain("Personalized");
    expect(container.textContent).toContain("Policy Address Report");
    expect(container.textContent).toContain(
      "Discover how Hong Kong's latest Policy Address affects you personally",
    );
  });

  it("should have responsive design elements", () => {
    const { container } = render(<Home />);
    // Check for responsive classes
    const responsiveElements = container.querySelectorAll(
      '[class*="sm:"], [class*="md:"]',
    );
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it("should display process explanation and benefits", () => {
    const { container } = render(<Home />);
    expect(container.textContent).toContain("Takes 3-5 minutes");
    expect(container.textContent).toContain("Free");
    expect(container.textContent).toContain("No registration required");
    expect(container.textContent).toContain("tailored insights");
    expect(container.textContent).toContain("recommendations");
  });

  it("should have proper navigation structure", () => {
    const { container } = render(<Home />);
    // Check for navigation elements
    expect(container.textContent).toContain("Features");
    expect(container.textContent).toContain("How it Works");

    // Check for anchor links
    const featureLink = container.querySelector('a[href="#features"]');
    const howItWorksLink = container.querySelector('a[href="#how-it-works"]');
    expect(featureLink).toBeTruthy();
    expect(howItWorksLink).toBeTruthy();
  });

  it("should use professional color scheme", () => {
    const { container } = render(<Home />);
    // Check for custom color classes
    const colorElements = container.querySelectorAll(
      '[class*="primary"], [class*="secondary"], [class*="accent"]',
    );
    expect(colorElements.length).toBeGreaterThan(0);
  });
});
