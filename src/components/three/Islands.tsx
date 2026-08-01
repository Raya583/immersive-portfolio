"use client";

import { useGLTF } from "@react-three/drei";
import { Island } from "@/components/three/Island";
import { ISLANDS } from "@/config/islands";

/**
 * Renders all five islands. They materialise on the final narration line,
 * staggered left to right so the world assembles piece by piece.
 */
export function Islands() {
  return (
    <>
      {ISLANDS.map((config, i) => (
        <Island key={config.id} config={config} index={i} />
      ))}
    </>
  );
}

ISLANDS.forEach((island) => useGLTF.preload(island.model));
