"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  Vector3,
  type Points as ThreePoints,
  type ShaderMaterial as ThreeShaderMaterial,
} from "three";
import { PARTICLE_FIELD_CONFIG } from "@/config/particles";
import { STORY, STORY_EASE_SECONDS } from "@/config/story";
import { useParticleField } from "@/hooks/useParticleField";
import { usePointerWorld } from "@/hooks/usePointerWorld";
import { useCreationStep } from "@/hooks/creationContext";
import { easeAlpha } from "@/hooks/creationMath";
import vertexShader from "@/shaders/particles.vert.glsl";
import fragmentShader from "@/shaders/particles.frag.glsl";

/**
 * The ambient particle field — one Points object, custom shader, shimmer +
 * drift + cursor reaction on the GPU. Visibility follows the story: hidden at
 * first (pure black), fading IN as stars appear, then OUT as daylight arrives.
 */
export function ParticleField() {
  const config = PARTICLE_FIELD_CONFIG;
  const { positions, seeds, sizeMuls, colorMixes } = useParticleField(config);

  const pointsRef = useRef<ThreePoints>(null);
  const materialRef = useRef<ThreeShaderMaterial>(null);
  const starVis = useRef(0);

  const pointerWorld = usePointerWorld();
  const step = useCreationStep();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseSize: { value: config.baseSize },
      uShimmerSpeed: { value: config.shimmerSpeed },
      uColorCool: { value: new Color(config.colorCool) },
      uColorWarm: { value: new Color(config.colorWarm) },
      uPointer: { value: new Vector3(999, 999, 999) },
      uPointerRadius: { value: config.pointerRadius },
      uPointerPush: { value: config.pointerPush },
      uPointerGlow: { value: config.pointerGlow },
      uStarFade: { value: 0 },
    }),
    [config],
  );

  useFrame((_state, delta) => {
    const material = materialRef.current;
    if (material) {
      const uTime = material.uniforms.uTime;
      if (uTime) uTime.value += delta;

      const uPointer = material.uniforms.uPointer;
      if (uPointer) uPointer.value.copy(pointerWorld.current);

      const target = STORY[step]?.starAppear ?? 0;
      starVis.current += (target - starVis.current) * easeAlpha(STORY_EASE_SECONDS, delta);
      const uStarFade = material.uniforms.uStarFade;
      if (uStarFade) uStarFade.value = starVis.current;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += config.driftSpeed * delta;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aSizeMul" args={[sizeMuls, 1]} />
        <bufferAttribute attach="attributes-aColorMix" args={[colorMixes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
