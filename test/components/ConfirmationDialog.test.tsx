import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Title',
    message: 'Test message content',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up body overflow after each test
    document.body.style.overflow = '';
    cleanup();
  });

  it('should render when open', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message content')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<ConfirmationDialog {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm and onClose when confirm button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Confirm'));
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button (X) is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when dialog content is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    const dialogContent = screen.getByText('Test Title');
    fireEvent.click(dialogContent);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    const { container } = render(<ConfirmationDialog {...defaultProps} />);
    
    const dialog = container.querySelector('[role="dialog"]');
    fireEvent.keyDown(dialog!, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should use custom button text when provided', () => {
    const { container } = render(
      <ConfirmationDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    
    expect(container).toHaveTextContent('Delete');
    expect(container).toHaveTextContent('Keep');
    expect(container).not.toHaveTextContent('Confirm');
    expect(container).not.toHaveTextContent('Cancel');
  });

  it('should apply warning variant styles by default', () => {
    const { container } = render(<ConfirmationDialog {...defaultProps} />);
    
    const confirmButton = container.querySelector('button:last-child');
    expect(confirmButton).toHaveClass('bg-amber-600');
  });

  it('should apply danger variant styles', () => {
    const { container } = render(<ConfirmationDialog {...defaultProps} variant="danger" />);
    
    const confirmButton = container.querySelector('button:last-child');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('should apply info variant styles', () => {
    const { container } = render(<ConfirmationDialog {...defaultProps} variant="info" />);
    
    const confirmButton = container.querySelector('button:last-child');
    expect(confirmButton).toHaveClass('bg-blue-600');
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<ConfirmationDialog {...defaultProps} />);
    
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description');
    
    const title = container.querySelector('#dialog-title');
    expect(title).toHaveAttribute('id', 'dialog-title');
    expect(title).toHaveTextContent('Test Title');
    
    const message = container.querySelector('#dialog-description');
    expect(message).toHaveAttribute('id', 'dialog-description');
    expect(message).toHaveTextContent('Test message content');
  });

  it('should prevent body scroll when open', async () => {
    // Reset body overflow before test
    document.body.style.overflow = '';
    
    const { rerender } = render(<ConfirmationDialog {...defaultProps} isOpen={false} />);
    
    // Should not change overflow when closed (allow both empty string and unset)
    expect(['', 'unset']).toContain(document.body.style.overflow);
    
    rerender(<ConfirmationDialog {...defaultProps} isOpen={true} />);
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
    
    rerender(<ConfirmationDialog {...defaultProps} isOpen={false} />);
    
    await waitFor(() => {
      expect(['unset', '']).toContain(document.body.style.overflow);
    });
  });
});