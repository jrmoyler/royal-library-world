'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import CharacterModel from './CharacterModels';

const SPEED = 5;
const RUN_SPEED = 8;
const MOUSE_SENSITIVITY = 0.002;
const CAMERA_DISTANCE = 4;
const CAMERA_HEIGHT = 2;
const CAMERA_SMOOTHNESS = 0.1;

export default function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const depleteEnergy = useGameStore((s) => s.depleteEnergy);
  const gamePhase = useGameStore((s) => s.gamePhase);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  });

  const [animationState, setAnimationState] = useState<'idle' | 'walk' | 'run' | 'strafe'>('idle');
  const [movementDirection, setMovementDirection] = useState(new THREE.Vector3());

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLocked = useRef(false);
  const cameraOffset = useRef(new THREE.Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE));
  const currentCameraPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keys.current.forward = true; break;
        case 's': keys.current.backward = true; break;
        case 'a': keys.current.left = true; break;
        case 'd': keys.current.right = true; break;
      }
      if (e.key === 'Shift') keys.current.shift = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keys.current.forward = false; break;
        case 's': keys.current.backward = false; break;
        case 'a': keys.current.left = false; break;
        case 'd': keys.current.right = false; break;
      }
      if (e.key === 'Shift') keys.current.shift = false;
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
    if (!rigidBodyRef.current || !characterRef.current) return;
    if (gamePhase !== 'playing') return;

    const pos = rigidBodyRef.current.translation();

    // Calculate movement direction from camera perspective
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, euler.current.y, 0));
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, euler.current.y, 0));
    right.normalize();

    if (keys.current.forward) direction.add(forward);
    if (keys.current.backward) direction.sub(forward);
    if (keys.current.right) direction.add(right);
    if (keys.current.left) direction.sub(right);

    let isMoving = false;
    let isStrafeOnly = false;
    const isRunning = keys.current.shift;

    if (direction.length() > 0) {
      direction.normalize();
      isMoving = true;

      // Detect strafe-only movement (left/right without forward/backward)
      isStrafeOnly = (keys.current.left || keys.current.right) && !(keys.current.forward || keys.current.backward);

      // Smooth character rotation to face movement direction
      if (!isStrafeOnly) {
        targetRotation.current = Math.atan2(direction.x, direction.z);
      } else {
        // For strafe, keep facing camera direction
        targetRotation.current = euler.current.y;
      }
    }

    // Smooth rotation interpolation
    const currentRotation = characterRef.current.rotation.y;
    let rotationDiff = targetRotation.current - currentRotation;

    // Normalize rotation difference to [-PI, PI]
    while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

    characterRef.current.rotation.y += rotationDiff * 0.15;

    // Apply velocity with running
    const currentVel = rigidBodyRef.current.linvel();
    const speed = isRunning ? RUN_SPEED : SPEED;
    rigidBodyRef.current.setLinvel(
      { x: direction.x * speed, y: currentVel.y, z: direction.z * speed },
      true
    );

    // Update animation state
    if (!isMoving) {
      setAnimationState('idle');
    } else if (isStrafeOnly) {
      setAnimationState('strafe');
    } else if (isRunning) {
      setAnimationState('run');
    } else {
      setAnimationState('walk');
    }

    // 3rd Person Camera - smooth follow
    const targetCameraOffset = new THREE.Vector3();

    // Calculate camera position behind and above player
    const horizontalOffset = new THREE.Vector3(0, 0, CAMERA_DISTANCE);
    horizontalOffset.applyEuler(new THREE.Euler(0, euler.current.y, 0));

    targetCameraOffset.set(
      pos.x + horizontalOffset.x,
      pos.y + CAMERA_HEIGHT,
      pos.z + horizontalOffset.z
    );

    // Smooth camera movement
    if (!currentCameraPosition.current.x && !currentCameraPosition.current.y && !currentCameraPosition.current.z) {
      currentCameraPosition.current.copy(targetCameraOffset);
    } else {
      currentCameraPosition.current.lerp(targetCameraOffset, CAMERA_SMOOTHNESS);
    }

    camera.position.copy(currentCameraPosition.current);

    // Camera looks at player position (slightly above)
    const lookAtTarget = new THREE.Vector3(pos.x, pos.y + 1.2, pos.z);
    camera.lookAt(lookAtTarget);

    // Store movement direction for character animations
    setMovementDirection(direction.clone());

    // Deplete energy while moving
    if (isMoving) {
      depleteEnergy(delta * (isRunning ? 3 : 2));
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

      {/* 3D Character Model - Now visible in third person */}
      <group ref={characterRef}>
        <CharacterModel
          position={[0, 0, 0]}
          animationState={animationState}
          movementDirection={movementDirection}
        />
      </group>
    </RigidBody>
  );
}
