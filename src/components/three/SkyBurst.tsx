"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  type Mesh,
  type ShaderMaterial as ThreeShaderMaterial,
} from "three";
import { STORY, BURST_EASE_SECONDS } from "@/config/story";
import { DAY_EASE_SECONDS } from "@/config/creation";
import { easeAlpha } from "@/hooks/creationMath";
import { createSkyUniforms, setSkyUniform } from "./skyUniforms";
import vertexShader from "@/shaders/fullscreen.vert.glsl";
import skyChunk from "@/shaders/skyGradient.glsl";
import burstFragment from "@/shaders/burst.frag.glsl";

/** Same gradient chunk the sky backdrop uses — see shaders/skyGradient.glsl. */
const fragmentShader = `${skyChunk}\n${burstFragment}`;

/**
 * The radial sky-burst — a fullscreen quad where daylight explodes from center,
 * masks the void as it expands, then FADES OUT once day is established.
 *
 * It fills with the golden-hour gradient rather than a flat colour, sampled
 * along the same view ray as the sky behind it, so the fade-out reveals the
 * real sky without a colour pop.
 */
export function SkyBurst({ step }: { step: number }) {
  const { size } = useThree();
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<ThreeShaderMaterial>(null);
  const burst = useRef(0);
  const fade = useRef(1);
  /** Eased exactly as SkyDome eases its own, so the two always agree. */
  const day = useRef(0);

  const uniforms = useMemo(
    () => ({
      ...createSkyUniforms(),
      uBurst: { value: 0 },
      uEdgeColor: { value: new Color("#ffffff") },
      uFade: { value: 1 },
    }),
    [],
  );

  useFrame((_state, delta) => {
    const target = STORY[step]?.burst ?? 0;
    const alpha = 1 - Math.exp(-(1 / BURST_EASE_SECONDS) * 6 * delta);
    burst.current += (target - burst.current) * alpha;

    // Hold the burst until the backdrop behind it has actually finished easing
    // up to full daylight — fading on the STORY target instead would uncover a
    // still-darkening sky and read as a dip mid-reveal.
    const dayTarget = STORY[step]?.day ?? 0;
    day.current += (dayTarget - day.current) * easeAlpha(DAY_EASE_SECONDS, delta);
    const fadeTarget = burst.current > 0.98 && day.current > 0.99 ? 0 : 1;
    fade.current += (fadeTarget - fade.current) * (1 - Math.exp(-1.5 * delta * 6));

    // Always through the material: R3F clones the `uniforms` prop, so the
    // memoised object is write-only (see skyUniforms.ts).
    setSkyUniform(matRef.current, "uBurst", burst.current);
    setSkyUniform(matRef.current, "uFade", fade.current);
    setSkyUniform(matRef.current, "uAspect", size.width / size.height);

    if (meshRef.current) {
      meshRef.current.visible = burst.current > 0.001 && fade.current > 0.01;
    }
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-1} visible={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
