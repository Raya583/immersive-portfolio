import type { SceneConfig } from "@/types/three";

/**
 * Central place to tune camera + renderer defaults for the whole experience.
 * Kept framework-agnostic so it can be imported by any component or hook.
 */
export const SCENE_CONFIG: SceneConfig = {
  camera: {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [0, 0, 8],
  },
  // Cap DPR to protect performance on high-density displays.
  dpr: [1, 2],
  background: "#000000",
} as const;
