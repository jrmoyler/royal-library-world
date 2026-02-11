'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, BookData } from '@/stores/useGameStore';

/**
 * Enhanced Magical Book Artifact
 *
 * Based on ornate book design with:
 * - Large glowing crystal centerpiece
 * - Decorative metal corners (brass/gold)
 * - Leather-bound cover with embossing
 * - Floating particles and magical aura
 * - Pulsing glow effects
 *
 * To use GLB models:
 * 1. Place book GLB files in /public/models/books/
 * 2. Import: import { useGLTF } from '@react-three/drei'
 * 3. Replace geometry with: const { scene } = useGLTF('/models/books/magical-book.glb')
 */

interface BookArtifactProps {
  book: BookData;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export default function BookArtifact({ book, position, rotation = [0, 0, 0] }: BookArtifactProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [isNearby, setIsNearby] = useState(false);
  const { setNearbyArtifact, nearbyArtifact, discoverBook, setActiveBook, discoveredBooks } = useGameStore();

  const isDiscovered = discoveredBooks.includes(book.id);

  // Handle keyboard interaction
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && nearbyArtifact === book.id) {
        if (!isDiscovered) {
          discoverBook(book.id);
        }
        setActiveBook(book);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nearbyArtifact, book, isDiscovered, discoverBook, setActiveBook]);

  // Create particle geometry
  const particlePositions = useRef<Float32Array | null>(null);
  if (!particlePositions.current) {
    const count = 30;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1.8;
      arr[i * 3 + 1] = Math.random() * 2.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    particlePositions.current = arr;
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Book hover animation
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.15 + 0.5;
      meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.15;
    }

    // Crystal pulse
    if (crystalRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.15;
      crystalRef.current.scale.set(scale, scale, scale);
      const mat = crystalRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3 + Math.sin(t * 2) * 0.5;
    }

    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2.5) * 0.2;
      glowRef.current.scale.set(scale, scale, scale);
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + Math.sin(t * 3) * 0.8;
    }

    // Particles float upward and rotate
    if (particlesRef.current && particlePositions.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.getAttribute('position');
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        y += 0.015;
        if (y > 2.8) y = 0;
        posAttr.setY(i, y);

        // Spiral motion
        const angle = t * 0.5 + i * 0.2;
        const radius = 0.3 + Math.sin(y * 2) * 0.2;
        posAttr.setX(i, Math.cos(angle) * radius);
        posAttr.setZ(i, Math.sin(angle) * radius);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Physics body - static */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.4, 0.5, 0.3]} position={[0, 0.6, 0]} />

        {/* Proximity sensor - larger detection range */}
        <CuboidCollider
          args={[3, 2.5, 3]}
          position={[0, 1, 0]}
          sensor
          onIntersectionEnter={() => {
            setIsNearby(true);
            setNearbyArtifact(book.id);
          }}
          onIntersectionExit={() => {
            setIsNearby(false);
            if (nearbyArtifact === book.id) {
              setNearbyArtifact(null);
            }
          }}
        />
      </RigidBody>

      {/* Ornate Pedestal */}
      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.65, 0.16, 8]} />
          <meshStandardMaterial
            color="#2a2a35"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Mid section */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.52, 0.12, 8]} />
          <meshStandardMaterial
            color="#3a3a45"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Top platform */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.48, 0.06, 16]} />
          <meshStandardMaterial
            color="#4a4a55"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Pedestal circuit patterns */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <mesh
              key={angle}
              position={[Math.cos(rad) * 0.52, 0.22, Math.sin(rad) * 0.52]}
              rotation={[0, rad, 0]}
            >
              <boxGeometry args={[0.03, 0.08, 0.02]} />
              <meshStandardMaterial
                color={book.color}
                emissive={book.color}
                emissiveIntensity={isNearby ? 2 : 0.8}
              />
            </mesh>
          );
        })}

        {/* Glowing ring on pedestal */}
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.48, 32]} />
          <meshStandardMaterial
            color={book.color}
            emissive={book.color}
            emissiveIntensity={isNearby ? 2.5 : 1}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* The Magical Book */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={meshRef} rotation={[0.15, rotation[1], 0.05]}>
          {/* Book body - leather bound */}
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.12, 0.8]} />
            <meshStandardMaterial
              color={isDiscovered ? '#5a4030' : '#3a2820'}
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>

          {/* Book cover embossing - decorative patterns */}
          <mesh position={[0, 0.065, 0]}>
            <boxGeometry args={[0.55, 0.01, 0.75]} />
            <meshStandardMaterial
              color={isDiscovered ? '#6a5040' : '#4a3830'}
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>

          {/* Border decoration on cover */}
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[0.52, 0.01, 0.02]} />
            <meshStandardMaterial
              color="#8a7050"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.72, 0.01, 0.02]} />
            <meshStandardMaterial
              color="#8a7050"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* Central Crystal - Large glowing gem */}
          <mesh ref={crystalRef} position={[0, 0.12, 0]} castShadow>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color={book.color}
              emissive={book.color}
              emissiveIntensity={3}
              toneMapped={false}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Crystal inner glow */}
          <mesh position={[0, 0.12, 0]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={book.color}
              emissiveIntensity={5}
              toneMapped={false}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Crystal outer aura */}
          <mesh ref={glowRef} position={[0, 0.12, 0]}>
            <octahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial
              color={book.color}
              emissive={book.color}
              emissiveIntensity={2}
              toneMapped={false}
              transparent
              opacity={0.25}
            />
          </mesh>

          {/* Ornate Metal Corners - Brass/Gold */}
          {[
            [-0.28, 0.065, -0.38],
            [0.28, 0.065, -0.38],
            [-0.28, 0.065, 0.38],
            [0.28, 0.065, 0.38]
          ].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              {/* Corner base */}
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.04, 0.08]} />
                <meshStandardMaterial
                  color="#b8860b"
                  emissive="#b8860b"
                  emissiveIntensity={0.3}
                  metalness={0.95}
                  roughness={0.15}
                />
              </mesh>
              {/* Corner decoration - small pyramid */}
              <mesh castShadow position={[0, 0.03, 0]}>
                <coneGeometry args={[0.05, 0.04, 4]} />
                <meshStandardMaterial
                  color="#daa520"
                  emissive="#daa520"
                  emissiveIntensity={0.4}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Corner gem accent */}
              <mesh position={[0, 0.04, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial
                  color={book.color}
                  emissive={book.color}
                  emissiveIntensity={2}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))}

          {/* Spine binding - leather with metal bands */}
          <mesh position={[-0.31, 0, 0]} castShadow>
            <boxGeometry args={[0.02, 0.14, 0.8]} />
            <meshStandardMaterial
              color="#2a1a12"
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>

          {/* Metal bands on spine */}
          {[-0.25, 0, 0.25].map((z) => (
            <mesh key={z} position={[-0.31, 0.01, z]}>
              <boxGeometry args={[0.025, 0.15, 0.04]} />
              <meshStandardMaterial
                color="#b8860b"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          ))}

          {/* Page edges - slightly yellowed */}
          <mesh position={[0.3, 0, 0]}>
            <boxGeometry args={[0.02, 0.10, 0.78]} />
            <meshStandardMaterial
              color="#f5e6d3"
              roughness={0.95}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating magical particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions.current!, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={book.color}
          size={0.06}
          transparent
          opacity={isNearby ? 0.9 : 0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Crystal light source */}
      <pointLight
        position={[0, 0.8, 0]}
        color={book.color}
        intensity={isNearby ? 3 : 1.5}
        distance={4}
        decay={2}
        castShadow
      />

      {/* Ambient glow beneath book */}
      <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial
          color={book.color}
          emissive={book.color}
          emissiveIntensity={isNearby ? 1.5 : 0.5}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Title label (visible when nearby) */}
      {isNearby && (
        <>
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.18}
            color={book.color}
            anchorX="center"
            anchorY="bottom"
            font="/fonts/Rajdhani-Medium.ttf"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {book.title}
          </Text>

          {/* Interaction prompt */}
          <Text
            position={[0, 2.2, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
            font="/fonts/Rajdhani-Medium.ttf"
            outlineWidth={0.008}
            outlineColor="#000000"
          >
            Press E to {isDiscovered ? 'read' : 'discover'}
          </Text>
        </>
      )}

      {/* Discovery indicator */}
      {isDiscovered && (
        <group position={[0.4, 1.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
          <mesh scale={1.5}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={1}
              toneMapped={false}
              transparent
              opacity={0.3}
            />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            color="#00ff88"
            intensity={1}
            distance={2}
            decay={2}
          />
        </group>
      )}
    </group>
  );
}
