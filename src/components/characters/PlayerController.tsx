'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import CharacterModel from './CharacterModels';

const SPEED = 5;
const MOUSE_SENSITIVITY = 0.002;

export default function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const depleteEnergy = useGameStore((s) => s.depleteEnergy);
  const gamePhase = useGameStore((s) => s.gamePhase);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLocked = useRef(false);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keys.current.forward = true; break;
        case 's': keys.current.backward = true; break;
        case 'a': keys.current.left = true; break;
        case 'd': keys.current.right = true; break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keys.current.forward = false; break;
        case 's': keys.current.backward = false; break;
        case 'a': keys.current.left = false; break;
        case 'd': keys.current.right = false; break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Mouse look via pointer lock
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const onClick = () => {
      if (gamePhase === 'playing') {
        canvas.requestPointerLock();
      }
    };

    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      euler.current.y -= e.movementX * MOUSE_SENSITIVITY;
      euler.current.x -= e.movementY * MOUSE_SENSITIVITY;
      euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x));
    };

    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gamePhase]);

  // Handle ESC for book reading
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const { gamePhase, setActiveBook } = useGameStore.getState();
        if (gamePhase === 'reading') {
          setActiveBook(null);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;
    if (gamePhase !== 'playing') return;

    // Update camera rotation
    camera.quaternion.setFromEuler(euler.current);

    // Movement
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    if (keys.current.forward) direction.add(forward);
    if (keys.current.backward) direction.sub(forward);
    if (keys.current.right) direction.add(right);
    if (keys.current.left) direction.sub(right);

    let isMoving = false;
    if (direction.length() > 0) {
      direction.normalize();
      isMoving = true;
    }

    // Apply velocity
    const currentVel = rigidBodyRef.current.linvel();
    rigidBodyRef.current.setLinvel(
      { x: direction.x * SPEED, y: currentVel.y, z: direction.z * SPEED },
      true
    );

    // Update camera position
    const pos = rigidBodyRef.current.translation();
    camera.position.set(pos.x, pos.y + 0.8, pos.z);

    // Deplete energy while moving
    if (isMoving) {
      depleteEnergy(delta * 2);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={[0, 2, 5]}
      enabledRotations={[false, false, false]}
      linearDamping={5}
      mass={1}
    >
      <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />

      {/* 3D Character Model - Visible when player looks down or in third person */}
      <CharacterModel position={[0, -0.2, 0]} rotation={[0, Math.PI, 0]} />
    </RigidBody>
  );
}
