'use client';

import { useRef, ReactElement, Suspense, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { CastleInteriorModel } from '@/components/models/ModelLoader';

/**
 * Enhanced Isometric Castle Library Environment
 * Based on reference images with:
 * - Stone castle walls with battlements
 * - Tiled floor pattern
 * - Central glowing beam of light
 * - Detailed wooden bookshelves with glowing books
 * - Holographic floating screens
 * - Wooden reading desks
 * - Enhanced lighting and atmosphere
 */

// Stone wall component with circuit patterns
function CastleWall({
  position,
  size,
  rotation = [0, 0, 0],
  hasBattlements = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  hasBattlements?: boolean;
}) {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} position={position} rotation={rotation} />

      {/* Main wall */}
      <mesh position={position} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#4a4a52"
          metalness={0.1}
          roughness={0.95}
        />
      </mesh>

      {/* Stone texture detail lines */}
      {[...Array(Math.floor(size[0] / 2))].map((_, i) => (
        <mesh
          key={`stone-${i}`}
          position={[
            position[0] - size[0] / 2 + i * 2 + 1,
            position[1],
            position[2] + size[2] / 2 + 0.01
          ]}
          rotation={rotation}
        >
          <planeGeometry args={[1.8, size[1]]} />
          <meshStandardMaterial
            color="#3a3a42"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Glowing circuit patterns on walls */}
      <mesh
        position={[position[0], position[1], position[2] + size[2] / 2 + 0.02]}
        rotation={rotation}
      >
        <planeGeometry args={[size[0] * 0.8, size[1] * 0.7]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Circuit line accents */}
      {[0.3, 0.6].map((heightFactor) => (
        <mesh
          key={`circuit-${heightFactor}`}
          position={[
            position[0],
            position[1] - size[1] / 2 + size[1] * heightFactor,
            position[2] + size[2] / 2 + 0.03
          ]}
          rotation={rotation}
        >
          <planeGeometry args={[size[0] * 0.7, 0.05]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Battlements on top */}
      {hasBattlements && (
        <>
          {[...Array(Math.floor(size[0] / 1.5))].map((_, i) => (
            <group key={`battlement-${i}`}>
              <mesh
                position={[
                  position[0] - size[0] / 2 + i * 1.5 + 0.75,
                  position[1] + size[1] / 2 + 0.3,
                  position[2]
                ]}
                castShadow
              >
                <boxGeometry args={[0.6, 0.6, size[2]]} />
                <meshStandardMaterial
                  color="#4a4a52"
                  roughness={0.95}
                />
              </mesh>
            </group>
          ))}
        </>
      )}
    </RigidBody>
  );
}

// Enhanced bookshelf with glowing books
function DetailedBookshelf({
  position,
  rotation = [0, 0, 0]
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const books: ReactElement[] = [];

  // Generate books with some glowing
  for (let shelf = 0; shelf < 5; shelf++) {
    for (let b = 0; b < 8; b++) {
      const h = 0.18 + Math.random() * 0.12;
      const w = 0.05 + Math.random() * 0.03;
      const isGlowing = Math.random() > 0.7; // 30% chance of glowing book
      const bookColor = isGlowing ? '#00f0ff' : ['#5c3d2e', '#4a2d1e', '#3d4a5c', '#2e3d2e'][Math.floor(Math.random() * 4)];

      books.push(
        <mesh
          key={`${shelf}-${b}`}
          position={[
            -0.42 + b * 0.11,
            0.2 + shelf * 0.35,
            0.08,
          ]}
          castShadow
        >
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial
            color={bookColor}
            emissive={isGlowing ? '#00f0ff' : '#000000'}
            emissiveIntensity={isGlowing ? 0.6 : 0}
            roughness={0.8}
          />
        </mesh>
      );

      // Glowing spine for data books
      if (isGlowing) {
        books.push(
          <mesh
            key={`spine-${shelf}-${b}`}
            position={[
              -0.42 + b * 0.11,
              0.2 + shelf * 0.35,
              0.14,
            ]}
          >
            <planeGeometry args={[w - 0.01, h - 0.02]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={1}
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </mesh>
        );
      }
    }
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Wooden frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 2, 0.3]} />
        <meshStandardMaterial
          color="#5c3d2e"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Shelves */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, -0.8 + i * 0.35, 0.05]}>
          <boxGeometry args={[0.95, 0.04, 0.25]} />
          <meshStandardMaterial color="#4a3020" roughness={0.85} />
        </mesh>
      ))}

      {/* Side panels */}
      <mesh position={[-0.48, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 2, 0.3]} />
        <meshStandardMaterial color="#4a3020" roughness={0.9} />
      </mesh>
      <mesh position={[0.48, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 2, 0.3]} />
        <meshStandardMaterial color="#4a3020" roughness={0.9} />
      </mesh>

      {books}
    </group>
  );
}

