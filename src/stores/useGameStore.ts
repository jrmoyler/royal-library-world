import { create } from 'zustand';

export interface BookData {
  id: string;
  title: string;
  description: string;
  category: 'project' | 'skill' | 'achievement' | 'lore';
  content: string;
  url?: string;
  icon: string;
  color: string;
  discovered: boolean;
}

export interface GameState {
  // Player state
  energy: number;
  maxEnergy: number;
  playerClass: 'techno-mage' | 'cyber-knight' | 'shadow-agent' | null;
  playerName: string;

  // Game state
  gamePhase: 'title' | 'character-select' | 'playing' | 'reading';
  discoveredBooks: string[];
  activeBook: BookData | null;
  totalBooks: number;
  showHUD: boolean;
  nearbyArtifact: string | null;
  showMinimap: boolean;

  // Portfolio books
  books: BookData[];

  // Actions
  setGamePhase: (phase: GameState['gamePhase']) => void;
  selectClass: (cls: GameState['playerClass']) => void;
  setPlayerName: (name: string) => void;
  depleteEnergy: (amount: number) => void;
  restoreEnergy: (amount: number) => void;
  discoverBook: (bookId: string) => void;
  setActiveBook: (book: BookData | null) => void;
  setNearbyArtifact: (id: string | null) => void;
  toggleMinimap: () => void;
  resetGame: () => void;
}

const PORTFOLIO_BOOKS: BookData[] = [
  {
    id: 'book-ai-ecosystem',
    title: 'The Collective Intelligence Stack',
    description: 'A 450+ agent AI ecosystem spanning 15 departments',
    category: 'project',
    content: 'An autonomous multi-agent system orchestrating specialized AI agents across strategy, engineering, research, medicine, finance, security, and governance. Each agent carries domain expertise and collaborates through structured workflows to solve complex multi-domain problems.',
    url: '#',
    icon: '🧠',
    color: '#00f0ff',
    discovered: false,
  },
  {
    id: 'book-game-dev',
    title: 'Royal Library World',
    description: 'A 3D gamified portfolio experience',
    category: 'project',
    content: 'This very experience you are exploring — a fusion of medieval architecture and cybernetic technology. Built with Next.js, React Three Fiber, and Rapier physics. Every stone holds circuitry, every book holds knowledge.',
    url: '#',
    icon: '🏰',
    color: '#00d4aa',
    discovered: false,
  },
  {
    id: 'book-prompt-eng',
    title: 'Grimoire of Prompt Arcana',
    description: 'Advanced prompt engineering across AI platforms',
    category: 'skill',
    content: 'Mastery over the arcane art of crafting precise instructions for artificial intelligences. From chain-of-thought reasoning to multi-modal prompting, these techniques shape raw computation into purposeful creation.',
    icon: '📜',
    color: '#ff6b35',
    discovered: false,
  },
  {
    id: 'book-automation',
    title: 'The Workflow Codex',
    description: 'n8n automation and pipeline engineering',
    category: 'skill',
    content: 'Complex automation workflows connecting disparate systems into unified pipelines. From content creation to data analysis, these workflows transform manual processes into autonomous operations.',
    icon: '⚡',
    color: '#ffd700',
    discovered: false,
  },
  {
    id: 'book-content',
    title: 'Scroll of Viral Alchemy',
    description: 'Content creation & community building',
    category: 'skill',
    content: 'The art of transforming industry developments into compelling narratives. Building and nurturing communities around AI and robotics intelligence through strategic content across Meta platforms and Skool.',
    icon: '🔥',
    color: '#ff3366',
    discovered: false,
  },
  {
    id: 'book-nexus-labs',
    title: 'Blueprint: Nexus Labs Studio',
    description: 'Film & AI education hub vision',
    category: 'project',
    content: 'A bold vision to convert Icon World Studio in Barberton, OH into a creative nexus — a physical space where film production meets AI education, bridging the digital and physical worlds of creation.',
    url: '#',
    icon: '🎬',
    color: '#9b59b6',
    discovered: false,
  },
  {
    id: 'book-collectiveos',
    title: 'CollectiveOS Interface Design',
    description: 'Cyber-Glass hybrid native application',
    category: 'project',
    content: 'A hybrid native application featuring the signature Cyber-Glass aesthetic — translucent panels, neon accents, and data streams. The operating system for the Collective Intelligence Stack.',
    icon: '💎',
    color: '#00bfff',
    discovered: false,
  },
  {
    id: 'book-achievement-builder',
    title: 'Master Builder Achievement',
    description: 'Created production-ready applications',
    category: 'achievement',
    content: 'From React dashboards to crypto trading interfaces, from DNA visualization tools to telemedicine platforms — each creation pushes the boundary of what is possible when human creativity meets artificial intelligence.',
    icon: '🏆',
    color: '#ffd700',
    discovered: false,
  },
];

export const useGameStore = create<GameState>((set) => ({
  energy: 100,
  maxEnergy: 100,
  playerClass: null,
  playerName: 'Wanderer',

  gamePhase: 'title',
  discoveredBooks: [],
  activeBook: null,
  totalBooks: PORTFOLIO_BOOKS.length,
  showHUD: true,
  nearbyArtifact: null,
  showMinimap: false,

  books: PORTFOLIO_BOOKS,

  setGamePhase: (phase) => set({ gamePhase: phase }),

  selectClass: (cls) => set({ playerClass: cls }),

  setPlayerName: (name) => set({ playerName: name }),

  depleteEnergy: (amount) =>
    set((state) => ({
      energy: Math.max(0, state.energy - amount),
    })),

  restoreEnergy: (amount) =>
    set((state) => ({
      energy: Math.min(state.maxEnergy, state.energy + amount),
    })),

  discoverBook: (bookId) =>
    set((state) => {
      if (state.discoveredBooks.includes(bookId)) return state;
      const updatedBooks = state.books.map((b) =>
        b.id === bookId ? { ...b, discovered: true } : b
      );
      return {
        discoveredBooks: [...state.discoveredBooks, bookId],
        books: updatedBooks,
        energy: Math.min(state.maxEnergy, state.energy + 10),
      };
    }),

  setActiveBook: (book) =>
    set({
      activeBook: book,
      gamePhase: book ? 'reading' : 'playing',
    }),

  setNearbyArtifact: (id) => set({ nearbyArtifact: id }),

  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),

  resetGame: () =>
    set({
      energy: 100,
      playerClass: null,
      gamePhase: 'title',
      discoveredBooks: [],
      activeBook: null,
      nearbyArtifact: null,
      showMinimap: false, // Reset minimap state on game reset
      books: PORTFOLIO_BOOKS.map((b) => ({ ...b, discovered: false })),
    }),
}));
