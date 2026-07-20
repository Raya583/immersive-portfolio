"use client";

import { useGLTF } from "@react-three/drei";
import { Island } from "@/components/three/Island";
import { ISLANDS } from "@/config/islands";

/**
 * Renders every island declared in the registry. Islands are the destinations
 * of the world; for now there's just the first one materialising in the void.
 */
export function Islands() {
  return (
    <>
      {ISLANDS.map((config) => (
        <Island key={config.id} config={config} />
      ))}
    </>
  );
}

// Preload all island models so they fetch as early as possible.
ISLANDS.forEach((island) => useGLTF.preload(island.model));
