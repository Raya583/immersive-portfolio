"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CameraRig } from "@/components/three/CameraRig";
import { ExploreControls } from "@/components/three/ExploreControls";
import { ParticleField } from "@/components/three/ParticleField";
import { CreationDirector } from "@/components/three/CreationDirector";
import { SkyBurst } from "@/components/three/SkyBurst";
import { Clouds } from "@/components/three/Clouds";
import { Islands } from "@/components/three/Islands";
import { IslandLabels } from "@/components/three/IslandLabels";
import { JourneyPaths } from "@/components/three/JourneyPaths";
import { MapOrbit } from "@/components/three/MapOrbit";
import { CreationStepProvider } from "@/hooks/creationContext";
import { SelectionBridge } from "@/hooks/selectionContext";
import type { SelectionState } from "@/hooks/selectionContext";
import { MapProgressProvider } from "@/hooks/mapContext";
import { ATMOSPHERE_CONFIG } from "@/config/atmosphere";

/**
 * The 3D world. The creation cinematic (black → stars → sky burst → islands)
 * plays via narration, then hands off to FREE-EXPLORE: the camera unlocks,
 * lifts into a bird's-eye view so the world reads as a MAP — named islands
 * linked by a dotted journey trail — and the user orbits from there.
 */
export function Experience({
  step,
  selection,
}: {
  step: number;
  selection: SelectionState;
}) {
  const { bloom } = ATMOSPHERE_CONFIG;

  return (
    <Suspense fallback={null}>
      <CreationStepProvider step={step}>
        <SelectionBridge value={selection}>
          <MapProgressProvider>
            <CreationDirector />
            <CameraRig />
            <ExploreControls />
            <ParticleField />
            <Clouds />
            <SkyBurst step={step} />
            {/* Islands, trail and labels share one slowly-turning group, so
                the constellation revolves as a single aligned piece. */}
            <MapOrbit>
              <Islands />
              <JourneyPaths />
              <IslandLabels />
            </MapOrbit>
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
        </SelectionBridge>
      </CreationStepProvider>
    </Suspense>
  );
}
