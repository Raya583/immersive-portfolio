"use client";

import { Suspense } from "react";
import { CameraRig } from "@/components/three/CameraRig";
import { ParticleField } from "@/components/three/ParticleField";

/**
 * The contents of the 3D world. The Void now holds its ambient particle
 * field — dense, shimmering light drifting in the dark (Scene 1). Cursor
 * reaction, atmosphere, and islands mount alongside these as they're built.
 *
 * Wrapped in <Suspense> so async assets (loaded via drei/useLoader) can
 * be dropped in later without restructuring.
 */
export function Experience() {
  return (
    <Suspense fallback={null}>
      <CameraRig />
      <ParticleField />
      {/* atmosphere · islands go here */}
    </Suspense>
  );
}
