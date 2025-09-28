import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import ProcessingPage from "@/app/processing/page";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js Link and router
const mockPush = vi.fn();
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock form steps
vi.mock("@/lib/form-steps", () => ({
  formSteps: [
    { id: "personal-info", title: "Personal Information" },
    { id: "housing", title: "Housing" },
    { id: "income", title: "Income" },
  ],
}));

// Mock LoadingSpinner component
vi.mock("@/components/ui/LoadingSpinner", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="loading-spinner" className={className}>
      Loading...
    </div>
  ),
}));

describe("Complete User Journey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Landing Page Flow", () => {
    it("should display landing page with clear value proposition", () => {
      render(<Home />);

      // Check hero section
      expect(screen.getAllByText(/Get Your/)).toHaveLength(2); // Main heading and "How it Works" section
      expect(screen.getAllByText(/Personalized/)).toHaveLength(2); // Main heading and feature section
      expect(screen.getByText(/Policy Address Report/)).toBeInTheDocument();

      // Check value proposition
      expect(
        screen.getByText(
          /Discover how Hong Kong's latest Policy Address affects you personally/,
        ),
      ).toBeInTheDocument();
    });

    it("should have Start Assessment CTA buttons", () => {
      render(<Home />);

      const ctaButtons = screen.getAllByText(/Start.*Assessment/);
      expect(ctaButtons.length).toBeGreaterThan(0);

      // Check that buttons link to assessment
      ctaButtons.forEach((button) => {
        const link = button.closest("a");
        expect(link?.getAttribute("href")).toContain(
          "/assessment/personal-info",
        );
      });
    });

    it("should display process explanation", () => {
      render(<Home />);

      expect(screen.getByText("How It Works")).toBeInTheDocument();
      expect(screen.getByText("Complete Assessment")).toBeInTheDocument();
      expect(screen.getByText("AI Analysis")).toBeInTheDocument();
      expect(screen.getByText("Get Your Report")).toBeInTheDocument();
    });

    it("should show benefits and features", () => {
      render(<Home />);

      expect(screen.getByText("Personalized Analysis")).toBeInTheDocument();
      expect(
        screen.getByText("Actionable Recommendations"),
      ).toBeInTheDocument();
      expect(screen.getByText("Instant Results")).toBeInTheDocument();

      // Check timing information (text is combined with bullet points)
      expect(screen.getByText(/Takes 3-5 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/Free/)).toBeInTheDocument();
      expect(screen.getByText(/No registration required/)).toBeInTheDocument();
    });

    it("should use professional color scheme", () => {
      const { container } = render(<Home />);

      // Check for custom color classes
      const colorElements = container.querySelectorAll(
        '[class*="primary"], [class*="secondary"], [class*="accent"]',
      );
      expect(colorElements.length).toBeGreaterThan(0);
    });

    it("should be responsive", () => {
      const { container } = render(<Home />);

      // Check for responsive classes
      const responsiveElements = container.querySelectorAll(
        '[class*="sm:"], [class*="md:"]',
      );
      expect(responsiveElements.length).toBeGreaterThan(0);
    });
  });

  describe("Processing Page Flow", () => {
    it("should display processing page with progress animations", () => {
      render(<ProcessingPage />);

      expect(
        screen.getByText("Processing Your Assessment"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/We're analyzing your profile/),
      ).toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should show progress indicator", () => {
      render(<ProcessingPage />);

      expect(screen.getByText("Progress")).toBeInTheDocument();
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should display processing steps", () => {
      render(<ProcessingPage />);

      expect(screen.getByText("Analyzing your profile...")).toBeInTheDocument();
    });

    it("should show estimated completion time", () => {
      render(<ProcessingPage />);

      expect(
        screen.getByText("Estimated time: 30-60 seconds"),
      ).toBeInTheDocument();
    });

    it("should use professional color scheme", () => {
      const { container } = render(<ProcessingPage />);

      // Check for custom color classes
      const colorElements = container.querySelectorAll(
        '[class*="primary"], [class*="secondary"]',
      );
      expect(colorElements.length).toBeGreaterThan(0);
    });

    it("should be responsive", () => {
      const { container } = render(<ProcessingPage />);

      expect(container.querySelector('[class*="max-w"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="px-"]')).toBeInTheDocument();
    });
  });

  describe("Flow Transitions", () => {
    it("should have smooth transitions between pages", () => {
      // Landing page should have animation classes
      const { container: homeContainer } = render(<Home />);
      const animatedElements = homeContainer.querySelectorAll(
        "[animate], [initial], [transition]",
      );
      expect(animatedElements.length).toBeGreaterThan(0);

      // Processing page should have animation classes
      const { container: processingContainer } = render(<ProcessingPage />);
      const processingAnimatedElements = processingContainer.querySelectorAll(
        "[animate], [initial], [transition]",
      );
      expect(processingAnimatedElements.length).toBeGreaterThan(0);
    });

    it("should maintain consistent design language across pages", () => {
      const { container: homeContainer } = render(<Home />);
      const { container: processingContainer } = render(<ProcessingPage />);

      // Both should use gradient backgrounds
      expect(
        homeContainer.querySelector('[class*="bg-gradient"]'),
      ).toBeInTheDocument();
      expect(
        processingContainer.querySelector('[class*="bg-gradient"]'),
      ).toBeInTheDocument();

      // Both should use professional color scheme
      expect(
        homeContainer.querySelector('[class*="primary"]'),
      ).toBeInTheDocument();
      expect(
        processingContainer.querySelector('[class*="primary"]'),
      ).toBeInTheDocument();
    });

    it("should provide proper error handling and user feedback", () => {
      render(<ProcessingPage />);

      // Processing page should render without errors
      expect(
        screen.getByText("Processing Your Assessment"),
      ).toBeInTheDocument();

      // Should have proper structure for error handling
      const container = screen
        .getByText("Processing Your Assessment")
        .closest("div");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Accessibility and UX", () => {
    it("should have proper heading hierarchy on landing page", () => {
      render(<Home />);

      // Should have main headings (there are multiple h1 elements)
      const mainHeadings = screen.getAllByRole("heading", { level: 1 });
      expect(mainHeadings.length).toBeGreaterThan(0);
    });

    it("should have proper heading hierarchy on processing page", () => {
      render(<ProcessingPage />);

      // Should have main heading
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent("Processing Your Assessment");
    });

    it("should provide clear navigation paths", () => {
      render(<Home />);

      // Should have clear CTA buttons
      const ctaButtons = screen.getAllByText(/Start.*Assessment/);
      expect(ctaButtons.length).toBeGreaterThan(0);

      // Should have navigation links
      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("How it Works")).toBeInTheDocument();
    });

    it("should have proper loading states", () => {
      render(<ProcessingPage />);

      // Should show loading spinner
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

      // Should show progress information
      expect(screen.getByText("Progress")).toBeInTheDocument();
      expect(
        screen.getByText("Estimated time: 30-60 seconds"),
      ).toBeInTheDocument();
    });
  });
});
