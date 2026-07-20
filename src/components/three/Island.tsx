"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { IslandConfig } from "@/config/islands";

/**
 * Loads and places a single island model. Pure presentation: it reads an
 * IslandConfig and renders the .glb at the given transform. Suspends while
 * the model loads (the parent <Suspense> shows the fallback).
 */
export function Island({ config }: { config: IslandConfig }) {
  const { scene } = useGLTF(config.model);

  // Clone so multiple islands can safely share one loaded model.
  const model = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={model}
      position={config.position}
      scale={config.scale}
      rotation={config.rotation}
    />
  );
}
