'use client';

import { useRef, ReactElement } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

// Circuit lines are rendered via emissive planes instead of line geometry for TypeScript compatibility

function StoneWall({
  position,
  size,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} position={position} rotation={rotation} />
      <mesh position={position} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#3a3a42"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      {/* Circuit traces on wall */}
      <mesh position={[position[0], position[1], position[2] + (rotation[1] === 0 ? size[2] / 2 + 0.01 : 0)]} rotation={rotation}>
        <planeGeometry args={[size[0] * 0.8, size[1] * 0.6]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.08}
        />
      </mesh>
    </RigidBody>
  );
}

function Bookshelf({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const books: ReactElement[] = [];
  const colors = ['#5c3d2e', '#4a2d1e', '#3d4a5c', '#2e3d2e', '#5c2e3d', '#4a4a5c'];

  for (let shelf = 0; shelf < 4; shelf++) {
    for (let b = 0; b < 6; b++) {
      const h = 0.15 + Math.random() * 0.1;
      const w = 0.06 + Math.random() * 0.04;
      books.push(
        <mesh
          key={`${shelf}-${b}`}
          position={[
            -0.35 + b * 0.12 + Math.random() * 0.02,
            0.3 + shelf * 0.35,
            0,
          ]}
          castShadow
        >
          <boxGeometry args={[w, h, 0.15]} />
          <meshStandardMaterial
            color={colors[Math.floor(Math.random() * colors.length)]}
            roughness={0.8}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Shelf frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.8, 0.25]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Shelves */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -0.6 + i * 0.35, 0.02]}>
          <boxGeometry args={[0.85, 0.03, 0.22]} />
          <meshStandardMaterial color="#4a3020" roughness={0.8} />
        </mesh>
      ))}
      {books}
    </group>
  );
}

