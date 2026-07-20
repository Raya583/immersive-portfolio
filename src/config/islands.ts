import type { Vec3 } from "@/types/three";

/**
 * Declarative registry of islands in the world. Each entry is data: which
 * model to load, where it floats, how big, how it's oriented.
 */
export interface IslandConfig {
  id: string;
  model: string;
  position: Vec3;
  scale: number;
  rotation: Vec3; // euler radians
}

// Candidate models — swap ACTIVE_MODEL below to preview each in the void.
const MODELS = {
  floaty: "/models/floaty.glb",
  polyIsland: "/models/poly-island.glb",
  treehouse: "/models/treehouse.glb",
  camping: "/models/camping.glb",
  winter: "/models/winter.glb",
} as const;

// >>> Change this one line to preview a different model <
const ACTIVE_MODEL = MODELS.floaty;

export const ISLANDS: readonly IslandConfig[] = [
  {
    id: "first",
    model: ACTIVE_MODEL,
    position: [0, -1, 0],
    scale: 1,
    rotation: [0, 0, 0],
  },
] as const;