// Central glowing beam of light
function CentralBeam({ position }: { position: [number, number, number] }) {
  const beamRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3 + Math.sin(t * 2) * 0.5;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.6, 8]} />
        <meshStandardMaterial
          color="#2a2a35"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Glowing base ring */}
      <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.85, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Main light beam */}
      <mesh ref={beamRef} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 7, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow cylinder */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 7, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1}
          transparent
          opacity={0.15}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating energy rings */}
      <group ref={ringsRef}>
        {[1, 2.5, 4, 5.5].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.35, 32]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={2}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Top light source */}
      <pointLight
        position={[0, 7, 0]}
        color="#00f0ff"
        intensity={5}
        distance={15}
        decay={2}
        castShadow
      />
    </group>
  );
}

// Holographic floating screen
function HolographicScreen({
  position,
  rotation = [0, 0, 0],
  text = 'DATA'
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  text?: string;
}) {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const t = state.clock.elapsedTime;
      screenRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.1;
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Screen panel */}
      <mesh ref={screenRef} castShadow>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Screen border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.25, 0.85]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.2}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner markers */}
      {[
        [-0.6, 0.4],
        [0.6, 0.4],
        [-0.6, -0.4],
        [0.6, -0.4]
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.01]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Screen light */}
      <pointLight
        position={[0, 0, 0.5]}
        color="#00f0ff"
        intensity={1}
        distance={3}
        decay={2}
      />
    </group>
  );
}

// Wooden reading desk
function ReadingDesk({
  position,
  rotation = [0, 0, 0]
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desktop */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial
          color="#5c3d2e"
          roughness={0.8}
        />
      </mesh>

      {/* Legs */}
      {[
        [-0.65, 0.375, -0.35],
        [0.65, 0.375, -0.35],
        [-0.65, 0.375, 0.35],
        [0.65, 0.375, 0.35]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.75, 0.08]} />
          <meshStandardMaterial
            color="#4a3020"
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Small lamp on desk */}
      <mesh position={[0.5, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
        <meshStandardMaterial
          color="#2a2a35"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.5, 0.95, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0.5, 0.95, 0]}
        color="#00f0ff"
        intensity={0.5}
        distance={2}
        decay={2}
      />
    </group>
  );
}

