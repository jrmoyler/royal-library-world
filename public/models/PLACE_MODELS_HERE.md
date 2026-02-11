# 📦 GLB Models Directory

Place your GLB model files here with the following **exact** file names:

## Required Models

### 🏰 Environment
- `castle-interior.glb` - Castle/library interior environment

### 👥 Characters
- `futuristic-avatar.glb` - **Cipher-Rogue** character (dual daggers)
- `futuristic-knight.glb` - **Data-Knight** character (dual blades)
- `futuristic-armored-wizard.glb` - **Techno-Mage** character (cipher staff)

### 📚 Collectibles
- `enchanted-book.glb` - Glowing enchanted book collectible

---

## File Naming Convention

| Original File Name | Rename To |
|-------------------|-----------|
| `castle interior 3d model.glb` | `castle-interior.glb` |
| `futuristic avatar 3d model.glb` | `futuristic-avatar.glb` |
| `futuristic knight 3d model.glb` | `futuristic-knight.glb` |
| `futuristic armored wizard 3d model.glb` | `futuristic-armored-wizard.glb` |
| `enchanted book 3d model.glb` | `enchanted-book.glb` |

---

## ✅ Checklist

After placing the files, verify:

```bash
ls -lh /home/user/royal-library-world/public/models/
```

You should see:
- ✅ castle-interior.glb
- ✅ futuristic-avatar.glb
- ✅ futuristic-knight.glb
- ✅ futuristic-armored-wizard.glb
- ✅ enchanted-book.glb

---

## 🚀 Usage

Models are automatically loaded by the `ModelLoader.tsx` component:

```tsx
import { CharacterModel, CastleInteriorModel, EnchantedBookModel } from '@/components/models/ModelLoader';

// Use in your components
<CharacterModel characterClass="data-knight" position={[0, 0, 0]} />
<CastleInteriorModel position={[0, 0, 0]} scale={1} />
<EnchantedBookModel position={[0, 1, 0]} glowing={true} />
```

---

## 🎨 Model Requirements

- **Format**: GLB (binary glTF)
- **Shadows**: Will be enabled automatically
- **Materials**: PBR materials preferred
- **Glowing parts**: Name materials with "glow" or "emissive"
- **Scale**: Will be adjusted in code
- **Pivot**: Center bottom recommended

---

The game will automatically detect and load these models when they're present!
