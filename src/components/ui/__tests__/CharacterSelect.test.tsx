import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterSelect from '../CharacterSelect';
import { useGameStore } from '@/stores/useGameStore';

jest.mock('@/stores/useGameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

describe('CharacterSelect Component', () => {
  const mockSelectClass = jest.fn();
  const mockSetGamePhase = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGameStore.mockReturnValue({
      selectClass: mockSelectClass,
      setGamePhase: mockSetGamePhase,
    } as any);
  });

  it('should render all three character classes', () => {
    render(<CharacterSelect />);

    expect(screen.getByText('Techno-Mage')).toBeInTheDocument();
    expect(screen.getByText('Cyber-Knight')).toBeInTheDocument();
    expect(screen.getByText('Shadow Agent')).toBeInTheDocument();
  });

  it('should display character descriptions', () => {
    render(<CharacterSelect />);

    expect(screen.getByText(/Wielders of data streams and code spells/)).toBeInTheDocument();
    expect(screen.getByText(/Armored sentinels with circuit-veined plate/)).toBeInTheDocument();
    expect(screen.getByText(/Silent operatives who move between data nodes/)).toBeInTheDocument();
  });

  it('should display character weapons', () => {
    render(<CharacterSelect />);

    expect(screen.getByText(/WEAPON: Cipher Staff/)).toBeInTheDocument();
    expect(screen.getByText(/WEAPON: Photon Blade/)).toBeInTheDocument();
    expect(screen.getByText(/WEAPON: Energy Daggers/)).toBeInTheDocument();
  });

  it('should display character stats', () => {
    render(<CharacterSelect />);

    // Check if stat labels are present
    const wisdomStats = screen.getAllByText(/wisdom/i);
    const agilityStats = screen.getAllByText(/agility/i);
    const strengthStats = screen.getAllByText(/strength/i);

    expect(wisdomStats.length).toBe(3); // One for each class
    expect(agilityStats.length).toBe(3);
    expect(strengthStats.length).toBe(3);
  });

  it('should have disabled confirm button by default', () => {
    render(<CharacterSelect />);

    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    expect(confirmButton).toBeDisabled();
  });

  it('should enable confirm button when class is selected', () => {
    render(<CharacterSelect />);

    const technoMageButton = screen.getByText('Techno-Mage').closest('button');
    if (technoMageButton) {
      fireEvent.click(technoMageButton);
    }

    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should select techno-mage on click', () => {
    render(<CharacterSelect />);

    const technoMageButton = screen.getByText('Techno-Mage').closest('button');
    if (technoMageButton) {
      fireEvent.click(technoMageButton);
    }

    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should select cyber-knight on click', () => {
    render(<CharacterSelect />);

    const cyberKnightButton = screen.getByText('Cyber-Knight').closest('button');
    if (cyberKnightButton) {
      fireEvent.click(cyberKnightButton);
    }

    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should select shadow-agent on click', () => {
    render(<CharacterSelect />);

    const shadowAgentButton = screen.getByText('Shadow Agent').closest('button');
    if (shadowAgentButton) {
      fireEvent.click(shadowAgentButton);
    }

    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should call selectClass and setGamePhase when confirming', () => {
    render(<CharacterSelect />);

    // Select techno-mage
    const technoMageButton = screen.getByText('Techno-Mage').closest('button');
    if (technoMageButton) {
      fireEvent.click(technoMageButton);
    }

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    fireEvent.click(confirmButton);

    expect(mockSelectClass).toHaveBeenCalledWith('techno-mage');
    expect(mockSetGamePhase).toHaveBeenCalledWith('playing');
  });

  it('should allow changing selection before confirming', () => {
    render(<CharacterSelect />);

    // Select techno-mage
    const technoMageButton = screen.getByText('Techno-Mage').closest('button');
    if (technoMageButton) {
      fireEvent.click(technoMageButton);
    }

    // Change to cyber-knight
    const cyberKnightButton = screen.getByText('Cyber-Knight').closest('button');
    if (cyberKnightButton) {
      fireEvent.click(cyberKnightButton);
    }

    // Confirm cyber-knight selection
    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });
    fireEvent.click(confirmButton);

    expect(mockSelectClass).toHaveBeenCalledWith('cyber-knight');
  });

  it('should not call selectClass when clicking disabled confirm button', () => {
    render(<CharacterSelect />);

    const confirmButton = screen.getByRole('button', { name: /Enter the Library/i });

    // Try to click disabled button (this won't actually trigger onClick due to disabled state)
    fireEvent.click(confirmButton);

    expect(mockSelectClass).not.toHaveBeenCalled();
    expect(mockSetGamePhase).not.toHaveBeenCalled();
  });

  it('should display header text', () => {
    render(<CharacterSelect />);

    expect(screen.getByText(/Choose Your Class/i)).toBeInTheDocument();
  });

  it('should display character icons', () => {
    render(<CharacterSelect />);

    expect(screen.getByText('🧙‍♂️')).toBeInTheDocument();
    expect(screen.getByText('⚔️')).toBeInTheDocument();
    expect(screen.getByText('🗡️')).toBeInTheDocument();
  });
});
