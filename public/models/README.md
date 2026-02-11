# 3D Model Import Guide

This guide shows how to replace the procedural 3D models with custom GLB files generated from your PNG reference images.

## Quick Start

1. **Convert PNG images to GLB** (see tools below)
2. **Place GLB files in** `/public/models/`
3. **Update components** (see examples below)
4. **Test in game**

---

## Current Implementation

The game uses **enhanced procedural 3D models** with:
- **Techno-Mage** 🧙‍♂️ - Flowing robes, glowing circuit patterns, ornate staff with crystal
- **Cyber-Knight** ⚔️ - Heavy armor, dual photon swords, glowing visor
- **Shadow Agent** 🗡️ - Sleek suit, energy daggers, shadow effects

---

## Converting PNG to GLB

### Recommended AI Tools (Easiest Method)

#### 1. **Meshy.ai** ⭐ Best for Characters
- Upload your PNG character references
- AI generates 3D model in 2-5 minutes
- Export as GLB with textures
- Can add animations automatically
- **URL:** https://www.meshy.ai/
- **Cost:** Free tier available

#### 2. **Rodin** (HyperHuman)
- High-quality image-to-3D conversion
- Great for detailed characters
- Export as GLB
- **URL:** https://hyperhuman.deemos.com/rodin
- **Cost:** Free trial available

#### 3. **Spline**
- Design tool with 2D-to-3D features
- Import PNG as texture reference
- Build 3D model interactively
- Export as GLB
- **URL:** https://spline.design/
- **Cost:** Free tier

#### 4. **Luma AI Genie**
- Text-to-3D and image-to-3D
- Fast generation
- Export GLB
- **URL:** https://lumalabs.ai/genie
- **Cost:** Free credits

### Manual Method (Blender)

For full control:
1. Install **Blender** (free) - https://www.blender.org/
2. Import PNG as reference image
3. Model character geometry over reference
4. Add materials and textures
5. Create armature (skeleton)
6. Rig character (weight painting)
7. Animate: idle, walk, run, strafe
8. Export as GLB (File > Export > glTF 2.0)

---

## File Structure
```
/public/models/
├── techno-mage.glb           # Character model
├── cyber-knight.glb          # Character model
├── shadow-agent.glb          # Character model
└── books/
    ├── magical-book-01.glb   # Book artifact
    ├── magical-book-02.glb   # Book artifact
    └── ...
```

---

## Replacing Character Models

### Step 1: Place GLB Files
After generating models from your PNG references, place them in `/public/models/`

### Step 2: Update Component

**File:** `src/components/characters/CharacterModels.tsx`

Replace the procedural model function:

```typescript
import { useGLTF, useAnimations } from '@react-three/drei';

export function TechnoMageModel({
  position = [0, 0, 0],
  animationState = 'idle',
  movementDirection
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load GLB model and animations
  const { scene, animations } = useGLTF('/models/techno-mage.glb');
  const { actions } = useAnimations(animations, groupRef);

  useFrame(() => {
    // Play animation based on state
    if (actions) {
      Object.values(actions).forEach(action => action?.stop());
      actions[animationState]?.play();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene.clone()} />

      {/* Keep the glowing effects */}
      <pointLight
        position={[0, 1.2, 0]}
        color="#00f0ff"
        intensity={0.5}
        distance={2}
      />
    </group>
  );
}
```

### Step 3: Preload Models
At the bottom of the file:

```typescript
// Preload for better performance
useGLTF.preload('/models/techno-mage.glb');
useGLTF.preload('/models/cyber-knight.glb');
useGLTF.preload('/models/shadow-agent.glb');
```

---

## Replacing Book Artifacts

### Step 1: Generate Book GLB
Use Meshy.ai or similar tool with your magical book PNG reference.

### Step 2: Update Component

**File:** `src/components/game/BookArtifact.tsx`

```typescript
import { useGLTF } from '@react-three/drei';

export default function BookArtifact({ book, position }: BookArtifactProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/books/magical-book.glb');

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Hovering animation
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15;
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={meshRef}>
          <primitive object={scene.clone()} scale={0.5} />
        </group>
      </Float>

      {/* Keep magical effects */}
      <pointLight
        position={[0, 0.8, 0]}
        color={book.color}
        intensity={2}
        distance={4}
      />

      {/* Keep particle effects from original */}
    </group>
  );
}
```

---

## Animation Requirements

Your GLB file should include these animation tracks:

### For Characters
- **idle** - Standing/floating animation
- **walk** - Walking forward
- **run** - Running (faster walk)
- **strafe** - Side-stepping

### Export from Blender
1. Create animations in Action Editor
2. Name each action exactly: `idle`, `walk`, `run`, `strafe`
3. Export with settings:
   - Format: glTF Binary (.glb)
   - Include: Animations
   - Animation Mode: Actions

---

## Model Requirements

### Characters
| Property | Requirement |
|----------|-------------|
| Scale | 1.5-2 units tall |
| Orientation | Facing +Z axis (forward) |
| Pivot Point | At feet (0, 0, 0) |
| Poly Count | <10k triangles |
| Textures | 1024x1024 max, embedded |
| Materials | PBR metallic-roughness |

