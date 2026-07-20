export type Vec3 = [x: number, y: number, z: number];

export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  position: Vec3;
}

export interface SceneConfig {
  camera: CameraConfig;
  /** [min, max] device pixel ratio clamp passed to the R3F Canvas. */
  dpr: [number, number];
  background: string;
}

/**
 * A named destination the camera rig can travel to. Islands and key story
 * beats are declared as data so transitions (later, via GSAP) move the rig
 * between these rather than hardcoding coordinates in components.
 */
export interface CameraTarget {
  /** Stable key, e.g. "void", "rhythm", "workshop". */
  id: string;
  /** World-space position the rig eases toward. */
  position: Vec3;
  /** Point in world space the camera looks at while at this target. */
  lookAt: Vec3;
}

export interface CameraRigConfig {
  /**
   * Smoothing factor for the rig's easing, in "per second" terms.
   * Higher = snappier. Frame-rate independent (see useCameraRig).
   */
  smoothing: number;
  /** The target the rig starts at. Must match a CameraTarget id. */
  initialTargetId: string;
}

/**
 * Configuration for the ambient particle field of The Void. Tuned for a
 * dense, shimmering feel while staying a single draw call for performance.
 */
export interface ParticleFieldConfig {
  /** Total particle count. One GPU draw call regardless of size. */
  count: number;
  /** Half-extent of the cube the particles are scattered within (world units). */
  radius: number;
  /** Base point size before per-particle variation, in world units. */
  baseSize: number;
  /** Per-particle random size multiplier range [min, max]. */
  sizeVariation: [number, number];
  /** Slow overall drift speed of the whole field (radians/sec of rotation). */
  driftSpeed: number;
  /** How fast each particle twinkles (shimmer frequency, cycles/sec-ish). */
  shimmerSpeed: number;
  /** Color at the cool end of the palette (hex). */
  colorCool: string;
  /** Color at the warm end of the palette (hex). */
  colorWarm: string;
  /** World-space radius of the cursor's influence on the field. */
  pointerRadius: number;
  /** How hard particles are pushed away from the cursor (world units). */
  pointerPush: number;
  /** Extra brightness/size boost for particles near the cursor. */
  pointerGlow: number;
}
