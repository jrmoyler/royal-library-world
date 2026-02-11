'use client';

import dynamic from 'next/dynamic';
import { useGameStore } from '@/stores/useGameStore';
import TitleScreen from '@/components/ui/TitleScreen';
import CharacterSelect from '@/components/ui/CharacterSelect';
import HUD from '@/components/ui/HUD';
import BookReader from '@/components/ui/BookReader';

// Dynamic import for the 3D scene to avoid SSR issues
const Scene = dynamic(() => import('@/components/game/Scene'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a12',
      fontFamily: 'var(--font-mono)',
      color: 'var(--color-cyan)',
      fontSize: '0.85rem',
      letterSpacing: '0.2em',
    }}>
      INITIALIZING AETHERIA PROTOCOL...
    </div>
  ),
});

export default function GameWrapper() {
  const gamePhase = useGameStore((s) => s.gamePhase);

  return (
    <>
      {gamePhase === 'title' && <TitleScreen />}
      {gamePhase === 'character-select' && <CharacterSelect />}
      {(gamePhase === 'playing' || gamePhase === 'reading') && (
        <>
          <Scene />
          <HUD />
          {gamePhase === 'reading' && <BookReader />}
        </>
      )}
    </>
  );
}
