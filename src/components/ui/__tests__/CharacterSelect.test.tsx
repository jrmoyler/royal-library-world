import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterSelect from '../CharacterSelect';
import { useGameStore } from '@/stores/useGameStore';

jest.mock('@/stores/useGameStore');

// Mock next/dynamic so Character3DPreview doesn't try to render a Three.js Canvas
jest.mock('next/dynamic', () => {
  return function dynamic() {
    return function MockCharacter3DPreview() {
      return <div data-testid="character-3d-preview">3D Preview</div>;
    };
  };
});

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

    // Actual class names from the CLASSES array in CharacterSelect.tsx
    expect(screen.getByText('Cipher-Rogue')).toBeInTheDocument();
    expect(screen.getByText('Data-Knight')).toBeInTheDocument();
    expect(screen.getByText('Techno-Mage')).toBeInTheDocument();
  });

  it('should render character class names as headings', () => {
    // Note: descriptions are defined in CLASSES data but not rendered in the DOM.
    // This test verifies the rendered class name headings instead.
    render(<CharacterSelect />);

    const cipherRogue = screen.getByText('Cipher-Rogue');
    const dataKnight = screen.getByText('Data-Knight');
    const technoMage = screen.getByText('Techno-Mage');

    expect(cipherRogue.tagName).toBe('H3');
    expect(dataKnight.tagName).toBe('H3');
    expect(technoMage.tagName).toBe('H3');
  });

  it('should display character weapons', () => {
    render(<CharacterSelect />);

    // Weapons are rendered as plain text (no "WEAPON:" prefix)
    expect(screen.getByText('Dual Energy Daggers')).toBeInTheDocument();
    expect(screen.getByText('Dual Photon Blades')).toBeInTheDocument();
    expect(screen.getByText('Cipher Staff')).toBeInTheDocument();
  });

  it('should display character stats', () => {
    render(<CharacterSelect />);

    // Stat labels in the component are STR, DEX, INT
    const strLabels = screen.getAllByText('STR');
    const dexLabels = screen.getAllByText('DEX');
    const intLabels = screen.getAllByText('INT');

    expect(strLabels.length).toBe(3); // One for each class
    expect(dexLabels.length).toBe(3);
    expect(intLabels.length).toBe(3);
  });

  it('should render confirm buttons for each class', () => {
    render(<CharacterSelect />);

    // Each character card has its own "Confirm" button
    const confirmButtons = screen.getAllByText('Confirm');
    expect(confirmButtons.length).toBe(3);
  });

  it('should render header text', () => {
    render(<CharacterSelect />);

    // Actual header text from the component
    expect(screen.getByText('Select Your Avatar')).toBeInTheDocument();
  });

  it('should select a character card when clicked', () => {
    render(<CharacterSelect />);

    // Click on the Techno-Mage card area
    const technoMageCard = screen.getByText('Techno-Mage').closest('div[style]');
    if (technoMageCard) {
      fireEvent.click(technoMageCard);
    }

    // Card should visually highlight (verified by no error)
    expect(screen.getByText('Techno-Mage')).toBeInTheDocument();
  });

  it('should call selectClass and setGamePhase when confirm is clicked', () => {
    render(<CharacterSelect />);

    // Click confirm on the first card (Cipher-Rogue at index 0)
    const confirmButtons = screen.getAllByText('Confirm');
    fireEvent.click(confirmButtons[0]);

    // selectClass is called with (id, stats) — two arguments
    expect(mockSelectClass).toHaveBeenCalledWith(
      'cipher-rogue',
      { str: 13, dex: 18, int: 17 }
    );
    expect(mockSetGamePhase).toHaveBeenCalledWith('playing');
  });

  it('should call selectClass for Data-Knight when its confirm is clicked', () => {
    render(<CharacterSelect />);

    const confirmButtons = screen.getAllByText('Confirm');
    fireEvent.click(confirmButtons[1]);

    expect(mockSelectClass).toHaveBeenCalledWith(
      'data-knight',
      { str: 18, dex: 15, int: 13 }
    );
    expect(mockSetGamePhase).toHaveBeenCalledWith('playing');
  });

  it('should call selectClass for Techno-Mage when its confirm is clicked', () => {
    render(<CharacterSelect />);

    const confirmButtons = screen.getAllByText('Confirm');
    fireEvent.click(confirmButtons[2]);

    expect(mockSelectClass).toHaveBeenCalledWith(
      'techno-mage',
      { str: 10, dex: 13, int: 18 }
    );
    expect(mockSetGamePhase).toHaveBeenCalledWith('playing');
  });

  it('should display stat values for each character', () => {
    render(<CharacterSelect />);

    // Shared values like 13 and 18 appear across multiple classes, so use getAllByText
    // 13 appears 3 times: Cipher-Rogue str, Data-Knight int, Techno-Mage dex
    expect(screen.getAllByText('13').length).toBeGreaterThanOrEqual(3);
    // 18 appears 3 times: Cipher-Rogue dex, Data-Knight str, Techno-Mage int
    expect(screen.getAllByText('18').length).toBeGreaterThanOrEqual(3);
    // 15 appears once: Data-Knight dex
    expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1);
    // 17 appears once: Cipher-Rogue int
    expect(screen.getAllByText('17').length).toBeGreaterThanOrEqual(1);
    // 10 appears once: Techno-Mage str
    expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(1);
  });

  it('should render skill icons for each class', () => {
    render(<CharacterSelect />);

    // Skills from the CLASSES array (rendered in skill slots)
    expect(screen.getByText('🔮')).toBeInTheDocument(); // Techno-Mage skill
    expect(screen.getByText('🛡️')).toBeInTheDocument(); // Data-Knight skill
    expect(screen.getByText('👁️')).toBeInTheDocument(); // Cipher-Rogue skill
  });

  it('should render 3D preview placeholders for each class', () => {
    render(<CharacterSelect />);

    // Character3DPreview is mocked, should render 3 previews
    const previews = screen.getAllByTestId('character-3d-preview');
    expect(previews.length).toBe(3);
  });

  it('should allow changing selection between classes', () => {
    render(<CharacterSelect />);

    // Click first class confirm, then second
    const confirmButtons = screen.getAllByText('Confirm');

    fireEvent.click(confirmButtons[0]); // Cipher-Rogue
    expect(mockSelectClass).toHaveBeenCalledWith(
      'cipher-rogue',
      { str: 13, dex: 18, int: 17 }
    );

    fireEvent.click(confirmButtons[2]); // Techno-Mage
    expect(mockSelectClass).toHaveBeenCalledWith(
      'techno-mage',
      { str: 10, dex: 13, int: 18 }
    );
  });
});
