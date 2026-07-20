"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CameraRig } from "@/components/three/CameraRig";
import { ParticleField } from "@/components/three/ParticleField";
import { Islands } from "@/components/three/Islands";
import { ATMOSPHERE_CONFIG } from "@/config/atmosphere";

/**
 * The contents of the 3D world. The Void now holds atmosphere, the ambient
 * particle field, AND the first floating island — real geometry materialising
 * in the dark. Lighting is minimal and cool so the island reads as dreamlike.
 */
export function Experience() {
  const { bloom, fog } = ATMOSPHERE_CONFIG;

  return (
    <Suspense fallback={null}>
      <fog attach="fog" args={[fog.color, fog.near, fog.far]} />

      <ambientLight intensity={0.4} color="#8a7fb5" />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#e0d4ff" />

      <CameraRig />
      <ParticleField />
      <Islands />

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
