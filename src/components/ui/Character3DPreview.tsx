'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CharacterModel as GLBCharacterModel } from '@/components/models/ModelLoader';
import * as THREE from 'three';

/**
 * 3D Character Preview Component
 * Shows actual GLB character models in character selection screen
 */

interface Character3DPreviewProps {
  characterClass: 'cipher-rogue' | 'data-knight' | 'techno-mage';
  color: string;
  isSelected?: boolean;
  isHovered?: boolean;
}

// Loading fallback - simple wireframe character
function PreviewFallback({ color }: { color: string }) {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
      <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        wireframe
      />
    </mesh>
  );
}

// 3D Model component with rotation
function CharacterPreviewModel({
  characterClass,
  color,
  isSelected,
}: {
  characterClass: 'cipher-rogue' | 'data-knight' | 'techno-mage';
  color: string;
  isSelected?: boolean;
}) {
  const modelRef = useRef<THREE.Group>(null);
  const [hasModel, setHasModel] = useState(false);

  useEffect(() => {
    // Check if GLB exists
    const modelPaths = {
      'cipher-rogue': '/models/dual-wield-assassin.glb',
      'data-knight': '/models/futuristic-knight.glb',
      'techno-mage': '/models/futuristic-armored-wizard.glb',
    };

    if (typeof window !== 'undefined') {
      fetch(modelPaths[characterClass], { method: 'HEAD' })
        .then(response => setHasModel(response.ok))
        .catch(() => setHasModel(false));
    }
  }, [characterClass]);

  useEffect(() => {
    // Gentle rotation animation
    if (!modelRef.current) return;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      if (modelRef.current) {
        rotation += isSelected ? 0.005 : 0.002;
        modelRef.current.rotation.y = rotation;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isSelected]);

  if (!hasModel) {
    return <PreviewFallback color={color} />;
  }

  return (
    <group ref={modelRef} position={[0, -1, 0]}>
      <Suspense fallback={<PreviewFallback color={color} />}>
        <GLBCharacterModel
          characterClass={characterClass}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={1}
        />
      </Suspense>
    </group>
  );
}

// Main 3D Preview Canvas
export default function Character3DPreview({
  characterClass,
  color,
  isSelected = false,
  isHovered: _isHovered = false,
}: Character3DPreviewProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '200px',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)',
        border: `1px solid ${color}30`,
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[0, 1, 4]}
          fov={45}
        />

        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.6}
          castShadow
        />
        <pointLight
          position={[0, 2, 0]}
          color={color}
          intensity={isSelected ? 2 : 1}
          distance={6}
        />
        <pointLight
          position={[-2, 1, 2]}
          color={color}
          intensity={0.5}
          distance={4}
        />

        {/* Character Model */}
        <CharacterPreviewModel
          characterClass={characterClass}
          color={color}
          isSelected={isSelected}
        />

        {/* Platform/Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 0.3 : 0.1}
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Glow ring around platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 1 : 0.5}
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>

        {/* Orbit controls (subtle) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Overlay gradient for depth */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
