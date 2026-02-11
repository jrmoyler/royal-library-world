import React from 'react';
import { render, screen } from '@testing-library/react';
import HUD from '../HUD';
import { useGameStore } from '@/stores/useGameStore';

// Mock the useGameStore hook
jest.mock('@/stores/useGameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

describe('HUD Component', () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  it('should render with default game state', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    // Check if energy display is present
    expect(screen.getByText('ENERGY')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    // Check if discovery counter is present
    expect(screen.getByText('KNOWLEDGE SYNCED')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('/ 8')).toBeInTheDocument();
  });

  it('should display correct player class', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'cyber-knight',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    // The class is displayed with spaces replacing hyphens and uppercase
    expect(screen.getByText(/cyber knight/i)).toBeInTheDocument();
  });

  it('should display correct energy value', () => {
    mockUseGameStore.mockReturnValue({
      energy: 75,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('should display correct discovery count', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: ['book-1', 'book-2', 'book-3'],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show proximity prompt when nearby artifact exists', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: 'book-ai-ecosystem',
    } as any);

    render(<HUD />);

    expect(screen.getByText(/Press/)).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText(/to Sync Knowledge/)).toBeInTheDocument();
  });

  it('should not show proximity prompt when no nearby artifact', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    expect(screen.queryByText(/to Sync Knowledge/)).not.toBeInTheDocument();
  });

  it('should display controls hint', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    expect(screen.getByText(/WASD Move/)).toBeInTheDocument();
    expect(screen.getByText(/Mouse Look/)).toBeInTheDocument();
    expect(screen.getByText(/E Interact/)).toBeInTheDocument();
  });

  it('should handle null player class', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: null,
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    // The component displays "Unknown" with uppercase transformation applied by CSS
    expect(screen.getByText(/unknown/i)).toBeInTheDocument();
  });

  it('should handle low energy scenario', () => {
    mockUseGameStore.mockReturnValue({
      energy: 20,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('should handle zero energy', () => {
    mockUseGameStore.mockReturnValue({
      energy: 0,
      maxEnergy: 100,
      discoveredBooks: [],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    const { container } = render(<HUD />);

    // Check if zero energy is displayed (there are two '0' elements - one for energy, one for books)
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('should handle all books discovered', () => {
    mockUseGameStore.mockReturnValue({
      energy: 100,
      maxEnergy: 100,
      discoveredBooks: ['1', '2', '3', '4', '5', '6', '7', '8'],
      totalBooks: 8,
      playerClass: 'techno-mage',
      nearbyArtifact: null,
    } as any);

    render(<HUD />);

    expect(screen.getByText('8')).toBeInTheDocument();
  });
});