// Tiled floor with pattern
function TiledFloor() {
  const tiles: ReactElement[] = [];
  const floorSize = 20;
  const tileSize = 2;

  for (let x = -floorSize / 2; x < floorSize / 2; x += tileSize) {
    for (let z = -floorSize / 2; z < floorSize / 2; z += tileSize) {
      const isAlternate = ((x / tileSize) + (z / tileSize)) % 2 === 0;
      tiles.push(
        <mesh
          key={`tile-${x}-${z}`}
          position={[x + tileSize / 2, 0, z + tileSize / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[tileSize - 0.05, tileSize - 0.05]} />
          <meshStandardMaterial
            color={isAlternate ? '#2a2a30' : '#252529'}
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      );
    }
  }

  return <group>{tiles}</group>;
}

// Main castle library environment
function CastleLibrary() {
  const wallHeight = 7;
  const wallThickness = 0.6;
  const roomSize = 20;

  return (
    <group>
      {/* Tiled floor */}
      <TiledFloor />

      {/* Floor base for physics */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[roomSize, roomSize]} />
          <meshStandardMaterial
            color="#2a2a30"
            roughness={0.95}
            metalness={0.05}
            visible={false}
          />
        </mesh>
      </RigidBody>

      {/* Glowing floor circuit pattern - center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3, 3.2, 64]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5, 5.1, 64]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Castle walls with battlements */}
      <CastleWall
        position={[0, wallHeight / 2, -roomSize / 2]}
        size={[roomSize, wallHeight, wallThickness]}
        hasBattlements
      />
      <CastleWall
        position={[0, wallHeight / 2, roomSize / 2]}
        size={[roomSize, wallHeight, wallThickness]}
        hasBattlements
      />
      <CastleWall
        position={[-roomSize / 2, wallHeight / 2, 0]}
        size={[wallThickness, wallHeight, roomSize]}
        rotation={[0, Math.PI / 2, 0]}
        hasBattlements
      />
      <CastleWall
        position={[roomSize / 2, wallHeight / 2, 0]}
        size={[wallThickness, wallHeight, roomSize]}
        rotation={[0, Math.PI / 2, 0]}
        hasBattlements
      />

      {/* Corner towers */}
      {[
        [-roomSize / 2, 0, -roomSize / 2],
        [roomSize / 2, 0, -roomSize / 2],
        [-roomSize / 2, 0, roomSize / 2],
        [roomSize / 2, 0, roomSize / 2],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={[pos[0], wallHeight / 2 + 0.5, pos[2]]} castShadow>
            <cylinderGeometry args={[1.3, 1.5, wallHeight + 1, 8]} />
            <meshStandardMaterial color="#4a4a52" roughness={0.95} />
          </mesh>

          {/* Tower top ring */}
          <mesh position={[pos[0], wallHeight + 0.8, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.4, 8]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.6}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Tower battlements */}
          {[0, 1, 2, 3].map((j) => (
            <mesh
              key={j}
              position={[
                pos[0] + Math.cos((j * Math.PI) / 2) * 1.2,
                wallHeight + 1.5,
                pos[2] + Math.sin((j * Math.PI) / 2) * 1.2,
              ]}
              castShadow
            >
              <boxGeometry args={[0.5, 0.7, 0.5]} />
              <meshStandardMaterial color="#4a4a52" roughness={0.95} />
            </mesh>
          ))}

          {/* Tower light */}
          <pointLight
            position={[pos[0], wallHeight + 1, pos[2]]}
            color="#00f0ff"
            intensity={0.8}
            distance={8}
            decay={2}
          />
        </group>
      ))}

      {/* Bookshelves along walls */}
      {/* Left wall bookshelves */}
      {[-6, -4, -2, 0, 2, 4, 6].map((z) => (
        <DetailedBookshelf
          key={`left-${z}`}
          position={[-8.5, 1, z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}

      {/* Right wall bookshelves */}
      {[-6, -4, -2, 0, 2, 4, 6].map((z) => (
        <DetailedBookshelf
          key={`right-${z}`}
          position={[8.5, 1, z]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      ))}

      {/* Back wall bookshelves */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <DetailedBookshelf
          key={`back-${x}`}
          position={[x, 1, -8.5]}
          rotation={[0, 0, 0]}
        />
      ))}

      {/* Central glowing beam */}
      <CentralBeam position={[0, 0, 0]} />

      {/* Holographic screens floating around */}
      <HolographicScreen position={[-5, 3, -6]} rotation={[0, Math.PI / 4, 0]} text="PROJECTS" />
      <HolographicScreen position={[5, 3.5, -6]} rotation={[0, -Math.PI / 4, 0]} text="SKILLS" />
      <HolographicScreen position={[-6, 3.2, 5]} rotation={[0, Math.PI / 3, 0]} text="DATA" />
      <HolographicScreen position={[6, 3.3, 5]} rotation={[0, -Math.PI / 3, 0]} text="CODE" />

      {/* Reading desks */}
      <ReadingDesk position={[-3, 0, 2]} rotation={[0, Math.PI / 6, 0]} />
      <ReadingDesk position={[3, 0, 2]} rotation={[0, -Math.PI / 6, 0]} />
      <ReadingDesk position={[-4, 0, -3]} rotation={[0, Math.PI / 4, 0]} />
      <ReadingDesk position={[4, 0, -3]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Ambient lights along walls */}
      {[-7, -4, -1, 2, 5, 8].map((x) => (
        <pointLight
          key={`wall-light-${x}`}
          position={[x, 4, -8.8]}
          color="#00f0ff"
          intensity={0.4}
          distance={6}
          decay={2}
        />
      ))}
    </group>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

// Castle GLB Model with error boundary
function CastleGLBModel() {
  const [modelError, setModelError] = useState(false);

  useEffect(() => {
    // Check if model file exists
    fetch('/models/castle-interior.glb', { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          setModelError(true);
        }
      })
      .catch(() => {
        setModelError(true);
      });
  }, []);

  if (modelError) {
    // Fallback to procedural castle if GLB not found
    return <CastleLibrary />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <group>
        {/* Castle Interior GLB Model */}
        <CastleInteriorModel
          position={[0, 0, 0]}
          scale={1}
        />

        {/* Keep procedural elements (bookshelves, beam, screens, desks) */}
        <ProceduralElements />
      </group>
    </Suspense>
  );
}

// Procedural elements to complement or replace GLB
function ProceduralElements() {
  return (
    <group>
      {/* Central glowing beam */}
      <CentralBeam position={[0, 0, 0]} />

      {/* Holographic screens */}
      <HolographicScreen position={[-5, 3, -6]} rotation={[0, Math.PI / 4, 0]} text="PROJECTS" />
      <HolographicScreen position={[5, 3.5, -6]} rotation={[0, -Math.PI / 4, 0]} text="SKILLS" />
      <HolographicScreen position={[-6, 3.2, 5]} rotation={[0, Math.PI / 3, 0]} text="DATA" />
      <HolographicScreen position={[6, 3.3, 5]} rotation={[0, -Math.PI / 3, 0]} text="CODE" />

      {/* Reading desks */}
      <ReadingDesk position={[-3, 0, 2]} rotation={[0, Math.PI / 6, 0]} />
      <ReadingDesk position={[3, 0, 2]} rotation={[0, -Math.PI / 6, 0]} />
      <ReadingDesk position={[-4, 0, -3]} rotation={[0, Math.PI / 4, 0]} />
      <ReadingDesk position={[4, 0, -3]} rotation={[0, -Math.PI / 4, 0]} />
    </group>
  );
}

// Main export component with GLB support
export default function LibraryEnvironment() {
  const [useGLB, setUseGLB] = useState(true);

  return (
    <group>
      {/* Use GLB model if available, otherwise use procedural */}
      {useGLB ? (
        <CastleGLBModel />
      ) : (
        <>
          <CastleLibrary />
          <ProceduralElements />
        </>
      )}

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#8899aa" />

      {/* Main directional light (moonlight) */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Cyan accent lights */}
      <pointLight position={[0, 6, 0]} color="#00f0ff" intensity={2} distance={25} decay={2} />
      <pointLight position={[-8, 4, -8]} color="#00f0ff" intensity={0.6} distance={10} decay={2} />
      <pointLight position={[8, 4, -8]} color="#00f0ff" intensity={0.6} distance={10} decay={2} />
      <pointLight position={[-8, 4, 8]} color="#00d4aa" intensity={0.4} distance={10} decay={2} />
      <pointLight position={[8, 4, 8]} color="#00d4aa" intensity={0.4} distance={10} decay={2} />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#0a0a15', 12, 30]} />
    </group>
  );
}
