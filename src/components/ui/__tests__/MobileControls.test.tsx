import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileControls from '../MobileControls';

describe('MobileControls Component', () => {
  const originalUserAgent = navigator.userAgent;
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
      configurable: true,
    });
  });

  it('should return null on desktop (non-mobile)', () => {
    // Default jsdom has desktop user agent and wide viewport
    const { container } = render(<MobileControls />);
    expect(container.firstChild).toBeNull();
  });

  it('should render controls on mobile user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true,
    });

    const { container } = render(<MobileControls />);

    // Component renders on mobile
    expect(container.querySelector('.mobile-controls')).toBeInTheDocument();
  });

  it('should render controls on small viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 600,
      writable: true,
      configurable: true,
    });
    // Trigger resize event so the component picks up the change
    fireEvent(window, new Event('resize'));

    const { container } = render(<MobileControls />);

    expect(container.querySelector('.mobile-controls')).toBeInTheDocument();
  });

  it('should render joystick and action button on mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true,
    });

    const { container } = render(<MobileControls />);

    expect(container.querySelector('.joystick-container')).toBeInTheDocument();
    expect(container.querySelector('.joystick-base')).toBeInTheDocument();
    expect(container.querySelector('.joystick-stick')).toBeInTheDocument();
    expect(screen.getByText('INTERACT')).toBeInTheDocument();
  });

  it('should respond to resize events', () => {
    // Start with desktop
    const { container, rerender } = render(<MobileControls />);
    expect(container.firstChild).toBeNull();

    // Simulate switching to mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      writable: true,
      configurable: true,
    });
    fireEvent(window, new Event('resize'));

    // Re-render to pick up state change
    rerender(<MobileControls />);
    expect(container.querySelector('.mobile-controls')).toBeInTheDocument();
  });

  it('should dispatch interact key event on button touch', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true,
    });

    const keydownSpy = jest.fn();
    window.addEventListener('keydown', keydownSpy);

    render(<MobileControls />);

    const interactButton = screen.getByText('INTERACT').closest('button');
    if (interactButton) {
      // Use touchstart since that's the actual handler
      fireEvent.touchStart(interactButton, {
        touches: [{ identifier: 0, clientX: 0, clientY: 0 }],
      });
    }

    expect(keydownSpy).toHaveBeenCalled();

    window.removeEventListener('keydown', keydownSpy);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<MobileControls />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
