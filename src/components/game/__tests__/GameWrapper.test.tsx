import React from 'react';
import { render, screen } from '@testing-library/react';
import GameWrapper from '../GameWrapper';
import { useGameStore } from '@/stores/useGameStore';

// Mock the child components
jest.mock('@/components/ui/TitleScreen', () => {
  return function MockTitleScreen() {
    return <div data-testid="title-screen">Title Screen</div>;
  };
});

jest.mock('@/components/ui/CharacterSelect', () => {
  return function MockCharacterSelect() {
    return <div data-testid="character-select">Character Select</div>;
  };
});

jest.mock('@/components/ui/HUD', () => {
  return function MockHUD() {
    return <div data-testid="hud">HUD</div>;
  };
});

jest.mock('@/components/ui/BookReader', () => {
  return function MockBookReader() {
    return <div data-testid="book-reader">Book Reader</div>;
  };
});

// Mock next/dynamic for Scene component
jest.mock('next/dynamic', () => {
  return function dynamic(importFn: any, options?: any) {
    // Return a simple mock component for Scene
    return function MockScene() {
      return <div data-testid="scene">Scene</div>;
    };
  };
});

jest.mock('@/stores/useGameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

describe('GameWrapper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render TitleScreen when gamePhase is title', () => {
    // Mock useGameStore as a selector function
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { gamePhase: 'title' };
      return selector ? selector(state) : state;
    });

    render(<GameWrapper />);

    expect(screen.getByTestId('title-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('character-select')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scene')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hud')).not.toBeInTheDocument();
  });

  it('should render CharacterSelect when gamePhase is character-select', () => {
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { gamePhase: 'character-select' };
      return selector ? selector(state) : state;
    });

    render(<GameWrapper />);

    expect(screen.getByTestId('character-select')).toBeInTheDocument();
    expect(screen.queryByTestId('title-screen')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scene')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hud')).not.toBeInTheDocument();
  });

  it('should render Scene and HUD when gamePhase is playing', () => {
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { gamePhase: 'playing' };
      return selector ? selector(state) : state;
    });

    render(<GameWrapper />);

    expect(screen.getByTestId('scene')).toBeInTheDocument();
    expect(screen.getByTestId('hud')).toBeInTheDocument();
    expect(screen.queryByTestId('title-screen')).not.toBeInTheDocument();
    expect(screen.queryByTestId('character-select')).not.toBeInTheDocument();
    expect(screen.queryByTestId('book-reader')).not.toBeInTheDocument();
  });

  it('should render Scene, HUD, and BookReader when gamePhase is reading', () => {
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { gamePhase: 'reading' };
      return selector ? selector(state) : state;
    });

    render(<GameWrapper />);

    expect(screen.getByTestId('scene')).toBeInTheDocument();
    expect(screen.getByTestId('hud')).toBeInTheDocument();
    expect(screen.getByTestId('book-reader')).toBeInTheDocument();
    expect(screen.queryByTestId('title-screen')).not.toBeInTheDocument();
    expect(screen.queryByTestId('character-select')).not.toBeInTheDocument();
  });

  it('should only render one phase at a time', () => {
    const phases: Array<'title' | 'character-select' | 'playing' | 'reading'> = [
      'title',
      'character-select',
      'playing',
      'reading',
    ];

    phases.forEach(phase => {
      mockUseGameStore.mockImplementation((selector: any) => {
        const state = { gamePhase: phase };
        return selector ? selector(state) : state;
      });

      const { unmount } = render(<GameWrapper />);

      // Count how many phase-specific elements are rendered
      const hasTitle = screen.queryByTestId('title-screen');
      const hasCharSelect = screen.queryByTestId('character-select');
      const hasScene = screen.queryByTestId('scene');

      // Ensure only appropriate components for this phase are rendered
      if (phase === 'title') {
        expect(hasTitle).toBeInTheDocument();
        expect(hasCharSelect).not.toBeInTheDocument();
        expect(hasScene).not.toBeInTheDocument();
      } else if (phase === 'character-select') {
        expect(hasTitle).not.toBeInTheDocument();
        expect(hasCharSelect).toBeInTheDocument();
        expect(hasScene).not.toBeInTheDocument();
      } else if (phase === 'playing' || phase === 'reading') {
        expect(hasTitle).not.toBeInTheDocument();
        expect(hasCharSelect).not.toBeInTheDocument();
        expect(hasScene).toBeInTheDocument();
      }

      unmount();
    });
  });

  it('should transition from playing to reading phase', () => {
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { gamePhase: 'playing' };
      return selector ? selector(state) : state;
    });

    const { rerender } = render(<GameWrapper />);

    expect(screen.getByTestId('scene')).toBeInTheDocument();
    expect(screen.getByTestId('hud')).toBeInTheDocument();
    expect(screen.queryByTestId('book-reader')).not.toBeInTheDocument();

    // Change to reading phase
    mockUseGameStore.mockImplementation((selector: any) => {
      const state = { gamePhase: 'reading' };
      return selector ? selector(state) : state;
    });

    rerender(<GameWrapper />);

    expect(screen.getByTestId('scene')).toBeInTheDocument();
    expect(screen.getByTestId('hud')).toBeInTheDocument();
    expect(screen.getByTestId('book-reader')).toBeInTheDocument();
  });
});
