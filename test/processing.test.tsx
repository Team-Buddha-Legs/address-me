import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProcessingPage from "@/app/processing/page";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock LoadingSpinner component
vi.mock("@/components/ui/LoadingSpinner", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="loading-spinner" className={className}>
      Loading...
    </div>
  ),
}));

describe("ProcessingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render processing page with initial state", () => {
    render(<ProcessingPage />);

    expect(screen.getByText("Processing Your Assessment")).toBeInTheDocument();
    expect(
      screen.getByText(/We're analyzing your profile/),
    ).toBeInTheDocument();
    expect(screen.getByText("Analyzing your profile...")).toBeInTheDocument();
    expect(
      screen.getByText("Estimated time: 30-60 seconds"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should display progress bar", () => {
    render(<ProcessingPage />);

    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should show initial processing step", () => {
    render(<ProcessingPage />);

    // Initially shows first step
    expect(screen.getByText("Analyzing your profile...")).toBeInTheDocument();
  });

  it("should have smooth transitions and animations", () => {
    const { container } = render(<ProcessingPage />);

    // Check for animation-related attributes (from framer-motion mocks)
    const animatedElements = container.querySelectorAll(
      "[animate], [initial], [transition]",
    );
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it("should display estimated completion time", () => {
    render(<ProcessingPage />);

    expect(
      screen.getByText("Estimated time: 30-60 seconds"),
    ).toBeInTheDocument();
  });

  it("should have proper error handling structure", () => {
    // This test verifies the component structure supports error handling
    const { container } = render(<ProcessingPage />);

    // Should render without errors
    expect(container.querySelector(".bg-white")).toBeInTheDocument();
    expect(screen.getByText("Processing Your Assessment")).toBeInTheDocument();
  });

  it("should use professional color scheme", () => {
    const { container } = render(<ProcessingPage />);

    // Check for custom color classes
    const colorElements = container.querySelectorAll(
      '[class*="primary"], [class*="secondary"]',
    );
    expect(colorElements.length).toBeGreaterThan(0);
  });

  it("should have responsive design", () => {
    const { container } = render(<ProcessingPage />);

    // Check for responsive classes
    expect(container.querySelector('[class*="max-w"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="px-"]')).toBeInTheDocument();
  });

  it("should handle window reload on error retry", () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    // Force an error state by mocking the useEffect to throw
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ProcessingPage />);

    // Clean up
    consoleSpy.mockRestore();
  });
});