function DataStream({ position }: { position: [number, number, number] }) {
  const streamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (streamRef.current) {
      const mat = streamRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Base pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 0.6, 8]} />
        <meshStandardMaterial color="#2a2a35" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Energy beam */}
      <mesh ref={streamRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 5, 16]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      {/* Outer glow cylinder */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.25, 0.4, 5, 16]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.1}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Platform ring */}
      <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.55, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function Fireplace({ position }: { position: [number, number, number] }) {
  const fireRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (fireRef.current) {
      fireRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 8) * 0.5 + Math.sin(state.clock.elapsedTime * 13) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Fireplace frame */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.4, 0.3]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.9} />
      </mesh>
      {/* Opening */}
      <mesh position={[0, -0.1, 0.1]}>
        <boxGeometry args={[0.8, 0.8, 0.3]} />
        <meshStandardMaterial color="#1a1a1e" roughness={1} />
      </mesh>
      {/* Fire glow */}
      <pointLight
        ref={fireRef}
        position={[0, 0, 0.2]}
        color="#ff6622"
        intensity={3}
        distance={8}
        decay={2}
      />
      {/* Embers */}
      <mesh position={[0, -0.1, 0.15]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff4400"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function GothicArch({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left pillar */}
      <mesh position={[-1.2, 2, 0]} castShadow>
        <boxGeometry args={[0.4, 4, 0.4]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.85} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[1.2, 2, 0]} castShadow>
        <boxGeometry args={[0.4, 4, 0.4]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.85} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[2.8, 0.5, 0.4]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.85} />
      </mesh>
      {/* Circuit glow on arch */}
      <mesh position={[0, 3.8, 0.21]}>
        <planeGeometry args={[2.4, 0.3]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Pillar circuit lines */}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 2, 0.21]}>
          <planeGeometry args={[0.04, 3.5]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function CastleWalls() {
  const wallHeight = 6;
  const wallThickness = 0.5;
  const roomSize = 16;

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[roomSize, roomSize]} />
          <meshStandardMaterial color="#2a2a30" roughness={0.95} metalness={0.05} />
        </mesh>
      </RigidBody>

      {/* Floor circuit pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 2.7, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[4.5, 4.6, 64]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Walls */}
      <StoneWall position={[0, wallHeight / 2, -roomSize / 2]} size={[roomSize, wallHeight, wallThickness]} />
      <StoneWall position={[0, wallHeight / 2, roomSize / 2]} size={[roomSize, wallHeight, wallThickness]} />
      <StoneWall position={[-roomSize / 2, wallHeight / 2, 0]} size={[wallThickness, wallHeight, roomSize]} />
      <StoneWall position={[roomSize / 2, wallHeight / 2, 0]} size={[wallThickness, wallHeight, roomSize]} />

      {/* Towers at corners */}
      {[
        [-roomSize / 2, 0, -roomSize / 2],
        [roomSize / 2, 0, -roomSize / 2],
        [-roomSize / 2, 0, roomSize / 2],
        [roomSize / 2, 0, roomSize / 2],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={[pos[0], wallHeight / 2 + 0.5, pos[2]]} castShadow>
            <cylinderGeometry args={[1.2, 1.4, wallHeight + 1, 8]} />
            <meshStandardMaterial color="#3a3a42" roughness={0.9} />
          </mesh>
          {/* Tower circuit ring */}
          <mesh position={[pos[0], wallHeight + 0.5, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.2, 8]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Battlements */}
          {[0, 1, 2, 3].map((j) => (
            <mesh
              key={j}
              position={[
                pos[0] + Math.cos((j * Math.PI) / 2) * 1.1,
                wallHeight + 1.3,
                pos[2] + Math.sin((j * Math.PI) / 2) * 1.1,
              ]}
              castShadow
            >
              <boxGeometry args={[0.4, 0.6, 0.4]} />
              <meshStandardMaterial color="#3a3a42" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Gothic arches */}
      <GothicArch position={[0, 0, -7.5]} />
      <GothicArch position={[-5, 0, -7.5]} />
      <GothicArch position={[5, 0, -7.5]} />

      {/* Bookshelves */}
      <Bookshelf position={[-7, 0.9, -5]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[-7, 0.9, -3]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[-7, 0.9, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[-7, 0.9, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[-7, 0.9, 3]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[7, 0.9, -5]} rotation={[0, -Math.PI / 2, 0]} />
      <Bookshelf position={[7, 0.9, -3]} rotation={[0, -Math.PI / 2, 0]} />
      <Bookshelf position={[7, 0.9, -1]} rotation={[0, -Math.PI / 2, 0]} />
      <Bookshelf position={[7, 0.9, 1]} rotation={[0, -Math.PI / 2, 0]} />
      <Bookshelf position={[7, 0.9, 3]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Central bookshelves */}
      <Bookshelf position={[-3, 0.9, 5]} rotation={[0, 0, 0]} />
      <Bookshelf position={[-1, 0.9, 5]} rotation={[0, 0, 0]} />
      <Bookshelf position={[1, 0.9, 5]} rotation={[0, 0, 0]} />
      <Bookshelf position={[3, 0.9, 5]} rotation={[0, 0, 0]} />

      {/* Data stream - center */}
      <DataStream position={[0, 0, 0]} />

      {/* Fireplace */}
      <Fireplace position={[0, 0.7, -7.4]} />

      {/* Ambient lights along walls */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <pointLight
          key={`wl-${x}`}
          position={[x, 3, -7.3]}
          color="#00f0ff"
          intensity={0.3}
          distance={5}
          decay={2}
        />
      ))}
    </group>
  );
}

export default function LibraryEnvironment() {
  return (
    <group>
      <CastleWalls />

      {/* Ambient lighting */}
      <ambientLight intensity={0.15} color="#8899aa" />

      {/* Main directional light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Cyan accent lights */}
      <pointLight position={[0, 5, 0]} color="#00f0ff" intensity={1} distance={20} decay={2} />
      <pointLight position={[-6, 3, -6]} color="#00f0ff" intensity={0.5} distance={8} decay={2} />
      <pointLight position={[6, 3, -6]} color="#00f0ff" intensity={0.5} distance={8} decay={2} />
      <pointLight position={[-6, 3, 6]} color="#00d4aa" intensity={0.3} distance={8} decay={2} />
      <pointLight position={[6, 3, 6]} color="#00d4aa" intensity={0.3} distance={8} decay={2} />

      {/* Fog */}
      <fog attach="fog" args={['#0a0a12', 10, 25]} />
    </group>
  );
}
