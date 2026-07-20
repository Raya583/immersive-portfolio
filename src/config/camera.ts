import type { CameraRigConfig, CameraTarget } from "@/types/three";

/**
 * Named camera destinations for the journey. For now only "void" exists —
 * the starting darkness of Scene 1. Islands (rhythm, workshop, playground,
 * memory, innovation, finale) get appended here as each ecosystem is built,
 * and the rig will travel between them. Keeping these as data means the
 * transition logic never hardcodes coordinates.
 */
export const CAMERA_TARGETS: readonly CameraTarget[] = [
  {
    id: "void",
    // Matches SCENE_CONFIG.camera.position — the rig begins where the
    // Canvas camera is first placed, so there's no jump on mount.
    position: [0, 0, 8],
    lookAt: [0, 0, 0],
  },
] as const;

export const CAMERA_RIG_CONFIG: CameraRigConfig = {
  // ~4 → reaches ~98% of the way to target in about 1s. Tunable.
  smoothing: 4,
  initialTargetId: "void",
} as const;

/** Lookup helper. Returns undefined if the id isn't declared. */
export function getCameraTarget(id: string): CameraTarget | undefined {
  return CAMERA_TARGETS.find((t) => t.id === id);
}
