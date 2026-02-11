import { renderHook, act } from '@testing-library/react';
import { useGameStore } from '../useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.resetGame();
    });
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useGameStore());

      expect(result.current.energy).toBe(100);
      expect(result.current.maxEnergy).toBe(100);
      expect(result.current.playerClass).toBeNull();
      expect(result.current.playerName).toBe('Wanderer');
      expect(result.current.gamePhase).toBe('title');
      expect(result.current.discoveredBooks).toEqual([]);
      expect(result.current.activeBook).toBeNull();
      expect(result.current.showHUD).toBe(true);
      expect(result.current.nearbyArtifact).toBeNull();
      expect(result.current.showMinimap).toBe(false);
      expect(result.current.books.length).toBe(8); // 8 portfolio books
      expect(result.current.totalBooks).toBe(8);
    });
  });

  describe('Game Phase Management', () => {
    it('should change game phase', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setGamePhase('character-select');
      });

      expect(result.current.gamePhase).toBe('character-select');
    });

    it('should transition through all game phases', () => {
      const { result } = renderHook(() => useGameStore());
      const phases: Array<'title' | 'character-select' | 'playing' | 'reading'> =
        ['title', 'character-select', 'playing', 'reading'];

      phases.forEach(phase => {
        act(() => {
          result.current.setGamePhase(phase);
        });
        expect(result.current.gamePhase).toBe(phase);
      });
    });
  });

  describe('Player Class Selection', () => {
    it('should select techno-mage class', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.selectClass('techno-mage');
      });

      expect(result.current.playerClass).toBe('techno-mage');
    });

    it('should select cyber-knight class', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.selectClass('cyber-knight');
      });

      expect(result.current.playerClass).toBe('cyber-knight');
    });

    it('should select shadow-agent class', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.selectClass('shadow-agent');
      });

      expect(result.current.playerClass).toBe('shadow-agent');
    });
  });

  describe('Player Name', () => {
    it('should set player name', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setPlayerName('TestPlayer');
      });

      expect(result.current.playerName).toBe('TestPlayer');
    });
  });

  describe('Energy Management', () => {
    it('should deplete energy correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.depleteEnergy(30);
      });

      expect(result.current.energy).toBe(70);
    });

    it('should not deplete energy below 0', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.depleteEnergy(150);
      });

      expect(result.current.energy).toBe(0);
    });

    it('should restore energy correctly', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.depleteEnergy(50);
        result.current.restoreEnergy(20);
      });

      expect(result.current.energy).toBe(70);
    });

    it('should not restore energy above maxEnergy', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.restoreEnergy(50);
      });

      expect(result.current.energy).toBe(100);
    });

    it('should handle multiple energy depletion operations', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.depleteEnergy(20);
        result.current.depleteEnergy(15);
        result.current.depleteEnergy(10);
      });

      expect(result.current.energy).toBe(55);
    });
  });

  describe('Book Discovery', () => {
    it('should discover a book and add to discoveredBooks', () => {
      const { result } = renderHook(() => useGameStore());
      const bookId = 'book-ai-ecosystem';

      act(() => {
        result.current.discoverBook(bookId);
      });

      expect(result.current.discoveredBooks).toContain(bookId);
      expect(result.current.discoveredBooks.length).toBe(1);
    });

    it('should mark book as discovered in books array', () => {
      const { result } = renderHook(() => useGameStore());
      const bookId = 'book-ai-ecosystem';

      act(() => {
        result.current.discoverBook(bookId);
      });

      const discoveredBook = result.current.books.find(b => b.id === bookId);
      expect(discoveredBook?.discovered).toBe(true);
    });

    it('should restore 10 energy when discovering a book', () => {
      const { result } = renderHook(() => useGameStore());
      const bookId = 'book-ai-ecosystem';

      act(() => {
        result.current.depleteEnergy(30);
        result.current.discoverBook(bookId);
      });

      expect(result.current.energy).toBe(80); // 70 + 10
    });

    it('should not add duplicate books to discoveredBooks', () => {
      const { result } = renderHook(() => useGameStore());
      const bookId = 'book-ai-ecosystem';

      act(() => {
        result.current.discoverBook(bookId);
        result.current.discoverBook(bookId);
        result.current.discoverBook(bookId);
      });

      expect(result.current.discoveredBooks.length).toBe(1);
    });

    it('should not exceed maxEnergy when discovering book at full energy', () => {
      const { result } = renderHook(() => useGameStore());
      const bookId = 'book-ai-ecosystem';

      act(() => {
        result.current.discoverBook(bookId);
      });

      expect(result.current.energy).toBe(100);
    });

    it('should discover multiple different books', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.discoverBook('book-ai-ecosystem');
        result.current.discoverBook('book-game-dev');
        result.current.discoverBook('book-prompt-eng');
      });

      expect(result.current.discoveredBooks.length).toBe(3);
    });
  });

  describe('Active Book Management', () => {
    it('should set active book and change phase to reading', () => {
      const { result } = renderHook(() => useGameStore());
      const book = result.current.books[0];

      act(() => {
        result.current.setActiveBook(book);
      });

      expect(result.current.activeBook).toEqual(book);
      expect(result.current.gamePhase).toBe('reading');
    });

    it('should clear active book and change phase to playing', () => {
      const { result } = renderHook(() => useGameStore());
      const book = result.current.books[0];

      act(() => {
        result.current.setActiveBook(book);
        result.current.setActiveBook(null);
      });

      expect(result.current.activeBook).toBeNull();
      expect(result.current.gamePhase).toBe('playing');
    });
  });

  describe('Nearby Artifact', () => {
    it('should set nearby artifact ID', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setNearbyArtifact('book-ai-ecosystem');
      });

      expect(result.current.nearbyArtifact).toBe('book-ai-ecosystem');
    });

    it('should clear nearby artifact', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setNearbyArtifact('book-ai-ecosystem');
        result.current.setNearbyArtifact(null);
      });

      expect(result.current.nearbyArtifact).toBeNull();
    });
  });

  describe('Minimap Toggle', () => {
    it('should toggle minimap on', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.toggleMinimap();
      });

      expect(result.current.showMinimap).toBe(true);
    });

    it('should toggle minimap off', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.toggleMinimap();
        result.current.toggleMinimap();
      });

      expect(result.current.showMinimap).toBe(false);
    });
  });

  describe('Game Reset', () => {
    it('should reset game to initial state', () => {
      const { result } = renderHook(() => useGameStore());

      // Make changes to the game state
      act(() => {
        result.current.setGamePhase('playing');
        result.current.selectClass('techno-mage');
        result.current.depleteEnergy(50);
        result.current.discoverBook('book-ai-ecosystem');
        result.current.setNearbyArtifact('book-game-dev');
        result.current.toggleMinimap();
      });

      // Reset the game
      act(() => {
        result.current.resetGame();
      });

      // Verify all state is reset
      expect(result.current.energy).toBe(100);
      expect(result.current.playerClass).toBeNull();
      expect(result.current.gamePhase).toBe('title');
      expect(result.current.discoveredBooks).toEqual([]);
      expect(result.current.activeBook).toBeNull();
      expect(result.current.nearbyArtifact).toBeNull();
      // Note: showMinimap is not reset in the current implementation
    });

    it('should reset all books to undiscovered state', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.discoverBook('book-ai-ecosystem');
        result.current.discoverBook('book-game-dev');
        result.current.resetGame();
      });

      const discoveredBooks = result.current.books.filter(b => b.discovered);
      expect(discoveredBooks.length).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete game flow', () => {
      const { result } = renderHook(() => useGameStore());

      // Start game
      act(() => {
        result.current.setGamePhase('character-select');
      });
      expect(result.current.gamePhase).toBe('character-select');

      // Select class
      act(() => {
        result.current.selectClass('cyber-knight');
        result.current.setGamePhase('playing');
      });
      expect(result.current.playerClass).toBe('cyber-knight');
      expect(result.current.gamePhase).toBe('playing');

      // Discover book
      act(() => {
        result.current.setNearbyArtifact('book-ai-ecosystem');
        result.current.discoverBook('book-ai-ecosystem');
      });
      expect(result.current.discoveredBooks.length).toBe(1);

      // Read book
      const book = result.current.books.find(b => b.id === 'book-ai-ecosystem');
      act(() => {
        result.current.setActiveBook(book || null);
      });
      expect(result.current.gamePhase).toBe('reading');
      expect(result.current.activeBook).toBeTruthy();

      // Close book
      act(() => {
        result.current.setActiveBook(null);
      });
      expect(result.current.gamePhase).toBe('playing');
      expect(result.current.activeBook).toBeNull();
    });
  });
});
