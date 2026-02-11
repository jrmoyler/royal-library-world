'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';

/**
 * 3D Character Model Component
 *
 * This component creates a procedural 3D character model based on the selected class.
 * Each class has a unique appearance:
 * - Techno-Mage: Cyan/blue with glowing orbs (wisdom)
 * - Cyber-Knight: Teal/green with armor plating (strength)
 * - Shadow Agent: Purple with sleek design (agility)
 *
 * To use GLB models instead:
 * 1. Place GLB files in /public/models/
 * 2. Import useGLTF from @react-three/drei
 * 3. Replace procedural geometry with: const { scene } = useGLTF('/models/character.glb')
 * 4. Return <primitive object={scene.clone()} />
 */

interface CharacterModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function TechnoMageModel({ position = [0, 0, 0], rotation = [0, 0, 0] }: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Floating animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
    }

    // Orbiting orbs
    if (orb1Ref.current && orb2Ref.current) {
      const radius = 0.5;
      orb1Ref.current.position.x = Math.cos(t * 2) * radius;
      orb1Ref.current.position.z = Math.sin(t * 2) * radius;
      orb2Ref.current.position.x = Math.cos(t * 2 + Math.PI) * radius;
      orb2Ref.current.position.z = Math.sin(t * 2 + Math.PI) * radius;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Body - Robed figure */}
      <mesh castShadow position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 1.2, 6]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00f0ff"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#2a2a4e"
          emissive="#00f0ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Staff */}
      <mesh castShadow position={[0.3, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color="#3a3a5e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Staff crystal */}
      <mesh castShadow position={[0.3, 2.2, 0]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Floating orbs */}
      <mesh ref={orb1Ref} castShadow position={[0.5, 1.5, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh ref={orb2Ref} castShadow position={[-0.5, 1.5, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Cloak details - circuit patterns */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.5 + i * 0.2, 0.35]}>
          <ringGeometry args={[0.25, 0.27, 6]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CyberKnightModel({ position = [0, 0, 0], rotation = [0, 0, 0] }: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Subtle idle animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.02;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Body - Armored torso */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial
          color="#1a3a3a"
          emissive="#00d4aa"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Shoulder pads */}
      <mesh castShadow position={[0.4, 1.5, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.5]} />
        <meshStandardMaterial
          color="#2a4a4a"
          emissive="#00d4aa"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh castShadow position={[-0.4, 1.5, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.5]} />
        <meshStandardMaterial
          color="#2a4a4a"
          emissive="#00d4aa"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Head - Helmet */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial
          color="#2a4a4a"
          emissive="#00d4aa"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 1.8, 0.18]}>
        <planeGeometry args={[0.25, 0.1]} />
        <meshStandardMaterial
          color="#00d4aa"
          emissive="#00d4aa"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[0.15, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.3]} />
        <meshStandardMaterial
          color="#1a3a3a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
      <mesh castShadow position={[-0.15, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.3]} />
        <meshStandardMaterial
          color="#1a3a3a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Sword - Photon Blade */}
      <group position={[0.5, 1, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh castShadow>
          <boxGeometry args={[0.05, 1.2, 0.1]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Blade glow */}
        <mesh scale={[1.2, 1, 1.5]}>
          <boxGeometry args={[0.05, 1.2, 0.1]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* Chest plate circuit */}
      <mesh position={[0, 1.2, 0.21]}>
        <ringGeometry args={[0.08, 0.12, 6]} />
        <meshStandardMaterial
          color="#00d4aa"
          emissive="#00d4aa"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

export function ShadowAgentModel({ position = [0, 0, 0], rotation = [0, 0, 0] }: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dagger1Ref = useRef<THREE.Group>(null);
  const dagger2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slight sway animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.03;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.8) * 0.08;
    }

    // Dagger hover animation
    if (dagger1Ref.current && dagger2Ref.current) {
      dagger1Ref.current.position.y = 1.2 + Math.sin(t * 2) * 0.05;
      dagger2Ref.current.position.y = 1.2 + Math.sin(t * 2 + Math.PI) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Body - Sleek suit */}
      <mesh castShadow position={[0, 1, 0]}>
        <capsuleGeometry args={[0.25, 1, 8, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {/* Head - Hood */}
      <mesh castShadow position={[0, 1.7, 0]}>
        <coneGeometry args={[0.3, 0.4, 8]} />
        <meshStandardMaterial
          color="#0a0a1e"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Face mask */}
      <mesh position={[0, 1.6, 0.15]}>
        <planeGeometry args={[0.15, 0.08]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Arms */}
      <mesh castShadow position={[0.3, 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.3, 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[0.12, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.12, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Energy Daggers */}
      <group ref={dagger1Ref} position={[0.4, 1.2, 0.2]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.03, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Dagger glow */}
        <mesh rotation={[0, 0, Math.PI / 4]} scale={[1.5, 1, 1.5]}>
          <boxGeometry args={[0.03, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      <group ref={dagger2Ref} position={[-0.4, 1.2, 0.2]}>
        <mesh castShadow rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.03, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Dagger glow */}
        <mesh rotation={[0, 0, -Math.PI / 4]} scale={[1.5, 1, 1.5]}>
          <boxGeometry args={[0.03, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Shadow trail particles */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.5 + i * 0.3, -0.2 - i * 0.1]}>
          <sphereGeometry args={[0.08 - i * 0.02, 8, 8]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1 - i * 0.3}
            transparent
            opacity={0.5 - i * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Main Character Model component that switches based on player class
 */
export default function CharacterModel(props: CharacterModelProps) {
  const playerClass = useGameStore((s) => s.playerClass);

  if (!playerClass) return null;

  switch (playerClass) {
    case 'techno-mage':
      return <TechnoMageModel {...props} />;
    case 'cyber-knight':
      return <CyberKnightModel {...props} />;
    case 'shadow-agent':
      return <ShadowAgentModel {...props} />;
    default:
      return null;
  }
}