### Books
| Property | Requirement |
|----------|-------------|
| Scale | 0.5-1 unit |
| Orientation | Cover facing +Y (up) |
| Poly Count | <5k triangles |
| Textures | 512x512, embedded |
| Emissive | For glowing crystal |

---

## Testing Your Models

### 1. Online GLB Viewer
Upload to: https://gltf-viewer.donmccurdy.com/

### 2. Local Testing
```bash
# Install GLB viewer
npm install -g @gltf-transform/cli

# View model
gltf-transform inspect /public/models/techno-mage.glb
```

### 3. Test in Game
1. Place GLB in `/public/models/`
2. Update component code
3. Run `npm run dev`
4. Select character class
5. Verify model and animations

---

## Optimizing GLB Files

### Reduce File Size

```bash
# Install tools
npm install -g @gltf-transform/cli

# Compress with Draco
gltf-transform draco techno-mage.glb techno-mage-compressed.glb

# Remove unused data
gltf-transform prune techno-mage.glb techno-mage-clean.glb

# Optimize textures
gltf-transform resize techno-mage.glb techno-mage-optimized.glb --width 1024 --height 1024
```

### Performance Tips
✅ Keep poly count low (<10k triangles)
✅ Use texture atlases
✅ Enable Draco compression
✅ Resize textures to 1024x1024 or smaller
✅ Remove unused animations
✅ Embed textures in GLB

---

## Troubleshooting

### Model doesn't appear
- ✅ Check file path: `/models/filename.glb` (no /public/)
- ✅ Validate GLB: https://github.khronos.org/glTF-Validator/
- ✅ Check browser console for errors
- ✅ Verify scale isn't too small (try scale={10})

### Animations don't play
- ✅ Verify animation names: `idle`, `walk`, `run`, `strafe`
- ✅ Check GLB includes animations (use viewer)
- ✅ Make sure `useAnimations` hook is called
- ✅ Log `actions` to see available animations

### Model is too dark
- ✅ Add emissive materials in 3D software
- ✅ Add point lights in code
- ✅ Increase ambient light in scene
- ✅ Check material roughness/metalness values

### Model orientation is wrong
- ✅ Rotate in Blender before export
- ✅ Or add rotation in code: `rotation={[0, Math.PI, 0]}`
- ✅ Check export settings: +Y Up axis

### Textures are missing
- ✅ Embed textures in GLB export
- ✅ Or place textures in same folder as GLB
- ✅ Use relative paths in GLB file

---

## Free Model Resources

### Character Models
- **Ready Player Me** - https://readyplayer.me/
- **Mixamo** (Adobe) - https://www.mixamo.com/
- **Sketchfab** - https://sketchfab.com/
- **Poly Haven** - https://polyhaven.com/models
- **Quaternius** - https://quaternius.com/

### Book/Object Models
- **Kenney** - https://kenney.nl/assets
- **Poly Pizza** - https://poly.pizza/
- **Free3D** - https://free3d.com/

---

## Recommended Workflow

1. **Take your 5 PNG reference images**
2. **Upload to Meshy.ai or Rodin**
   - Techno-Mage PNG → techno-mage.glb
   - Cyber-Knight PNG → cyber-knight.glb
   - Magical Book PNG → magical-book.glb
   - Library Environment PNG → (use for texture reference)
3. **Download GLB files**
4. **Place in** `/public/models/`
5. **Update components** using code examples above
6. **Test in game** with `npm run dev`
7. **Optimize** if needed (compress, resize textures)

---

## Example: Complete Techno-Mage Replacement

```typescript
// src/components/characters/CharacterModels.tsx

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterModelProps {
  position?: [number, number, number];
  animationState?: 'idle' | 'walk' | 'run' | 'strafe';
  movementDirection?: THREE.Vector3;
}

export function TechnoMageModel({
  position = [0, 0, 0],
  animationState = 'idle',
  movementDirection = new THREE.Vector3()
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load GLB model
  const { scene, animations } = useGLTF('/models/techno-mage.glb');
  const { actions, mixer } = useAnimations(animations, groupRef);

  // Play animation when state changes
  useEffect(() => {
    if (!actions) return;

    // Stop all animations
    Object.values(actions).forEach(action => action?.stop());

    // Play current animation
    const currentAction = actions[animationState];
    if (currentAction) {
      currentAction.reset().fadeIn(0.2).play();
    }

    return () => {
      currentAction?.fadeOut(0.2);
    };
  }, [animationState, actions]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene.clone()} />

      {/* Keep magical glow effects */}
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

// Preload for better performance
useGLTF.preload('/models/techno-mage.glb');

export default TechnoMageModel;
```

---

## Need Help?

1. **Check component files** for inline documentation
2. **Validate your GLB** at https://github.khronos.org/glTF-Validator/
3. **Test in viewer** at https://gltf-viewer.donmccurdy.com/
4. **Review Three.js docs** at https://threejs.org/docs/

Happy modeling! 🎮✨
