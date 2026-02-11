'use client';

import { useRef, Suspense, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import { CharacterModel as GLBCharacterModel } from '@/components/models/ModelLoader';

/**
 * Enhanced 3D Character Models with GLB Support
 *
 * AUTOMATICALLY DETECTS GLB MODELS:
 * - If GLB model exists: Uses high-quality GLB model
 * - If GLB missing: Falls back to procedural geometry
 * - Seamless switching between both modes
 *
 * GLB Files Expected in /public/models/:
 * - futuristic-avatar.glb (Cipher-Rogue)
 * - futuristic-knight.glb (Data-Knight)
 * - futuristic-armored-wizard.glb (Techno-Mage)
 */

// Loading fallback for GLB models
function CharacterLoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <capsuleGeometry args={[0.3, 1, 8, 16]} />
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

interface CharacterModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animationState?: 'idle' | 'walk' | 'run' | 'strafe';
  movementDirection?: THREE.Vector3;
}

/**
 * Enhanced Techno-Mage Model
 * - Flowing robes with glowing circuit patterns
 * - Ornate staff with pulsing crystal
 * - Hooded figure with mystical aura
 * - Floating magical orbs
 */
export function TechnoMageModel({
  position = [0, 0, 0],
  animationState = 'idle',
  movementDirection = new THREE.Vector3()
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);
  const staffRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!groupRef.current) return;

    // Animation based on state
    switch (animationState) {
      case 'idle':
        // Gentle floating animation
        groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.sin(t * 1.5) * 0.02;
        }
        break;

      case 'walk':
        // Walking bob animation
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * 0.08;
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.sin(t * 4) * 0.05;
          bodyRef.current.rotation.z = Math.sin(t * 4) * 0.03;
        }
        break;

      case 'run':
        // Running bob animation
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 6)) * 0.12;
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.sin(t * 6) * 0.08;
          bodyRef.current.rotation.z = Math.sin(t * 6) * 0.05;
        }
        break;

      case 'strafe':
        // Side-to-side lean
        if (bodyRef.current) {
          bodyRef.current.rotation.z = Math.sin(t * 3) * 0.08;
        }
        break;
    }

    // Orbiting energy orbs
    if (orb1Ref.current && orb2Ref.current) {
      const radius = 0.6;
      const height = 1.5 + Math.sin(t * 1.5) * 0.1;
      orb1Ref.current.position.set(
        Math.cos(t * 2) * radius,
        height,
        Math.sin(t * 2) * radius
      );
      orb2Ref.current.position.set(
        Math.cos(t * 2 + Math.PI) * radius,
        height,
        Math.sin(t * 2 + Math.PI) * radius
      );
    }

    // Staff rotation
    if (staffRef.current) {
      staffRef.current.rotation.z = Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main Body - Robed figure */}
      <group ref={bodyRef}>
        {/* Torso - Upper robe */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <coneGeometry args={[0.35, 0.8, 8]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#00f0ff"
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Lower robe - flowing */}
        <mesh castShadow position={[0, 0.7, 0]}>
          <coneGeometry args={[0.5, 1.2, 8]} />
          <meshStandardMaterial
            color="#0f0f1e"
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* Hood */}
        <mesh castShadow position={[0, 1.9, -0.05]}>
          <coneGeometry args={[0.35, 0.5, 8]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#00f0ff"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Head - glowing face under hood */}
        <mesh castShadow position={[0, 1.8, 0.05]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#2a2a4e"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Shoulder pads with circuit patterns */}
        <mesh castShadow position={[0.35, 1.6, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.25]} />
          <meshStandardMaterial
            color="#2a2a4e"
            emissive="#00f0ff"
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh castShadow position={[-0.35, 1.6, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.25]} />
          <meshStandardMaterial
            color="#2a2a4e"
            emissive="#00f0ff"
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Circuit patterns on robe - vertical lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={`circuit-${i}`} position={[0, 0.4 + i * 0.25, 0.36]}>
            <ringGeometry args={[0.28 + i * 0.03, 0.30 + i * 0.03, 8]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.8 - i * 0.1}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}

        {/* Belt/sash with ornate design */}
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.12, 16]} />
          <meshStandardMaterial
            color="#4a4a6e"
            emissive="#00f0ff"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Staff - Ornate magical staff */}
      <group ref={staffRef} position={[0.4, 1.2, 0]}>
        {/* Staff shaft - segmented with glowing sections */}
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
          <meshStandardMaterial
            color="#3a3a5e"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Staff rings */}
        {[0, 0.4, 0.8, 1.2].map((y) => (
          <mesh key={`ring-${y}`} position={[0, y - 0.6, 0]}>
            <torusGeometry args={[0.06, 0.02, 8, 12]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={1}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Staff top - large crystal */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={3}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>

        {/* Crystal glow aura */}
        <mesh position={[0, 1.3, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>

        {/* Crystal light source */}
        <pointLight
          position={[0, 1.3, 0]}
          color="#00f0ff"
          intensity={2}
          distance={3}
          decay={2}
        />
      </group>

      {/* Floating energy orbs */}
      <mesh ref={orb1Ref} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={orb2Ref} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Ambient glow around character */}
      <pointLight
        position={[0, 1.2, 0]}
        color="#00f0ff"
        intensity={0.5}
        distance={2}
        decay={2}
      />
    </group>
  );
}

/**
 * Enhanced Cyber-Knight Model
 * - Heavy metallic armor with plating
 * - Dual wielding photon swords
 * - Helmet with glowing visor
 * - Powered exoskeleton design
 */
export function CyberKnightModel({
  position = [0, 0, 0],
  animationState = 'idle',
  movementDirection = new THREE.Vector3()
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sword1Ref = useRef<THREE.Group>(null);
  const sword2Ref = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Mesh>(null);
  const legRRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!groupRef.current) return;

    // Animation based on state
    switch (animationState) {
      case 'idle':
        // Slight breathing animation
        groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.02;
        if (bodyRef.current) {
          bodyRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;
        }
        // Sword idle sway
        if (sword1Ref.current && sword2Ref.current) {
          sword1Ref.current.rotation.z = -Math.PI / 4 + Math.sin(t * 1.5) * 0.05;
          sword2Ref.current.rotation.z = Math.PI / 4 + Math.sin(t * 1.5) * 0.05;
        }
        break;

      case 'walk':
        // Walking animation - alternating legs
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * 0.06;
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.x = Math.sin(t * 4) * 0.4;
          legRRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.4;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.sin(t * 4) * 0.05;
        }
        break;

      case 'run':
        // Running animation - more pronounced
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 6)) * 0.1;
        if (legLRef.current && legRRef.current) {
          legLRef.current.rotation.x = Math.sin(t * 6) * 0.6;
          legRRef.current.rotation.x = Math.sin(t * 6 + Math.PI) * 0.6;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.x = Math.sin(t * 6) * 0.08;
        }
        // Sword swing motion
        if (sword1Ref.current && sword2Ref.current) {
          sword1Ref.current.rotation.z = -Math.PI / 4 + Math.sin(t * 6) * 0.2;
          sword2Ref.current.rotation.z = Math.PI / 4 + Math.sin(t * 6 + Math.PI) * 0.2;
        }
        break;

      case 'strafe':
        // Lean into strafe direction
        if (bodyRef.current) {
          bodyRef.current.rotation.z = Math.sin(t * 2) * 0.1;
        }
        break;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={bodyRef}>
        {/* Torso - Heavy armor plating */}
        <mesh castShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.45]} />
          <meshStandardMaterial
            color="#1a3a3a"
            emissive="#00d4aa"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* Chest plate - central armor with circuit */}
        <mesh castShadow position={[0, 1.2, 0.23]}>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.4}
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>

        {/* Power core on chest */}
        <mesh position={[0, 1.3, 0.26]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Shoulder armor - large pauldrons */}
        <mesh castShadow position={[0.5, 1.5, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.5]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh castShadow position={[-0.5, 1.5, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.5]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Shoulder lights */}
        <mesh position={[0.5, 1.5, 0.26]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1.5}
          />
        </mesh>
        <mesh position={[-0.5, 1.5, 0.26]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Head - Helmet with visor */}
        <mesh castShadow position={[0, 1.85, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.3}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Helmet crest */}
        <mesh castShadow position={[0, 2.05, 0]}>
          <boxGeometry args={[0.42, 0.08, 0.35]} />
          <meshStandardMaterial
            color="#3a5a5a"
            emissive="#00d4aa"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Visor - glowing face panel */}
        <mesh position={[0, 1.85, 0.21]}>
          <planeGeometry args={[0.3, 0.12]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Waist armor */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.25, 8]} />
          <meshStandardMaterial
            color="#1a3a3a"
            metalness={0.85}
            roughness={0.4}
          />
        </mesh>

        {/* Arms - Armored limbs */}
        <mesh castShadow position={[0.35, 0.9, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
          <meshStandardMaterial
            color="#1a3a3a"
            metalness={0.85}
            roughness={0.4}
          />
        </mesh>
        <mesh castShadow position={[-0.35, 0.9, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
          <meshStandardMaterial
            color="#1a3a3a"
            metalness={0.85}
            roughness={0.4}
          />
        </mesh>

        {/* Forearms */}
        <mesh castShadow position={[0.35, 0.4, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.6, 8]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        <mesh castShadow position={[-0.35, 0.4, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.6, 8]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Legs - Heavy armored legs with animation pivots */}
      <group position={[0.2, 0.65, 0]}>
        <mesh ref={legLRef} castShadow>
          <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
          <meshStandardMaterial
            color="#1a3a3a"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
        {/* Leg armor plate */}
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[0.2, 0.5, 0.08]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      </group>

      <group position={[-0.2, 0.65, 0]}>
        <mesh ref={legRRef} castShadow>
          <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
          <meshStandardMaterial
            color="#1a3a3a"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
        {/* Leg armor plate */}
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[0.2, 0.5, 0.08]} />
          <meshStandardMaterial
            color="#2a4a4a"
            emissive="#00d4aa"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Boots - armored feet */}
      <mesh castShadow position={[0.2, 0.15, 0.05]}>
        <boxGeometry args={[0.18, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#2a4a4a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      <mesh castShadow position={[-0.2, 0.15, 0.05]}>
        <boxGeometry args={[0.18, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#2a4a4a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Photon Blade - Right hand */}
      <group ref={sword1Ref} position={[0.65, 1.0, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
        {/* Blade */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 1.4, 0.12]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
        {/* Blade glow */}
        <mesh scale={[1.3, 1, 1.8]}>
          <boxGeometry args={[0.08, 1.4, 0.12]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
        {/* Hilt */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.25, 8]} />
          <meshStandardMaterial
            color="#2a4a4a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Photon Blade - Left hand */}
      <group ref={sword2Ref} position={[-0.65, 1.0, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        {/* Blade */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 1.4, 0.12]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
        {/* Blade glow */}
        <mesh scale={[1.3, 1, 1.8]}>
          <boxGeometry args={[0.08, 1.4, 0.12]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
        {/* Hilt */}
        <mesh castShadow position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.25, 8]} />
          <meshStandardMaterial
            color="#2a4a4a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Character glow */}
      <pointLight
        position={[0, 1.2, 0.3]}
        color="#00d4aa"
        intensity={0.6}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}

/**
 * Enhanced Shadow Agent Model
 * (Keeping original for now, will enhance if needed)
 */
export function ShadowAgentModel({
  position = [0, 0, 0],
  animationState = 'idle',
  movementDirection = new THREE.Vector3()
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dagger1Ref = useRef<THREE.Group>(null);
  const dagger2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!groupRef.current) return;

    switch (animationState) {
      case 'idle':
        groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.03;
        if (groupRef.current) {
          groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.08;
        }
        break;

      case 'walk':
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 5)) * 0.1;
        break;

      case 'run':
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 8)) * 0.15;
        break;

      case 'strafe':
        groupRef.current.rotation.z = Math.sin(t * 3) * 0.1;
        break;
    }

    // Dagger hover animation
    if (dagger1Ref.current && dagger2Ref.current) {
      dagger1Ref.current.position.y = 1.2 + Math.sin(t * 2) * 0.05;
      dagger2Ref.current.position.y = 1.2 + Math.sin(t * 2 + Math.PI) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
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
      </group>

      <pointLight
        position={[0, 1.2, 0]}
        color="#8b5cf6"
        intensity={0.4}
        distance={2}
        decay={2}
      />
    </group>
  );
}

/**
 * GLB Model Wrapper with Fallback
 * Attempts to load GLB, falls back to procedural on error
 */
function GLBModelWrapper({
  characterClass,
  proceduralComponent,
  ...props
}: CharacterModelProps & {
  characterClass: 'cipher-rogue' | 'data-knight' | 'techno-mage';
  proceduralComponent: React.ComponentType<CharacterModelProps>;
}) {
  const [hasGLB, setHasGLB] = useState(false);
  const [checked, setChecked] = useState(false);

  const ProceduralComponent = proceduralComponent;

  useEffect(() => {
    // Check if GLB model exists
    const modelPaths = {
      'cipher-rogue': '/models/dual-wield-assassin.glb',
      'data-knight': '/models/futuristic-knight.glb',
      'techno-mage': '/models/futuristic-armored-wizard.glb',
    };

    fetch(modelPaths[characterClass], { method: 'HEAD' })
      .then(response => {
        setHasGLB(response.ok);
        setChecked(true);
      })
      .catch(() => {
        setHasGLB(false);
        setChecked(true);
      });
  }, [characterClass]);

  if (!checked) {
    return <CharacterLoadingFallback />;
  }

  if (hasGLB) {
    return (
      <Suspense fallback={<CharacterLoadingFallback />}>
        <GLBCharacterModel
          characterClass={characterClass}
          position={props.position}
          rotation={props.rotation || [0, 0, 0]}
          scale={1}
        />
      </Suspense>
    );
  }

  // Fallback to procedural model
  return <ProceduralComponent {...props} />;
}

/**
 * Main Character Model component that switches based on player class
 * AUTOMATICALLY USES GLB IF AVAILABLE, OTHERWISE USES PROCEDURAL
 */
export default function CharacterModel(props: CharacterModelProps) {
  const playerClass = useGameStore((s) => s.playerClass);

  if (!playerClass) return null;

  const classMap = {
    'techno-mage': TechnoMageModel,
    'data-knight': CyberKnightModel,
    'cipher-rogue': ShadowAgentModel,
  } as const;

  const ProceduralComponent = classMap[playerClass];

  return (
    <GLBModelWrapper
      characterClass={playerClass}
      proceduralComponent={ProceduralComponent}
      {...props}
    />
  );
}
