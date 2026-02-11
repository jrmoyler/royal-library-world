# 3D Character Models

This directory is for storing GLB/GLTF 3D character models.

## Current Implementation

The game currently uses **procedural 3D character models** created with Three.js geometry. Each character class has a unique appearance:

- **Techno-Mage** 🧙‍♂️ - Cyan/blue robed figure with floating orbs and a glowing staff
- **Cyber-Knight** ⚔️ - Teal/green armored warrior with photon blade
- **Shadow Agent** 🗡️ - Purple sleek operative with energy daggers

## Using Custom GLB Models

To replace the procedural models with custom GLB files:

### 1. Add GLB Files

Place your GLB model files in this directory:
```
/public/models/
├── techno-mage.glb
├── cyber-knight.glb
└── shadow-agent.glb
```

### 2. Update CharacterModels.tsx

In `/src/components/characters/CharacterModels.tsx`, replace the procedural models with GLB loaders:

```typescript
import { useGLTF } from '@react-three/drei';

export function TechnoMageModel({ position, rotation }: CharacterModelProps) {
  const { scene } = useGLTF('/models/techno-mage.glb');
  return <primitive object={scene.clone()} position={position} rotation={rotation} />;
}

// Repeat for other classes...
```

### 3. Preload Models (Optional)

Add preloading for better performance:

```typescript
// At the bottom of CharacterModels.tsx
useGLTF.preload('/models/techno-mage.glb');
useGLTF.preload('/models/cyber-knight.glb');
useGLTF.preload('/models/shadow-agent.glb');
```

## Model Requirements

For best results, your GLB models should:

- **Scale**: Approximately 1-2 units tall (game uses meters)
- **Origin**: Model center at (0, 0, 0) with base at Y=0
- **Orientation**: Facing forward along -Z axis
- **Materials**: PBR materials (metalness/roughness workflow)
- **Animations**: Optional - can include idle, walk, run animations
- **File Size**: Keep under 5MB for web performance

## Recommended Tools

- **Blender** (Free) - Full 3D modeling suite
- **Ready Player Me** - Create custom avatars
- **Mixamo** - Free character models and animations
- **Sketchfab** - Download free/paid models
- **Poly Pizza** - Free low-poly models

## Animation Support

If your GLB includes animations, you can use them:

```typescript
import { useAnimations } from '@react-three/drei';

export function TechnoMageModel({ position, rotation }: CharacterModelProps) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/techno-mage.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions['Idle']?.play();
  }, [actions]);

  return (
    <group ref={group}>
      <primitive object={scene.clone()} position={position} rotation={rotation} />
    </group>
  );
}
```

## Current Features

The procedural models include:

✅ Class-specific colors and designs
✅ Animated floating/hovering effects
✅ Glowing emissive materials
✅ Shadow casting
✅ Animated accessories (orbs, daggers)
✅ Real-time position updates

When replacing with GLB models, consider maintaining these visual features for consistency.
