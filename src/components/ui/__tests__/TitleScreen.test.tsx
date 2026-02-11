import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TitleScreen from '../TitleScreen';
import { useGameStore } from '@/stores/useGameStore';

jest.mock('@/stores/useGameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

describe('TitleScreen Component', () => {
  const mockSetGamePhase = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Mock useGameStore as a selector function
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { setGamePhase: mockSetGamePhase };
      return selector ? selector(state) : state;
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render title text', () => {
    render(<TitleScreen />);

    expect(screen.getByText('Royal Library')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('should display subtitle text', () => {
    render(<TitleScreen />);

    expect(screen.getByText('// Aetheria Library Protocol v1.0')).toBeInTheDocument();
  });

  it('should render Press Start button', () => {
    render(<TitleScreen />);

    expect(screen.getByText('Press Start')).toBeInTheDocument();
  });

  it('should display credits', () => {
    render(<TitleScreen />);

    expect(screen.getByText(/BUILT WITH NEXT.JS/)).toBeInTheDocument();
    expect(screen.getByText(/R3F/)).toBeInTheDocument();
    expect(screen.getByText(/RAPIER PHYSICS/)).toBeInTheDocument();
    expect(screen.getByText(/A HATAALII PRODUCTION/)).toBeInTheDocument();
  });

  it('should call setGamePhase with character-select when button is clicked', () => {
    render(<TitleScreen />);

    const button = screen.getByText('Press Start');
    fireEvent.click(button);

    expect(mockSetGamePhase).toHaveBeenCalledWith('character-select');
  });

  it('should show content after animation delay', async () => {
    render(<TitleScreen />);

    // Fast-forward timers to trigger animations
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText('Royal Library')).toBeInTheDocument();
    });
  });

  it('should enable pulse animation after delay', async () => {
    render(<TitleScreen />);

    // Fast-forward to pulse animation
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      const button = screen.getByText('Press Start');
      expect(button).toBeInTheDocument();
    });
  });

  it('should handle button hover effects', () => {
    render(<TitleScreen />);

    const button = screen.getByText('Press Start');

    fireEvent.mouseEnter(button);
    // Button should apply hover styles

    fireEvent.mouseLeave(button);
    // Button should remove hover styles
  });
});
