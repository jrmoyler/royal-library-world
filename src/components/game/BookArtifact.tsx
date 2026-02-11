'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, BookData } from '@/stores/useGameStore';

interface BookArtifactProps {
  book: BookData;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export default function BookArtifact({ book, position, rotation = [0, 0, 0] }: BookArtifactProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [isNearby, setIsNearby] = useState(false);
  const { setNearbyArtifact, nearbyArtifact, discoverBook, setActiveBook, discoveredBooks } = useGameStore();

  const isDiscovered = discoveredBooks.includes(book.id);
  // Color used in materials directly from book.color

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
  const particlePositions = useRef<Float32Array>();
  if (!particlePositions.current) {
    const count = 20;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1.5;
      arr[i * 3 + 1] = Math.random() * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
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

    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 3) * 0.5;
    }

    // Particles float upward
    if (particlesRef.current && particlePositions.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.getAttribute('position');
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        y += 0.01;
        if (y > 2.5) y = 0;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Physics body - static */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.3, 0.4, 0.2]} position={[0, 0.5, 0]} />

        {/* Proximity sensor */}
        <CuboidCollider
          args={[2.5, 2, 2.5]}
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

      {/* Pedestal */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
        <meshStandardMaterial
          color="#2a2a35"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Pedestal circuit ring */}
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.42, 32]} />
        <meshStandardMaterial
          color={book.color}
          emissive={book.color}
          emissiveIntensity={isNearby ? 2 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* The Book */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef} castShadow rotation={[0.2, rotation[1], 0.05]}>
          {/* Book body */}
          <boxGeometry args={[0.5, 0.08, 0.65]} />
          <meshStandardMaterial
            color={isDiscovered ? '#4a3728' : '#3a2820'}
            metalness={0.2}
            roughness={0.8}
          />

          {/* Crystal on cover */}
          <mesh ref={glowRef} position={[0, 0.06, 0]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial
              color={book.color}
              emissive={book.color}
              emissiveIntensity={2}
              toneMapped={false}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Metal corners */}
          {[[-0.22, 0.04, -0.29], [0.22, 0.04, -0.29], [-0.22, 0.04, 0.29], [0.22, 0.04, 0.29]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <boxGeometry args={[0.06, 0.02, 0.06]} />
              <meshStandardMaterial color="#667788" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}

          {/* Spine binding */}
          <mesh position={[-0.26, 0, 0]}>
            <boxGeometry args={[0.02, 0.1, 0.65]} />
            <meshStandardMaterial color="#2a1a12" metalness={0.3} roughness={0.7} />
          </mesh>
        </mesh>
      </Float>

      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions.current!, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={book.color}
          size={0.04}
          transparent
          opacity={isNearby ? 0.8 : 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Title label (visible when nearby) */}
      {isNearby && (
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.15}
          color={book.color}
          anchorX="center"
          anchorY="bottom"
          font="/fonts/Rajdhani-Medium.ttf"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {book.title}
        </Text>
      )}

      {/* Discovery indicator */}
      {isDiscovered && (
        <mesh position={[0.3, 1.3, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
