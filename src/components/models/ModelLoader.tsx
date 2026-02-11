'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * GLB Model Loader Utility
 * Handles loading and optimization of all game GLB models
 */

// Model paths - place GLB files in public/models/
export const MODEL_PATHS = {
  // Environment
  castleInterior: '/models/castle-interior.glb',

  // Characters
  cipherRogue: '/models/dual-wield-assassin.glb', // Cipher-Rogue (dual daggers)
  dataKnight: '/models/futuristic-knight.glb',    // Data-Knight (dual blades)
  technoMage: '/models/futuristic-armored-wizard.glb', // Techno-Mage (staff)

  // Collectibles
  enchantedBook: '/models/enchanted-book.glb',
} as const;

// Preload all models for better performance
export function preloadModels() {
  Object.values(MODEL_PATHS).forEach((path) => {
    useGLTF.preload(path);
  });
}

/**
 * Castle Interior Model Component
 */
export function CastleInteriorModel({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_PATHS.castleInterior);

  useEffect(() => {
    // Optimize materials for better performance
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Enable proper material rendering
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              mat.needsUpdate = true;
            });
          } else {
            mesh.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Character Model Component
 * Supports all three character classes
 */
export function CharacterModel({
  characterClass,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = 'idle',
}: {
  characterClass: 'cipher-rogue' | 'data-knight' | 'techno-mage';
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: string;
}) {
  const modelPath = {
    'cipher-rogue': MODEL_PATHS.cipherRogue,
    'data-knight': MODEL_PATHS.dataKnight,
    'techno-mage': MODEL_PATHS.technoMage,
  }[characterClass];

  const { scene, animations } = useGLTF(modelPath);

  useEffect(() => {
    // Set up shadows and materials
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Optimize materials
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              mat.needsUpdate = true;
              // Enable transparency for glowing effects
              if (mat.name?.includes('glow') || mat.name?.includes('emissive')) {
                mat.transparent = true;
              }
            });
          } else {
            mesh.material.needsUpdate = true;
            if (mesh.material.name?.includes('glow') || mesh.material.name?.includes('emissive')) {
              mesh.material.transparent = true;
            }
          }
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Enchanted Book Model Component
 * Used for collectible books in the library
 */
export function EnchantedBookModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glowing = true,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  glowing?: boolean;
}) {
  const { scene } = useGLTF(MODEL_PATHS.enchantedBook);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Add glowing effect if enabled
        if (glowing && mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              const stdMat = mat as THREE.MeshStandardMaterial;
              if (stdMat.name?.includes('glow') || stdMat.name?.includes('cover')) {
                stdMat.emissive = new THREE.Color('#00f0ff');
                stdMat.emissiveIntensity = 0.6;
                stdMat.transparent = true;
              }
              stdMat.needsUpdate = true;
            });
          } else {
            const stdMat = mesh.material as THREE.MeshStandardMaterial;
            if (stdMat.name?.includes('glow') || stdMat.name?.includes('cover')) {
              stdMat.emissive = new THREE.Color('#00f0ff');
              stdMat.emissiveIntensity = 0.6;
              stdMat.transparent = true;
            }
            stdMat.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, glowing]);

  return (
    <>
      <primitive
        object={scene.clone()}
        position={position}
        rotation={rotation}
        scale={scale}
        castShadow
        receiveShadow
      />

      {/* Add point light for glowing books */}
      {glowing && (
        <pointLight
          position={[position[0], position[1] + 0.2, position[2]]}
          color="#00f0ff"
          intensity={0.3}
          distance={1}
          decay={2}
        />
      )}
    </>
  );
}

// Export preload function
useGLTF.preload(MODEL_PATHS.castleInterior);
useGLTF.preload(MODEL_PATHS.cipherRogue);
useGLTF.preload(MODEL_PATHS.dataKnight);
useGLTF.preload(MODEL_PATHS.technoMage);
useGLTF.preload(MODEL_PATHS.enchantedBook);
