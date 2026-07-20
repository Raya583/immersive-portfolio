import type { ParticleFieldConfig } from "@/types/three";

/**
 * The ambient particle field of The Void. "Dense & alive, shimmering":
 * a large count kept cheap by rendering as a single Points object with a
 * custom shader. Shimmer and drift happen on the GPU, not the CPU.
 *
 * Palette follows the brief: deep midnight → soft violet → warm highlights.
 * Cursor interaction is GPU-side too: the pointer is one uniform, and the
 * shader computes every particle's response in parallel.
 */
export const PARTICLE_FIELD_CONFIG: ParticleFieldConfig = {
  count: 28000,
  radius: 14,
  baseSize: 40,
  sizeVariation: [0.6, 2.4],
  driftSpeed: 0.02,
  shimmerSpeed: 0.7,
  colorCool: "#6d5cc9",
  colorWarm: "#e0c8ff",
  pointerRadius: 3.5,
  pointerPush: 1.2,
  pointerGlow: 1.6,
} as const;
