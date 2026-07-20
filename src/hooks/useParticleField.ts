"use client";

import { useMemo } from "react";
import type { ParticleFieldConfig } from "@/types/three";

interface ParticleFieldBuffers {
  positions: Float32Array;
  seeds: Float32Array;
  sizeMuls: Float32Array;
  colorMixes: Float32Array;
}

/**
 * Builds the static per-particle attribute buffers for the field, once.
 * These never change after creation (animation happens in the shader), so
 * they're memoized on the config. Particles are scattered in a cube.
 */
export function useParticleField(
  config: ParticleFieldConfig,
): ParticleFieldBuffers {
  return useMemo(() => {
    const { count, radius, sizeVariation } = config;

    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizeMuls = new Float32Array(count);
    const colorMixes = new Float32Array(count);

    const [sizeMin, sizeMax] = sizeVariation;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * radius;
      const y = (Math.random() * 2 - 1) * radius;
      const z = (Math.random() * 2 - 1) * radius;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      seeds[i] = Math.random();
      sizeMuls[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
      colorMixes[i] = Math.random();
    }

    return { positions, seeds, sizeMuls, colorMixes };
  }, [config]);
}
