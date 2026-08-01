"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, type ShaderMaterial as ThreeShaderMaterial } from "three";
import { CREATION_CONFIG, DAY_EASE_SECONDS } from "@/config/creation";
import { STORY } from "@/config/story";
import { useCreationStep } from "@/hooks/creationContext";
import { easeAlpha } from "@/hooks/creationMath";
import { createSkyUniforms, setSkyUniform } from "./skyUniforms";
import vertexShader from "@/shaders/fullscreen.vert.glsl";
import skyChunk from "@/shaders/skyGradient.glsl";
import skyFragment from "@/shaders/sky.frag.glsl";

/** The gradient function is shared with the burst — see shaders/skyGradient.glsl. */
const fragmentShader = `${skyChunk}\n${skyFragment}`;

/**
 * The golden-hour sky: a full-screen quad carrying a vertical gradient, drawn
 * before everything else with no depth test, so it acts as the backdrop the
 * whole scene sits against. No geometry to size, nothing to cull, and it can
 * never be occluded.
 *
 * It eases its own `day` (the same pattern every other creation component
 * uses), fading up from the void's black, so the opening cinematic is
 * untouched: black at step 0, full dusk once the burst has landed.
 */
export function SkyDome() {
  const step = useCreationStep();
  const size = useThree((s) => s.size);
  const matRef = useRef<ThreeShaderMaterial>(null);
  const day = useRef(0);

  // One stable object: a fresh one each render would make R3F re-apply (and
  // briefly reset) the uniforms every time the story step changes.
  const uniforms = useMemo(
    () => ({
      ...createSkyUniforms(),
      uDay: { value: 0 },
      uVoidColor: { value: new Color(CREATION_CONFIG.voidColor) },
    }),
    [],
  );

  useFrame((_state, delta) => {
    const target = STORY[step]?.day ?? 0;
    day.current += (target - day.current) * easeAlpha(DAY_EASE_SECONDS, delta);

    // Written through the MATERIAL, not through the memoised object above —
    // R3F clones the `uniforms` prop, so the local copy is write-only. See
    // the warning in skyUniforms.ts.
    setSkyUniform(matRef.current, "uDay", day.current);
    setSkyUniform(matRef.current, "uAspect", size.width / size.height);
  });

  return (
    // renderOrder well below everything else + no depth write: the backdrop
    // draws first and the whole scene paints over it.
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
