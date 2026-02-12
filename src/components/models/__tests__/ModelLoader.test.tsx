// Mock @react-three/drei's useGLTF before any imports
// jest.mock is hoisted, so we define everything inline
jest.mock('@react-three/drei', () => {
  const mockFn = jest.fn(() => ({
    scene: {
      clone: jest.fn(() => ({ traverse: jest.fn() })),
      traverse: jest.fn(),
    },
    animations: [],
  }));
  // useGLTF.preload is called at module scope in ModelLoader.tsx
  mockFn.preload = jest.fn();
  return { useGLTF: mockFn };
});

import { MODEL_PATHS } from '../ModelLoader';

// Access the mock after import so module-scope calls have already run
const { useGLTF } = jest.requireMock('@react-three/drei') as {
  useGLTF: jest.Mock & { preload: jest.Mock };
};

describe('ModelLoader - MODEL_PATHS', () => {
  it('should export correct castle interior path', () => {
    expect(MODEL_PATHS.castleInterior).toBe('/models/castle-interior.glb');
  });

  it('should export correct cipher-rogue model path', () => {
    expect(MODEL_PATHS.cipherRogue).toBe('/models/dual-wield-assassin.glb');
  });

  it('should export correct data-knight model path', () => {
    expect(MODEL_PATHS.dataKnight).toBe('/models/futuristic-knight.glb');
  });

  it('should export correct techno-mage model path', () => {
    expect(MODEL_PATHS.technoMage).toBe('/models/futuristic-armored-wizard.glb');
  });

  it('should export correct enchanted book model path', () => {
    expect(MODEL_PATHS.enchantedBook).toBe('/models/enchanted-book.glb');
  });

  it('should have all 5 model paths defined', () => {
    const paths = Object.values(MODEL_PATHS);
    expect(paths.length).toBe(5);
  });

  it('should have all paths pointing to .glb files', () => {
    Object.values(MODEL_PATHS).forEach((path) => {
      expect(path).toMatch(/\.glb$/);
    });
  });

  it('should have all paths under /models/ directory', () => {
    Object.values(MODEL_PATHS).forEach((path) => {
      expect(path).toMatch(/^\/models\//);
    });
  });

  it('should preload all model paths at module load', () => {
    // useGLTF.preload is called at module scope for all 5 models
    expect(useGLTF.preload).toHaveBeenCalledWith(MODEL_PATHS.castleInterior);
    expect(useGLTF.preload).toHaveBeenCalledWith(MODEL_PATHS.cipherRogue);
    expect(useGLTF.preload).toHaveBeenCalledWith(MODEL_PATHS.dataKnight);
    expect(useGLTF.preload).toHaveBeenCalledWith(MODEL_PATHS.technoMage);
    expect(useGLTF.preload).toHaveBeenCalledWith(MODEL_PATHS.enchantedBook);
  });
});
