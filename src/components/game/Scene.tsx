'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Stars, Preload } from '@react-three/drei';
import LibraryEnvironment from '@/components/environment/LibraryEnvironment';
import PlayerController from '@/components/characters/PlayerController';
import BookArtifact from '@/components/game/BookArtifact';
import { useGameStore } from '@/stores/useGameStore';

function BookArtifacts() {
  const books = useGameStore((s) => s.books);

  // Position books around the library
  const bookPositions: [number, number, number][] = [
    [-4, 0, -4],    // AI Ecosystem
    [4, 0, -4],     // Game Dev
    [-5, 0, 0],     // Prompt Engineering
    [5, 0, 0],      // Automation
    [-4, 0, 4],     // Content
    [4, 0, 4],      // Nexus Labs
    [-2, 0, -2],    // CollectiveOS
    [2, 0, -2],     // Achievement
  ];

  return (
    <>
      {books.map((book, i) => (
        <BookArtifact
          key={book.id}
          book={book}
          position={bookPositions[i] || [0, 0, 0]}
          rotation={[0, (i * Math.PI) / 4, 0]}
        />
      ))}
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#00f0ff" wireframe />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 65, near: 0.1, far: 100, position: [0, 2, 5] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0a0a12',
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
    >
      <color attach="background" args={['#0a0a12']} />

      <Suspense fallback={<LoadingFallback />}>
        <Physics gravity={[0, -9.81, 0]} debug={false}>
          <LibraryEnvironment />
          <PlayerController />
          <BookArtifacts />
        </Physics>

        {/* Sky / Stars visible through gaps */}
        <Stars radius={50} depth={30} count={2000} factor={3} saturation={0.5} />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.3}
            intensity={0.8}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.6} />
        </EffectComposer>

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
