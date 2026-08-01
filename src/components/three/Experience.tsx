"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CameraRig } from "@/components/three/CameraRig";
import { ExploreControls } from "@/components/three/ExploreControls";
import { ParticleField } from "@/components/three/ParticleField";
import { CreationDirector } from "@/components/three/CreationDirector";
import { SkyBurst } from "@/components/three/SkyBurst";
import { SkyDome } from "@/components/three/SkyDome";
import { Clouds } from "@/components/three/Clouds";
import { Islands } from "@/components/three/Islands";
import { IslandLabels } from "@/components/three/IslandLabels";
import { JourneyPaths } from "@/components/three/JourneyPaths";
import { CreationStepProvider } from "@/hooks/creationContext";
import { MapProgressProvider } from "@/hooks/mapContext";
import { ATMOSPHERE_CONFIG } from "@/config/atmosphere";

/**
 * The 3D world. The creation cinematic (black → stars → sky burst → islands)
 * plays via narration, then hands off to FREE-EXPLORE: the camera unlocks,
 * lifts into a bird's-eye view so the world reads as a MAP — named islands
 * linked by a dotted journey trail — and the user orbits from there.
 */
export function Experience({ step }: { step: number }) {
  const { bloom } = ATMOSPHERE_CONFIG;

  return (
    <Suspense fallback={null}>
      <CreationStepProvider step={step}>
        <MapProgressProvider>
          <CreationDirector />
          <SkyDome />
          <CameraRig />
          <ExploreControls />
          <ParticleField />
          <Clouds />
          <SkyBurst step={step} />
          <Islands />
          <JourneyPaths />
          <IslandLabels />
          <EffectComposer>
            <Bloom
              luminanceThreshold={bloom.luminanceThreshold}
              luminanceSmoothing={bloom.luminanceSmoothing}
              intensity={bloom.intensity}
              radius={bloom.radius}
              mipmapBlur
            />
          </EffectComposer>
        </MapProgressProvider>
      </CreationStepProvider>
    </Suspense>
  );
}
