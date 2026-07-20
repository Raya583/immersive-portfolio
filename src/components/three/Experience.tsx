"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CameraRig } from "@/components/three/CameraRig";
import { ParticleField } from "@/components/three/ParticleField";
import { ATMOSPHERE_CONFIG } from "@/config/atmosphere";

/**
 * The contents of the 3D world. The Void now has atmosphere: soft depth fog
 * fades distant particles into the dark, and a gentle bloom pass makes the
 * bright ones glow like real light. "Subtle & dreamy" — restraint on purpose.
 */
export function Experience() {
  const { bloom, fog } = ATMOSPHERE_CONFIG;

  return (
    <Suspense fallback={null}>
      <fog attach="fog" args={[fog.color, fog.near, fog.far]} />

      <CameraRig />
      <ParticleField />

      <EffectComposer>
        <Bloom
          luminanceThreshold={bloom.luminanceThreshold}
          luminanceSmoothing={bloom.luminanceSmoothing}
          intensity={bloom.intensity}
          radius={bloom.radius}
          mipmapBlur
        />
      </EffectComposer>
    </Suspense>
  );
}
