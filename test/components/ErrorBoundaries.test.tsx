import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorInfo } from 'react';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import FormErrorBoundary from '@/components/error/FormErrorBoundary';
import ReportErrorBoundary from '@/components/error/ReportErrorBoundary';
import ApiErrorBoundary from '@/components/error/ApiErrorBoundary';
import NetworkErrorBoundary from '@/components/error/NetworkErrorBoundary';
import ErrorBoundaryProvider, { useErrorHandler } from '@/components/error/ErrorBoundaryProvider';

// Mock the logger
vi.mock('@/lib/privacy/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    details: ({ children, ...props }: any) => <details {...props}>{children}</details>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock form steps
vi.mock('@/lib/form-steps', () => ({
  formSteps: [{ id: 'personal-info' }],
}));

// Component that throws an error
function ThrowError({ shouldThrow = false, errorMessage = 'Test error' }) {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
}

// Component that uses error handler
function ErrorHandlerComponent() {
  const { reportError, clearError, hasGlobalError } = useErrorHandler();
  
  return (
    <div>
      <button onClick={() => reportError(new Error('Manual error'), 'test')}>
        Report Error
      </button>
      <button onClick={clearError}>Clear Error</button>
      <div data-testid="error-status">
        {hasGlobalError ? 'Has Error' : 'No Error'}
      </div>
    </div>
  );
}

describe('Error Boundaries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('ErrorBoundary', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render default error fallback when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
        <div>
          <div>Custom Error: {error.message}</div>
          <button onClick={resetError}>Custom Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} errorMessage="Custom error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error: Custom error message')).toBeInTheDocument();
      expect(screen.getByText('Custom Reset')).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} errorMessage="Callback test" />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Callback test' }),
        expect.any(Object)
      );
    });

    it('should reset error state when Try Again is clicked', async () => {
      let shouldThrow = true;
      const TestComponent = () => <ThrowError shouldThrow={shouldThrow} />;
      
      const { rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Click Try Again and update the error state
      shouldThrow = false;
      fireEvent.click(screen.getByText('Try Again'));

      // Re-render with no error
      rerender(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByText('No error')).toBeInTheDocument();
      });
    });
  });

  describe('FormErrorBoundary', () => {
    it('should render form-specific error message', () => {
      render(
        <FormErrorBoundary>
          <ThrowError shouldThrow={true} />
        </FormErrorBoundary>
      );

      expect(screen.getByText('Form Error')).toBeInTheDocument();
      expect(screen.getByText(/There was an issue with the assessment form/)).toBeInTheDocument();
      expect(screen.getByText('Continue Assessment')).toBeInTheDocument();
      expect(screen.getByText('Start Over')).toBeInTheDocument();
    });
  });

  describe('ReportErrorBoundary', () => {
    it('should render report-specific error message', () => {
      render(
        <ReportErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ReportErrorBoundary>
      );

      expect(screen.getByText('Report Generation Error')).toBeInTheDocument();
      expect(screen.getByText(/We couldn't generate your personalized report/)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Retake Assessment')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });
  });

  describe('ApiErrorBoundary', () => {
    it('should render network error message for fetch errors', () => {
      render(
        <ApiErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="fetch failed" />
        </ApiErrorBoundary>
      );

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByText(/Unable to connect to our services/)).toBeInTheDocument();
    });

    it('should render rate limit error message', () => {
      render(
        <ApiErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="rate limit exceeded" />
        </ApiErrorBoundary>
      );

      expect(screen.getByText('Too Many Requests')).toBeInTheDocument();
      expect(screen.getByText(/You've made too many requests/)).toBeInTheDocument();
      expect(screen.getByText('Wait and Retry')).toBeInTheDocument();
    });

    it('should render AI service error message', () => {
      render(
        <ApiErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="AI service failed" />
        </ApiErrorBoundary>
      );

      expect(screen.getByText('AI Service Unavailable')).toBeInTheDocument();
      expect(screen.getByText(/Our AI analysis service is temporarily unavailable/)).toBeInTheDocument();
    });
  });

  describe('NetworkErrorBoundary', () => {
    beforeEach(() => {
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });
    });

    it('should render network error for fetch failures', () => {
      render(
        <NetworkErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="fetch failed" />
        </NetworkErrorBoundary>
      );

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should render offline message when navigator is offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(
        <NetworkErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="network error" />
        </NetworkErrorBoundary>
      );

      expect(screen.getByText("You're Offline")).toBeInTheDocument();
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('should re-throw non-network errors', () => {
      // This should be caught by a parent error boundary
      expect(() => {
        render(
          <ErrorBoundary>
            <NetworkErrorBoundary>
              <ThrowError shouldThrow={true} errorMessage="validation error" />
            </NetworkErrorBoundary>
          </ErrorBoundary>
        );
      }).not.toThrow();

      // Should show the parent error boundary's fallback
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('ErrorBoundaryProvider', () => {
    it('should provide error handling context', () => {
      render(
        <ErrorBoundaryProvider>
          <ErrorHandlerComponent />
        </ErrorBoundaryProvider>
      );

      expect(screen.getByText('No Error')).toBeInTheDocument();
      expect(screen.getByText('Report Error')).toBeInTheDocument();
      expect(screen.getByText('Clear Error')).toBeInTheDocument();
    });

    it('should handle manual error reporting', async () => {
      render(
        <ErrorBoundaryProvider enableGlobalNotifications={true}>
          <ErrorHandlerComponent />
        </ErrorBoundaryProvider>
      );

      fireEvent.click(screen.getByText('Report Error'));

      await waitFor(() => {
        expect(screen.getByText('Has Error')).toBeInTheDocument();
      });
    });

    it('should clear errors when requested', async () => {
      render(
        <ErrorBoundaryProvider>
          <ErrorHandlerComponent />
        </ErrorBoundaryProvider>
      );

      // Report error
      fireEvent.click(screen.getByText('Report Error'));
      
      await waitFor(() => {
        expect(screen.getByText('Has Error')).toBeInTheDocument();
      });

      // Clear error
      fireEvent.click(screen.getByText('Clear Error'));

      await waitFor(() => {
        expect(screen.getByText('No Error')).toBeInTheDocument();
      });
    });

    it('should show error notifications when enabled', async () => {
      render(
        <ErrorBoundaryProvider enableGlobalNotifications={true}>
          <ErrorHandlerComponent />
        </ErrorBoundaryProvider>
      );

      fireEvent.click(screen.getByText('Report Error'));

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Manual error')).toBeInTheDocument();
      });
    });

    it('should not show notifications when disabled', () => {
      render(
        <ErrorBoundaryProvider enableGlobalNotifications={false}>
          <ErrorHandlerComponent />
        </ErrorBoundaryProvider>
      );

      fireEvent.click(screen.getByText('Report Error'));

      // Should not show notification
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should handle nested error boundaries correctly', () => {
      render(
        <ErrorBoundary>
          <FormErrorBoundary>
            <ThrowError shouldThrow={true} />
          </FormErrorBoundary>
        </ErrorBoundary>
      );

      // Should show the FormErrorBoundary fallback, not the parent
      expect(screen.getByText('Form Error')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should propagate errors when child boundary cannot handle them', () => {
      render(
        <ErrorBoundary>
          <NetworkErrorBoundary>
            <ThrowError shouldThrow={true} errorMessage="validation error" />
          </NetworkErrorBoundary>
        </ErrorBoundary>
      );

      // NetworkErrorBoundary should re-throw non-network errors
      // Parent ErrorBoundary should catch it
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});