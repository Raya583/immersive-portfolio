"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  type Group,
  type ShaderMaterial as ThreeShaderMaterial,
} from "three";
import { SKY_CONFIG } from "@/config/sky";
import { DAY_EASE_SECONDS } from "@/config/creation";
import { STORY } from "@/config/story";
import { useCreationStep } from "@/hooks/creationContext";
import { easeAlpha } from "@/hooks/creationMath";
import vertexShader from "@/shaders/cloud.vert.glsl";
import fragmentShader from "@/shaders/cloud.frag.glsl";

/**
 * A sparse deck of big, soft, distant clouds far BELOW the islands — from the
 * bird's-eye map you look down past the islands onto them, which is where a
 * sunset cloud layer belongs for a world of floating islands.
 *
 * Deliberately just a handful of huge flat planes with a feathered noise alpha:
 * cheap (one quad each, no volumetrics, no textures), and impossible to read as
 * the cluttered close-up puffs that didn't work before. Count and placement are
 * in SKY_CONFIG.clouds.layout.
 */
export function Clouds() {
  const step = useCreationStep();
  const groupRef = useRef<Group>(null);
  const day = useRef(0);
  const time = useRef(0);
  /** Live materials — R3F clones the `uniforms` prop, so per-frame values have
      to be written here rather than into the objects built below. */
  const mats = useRef<(ThreeShaderMaterial | null)[]>([]);

  const cfg = SKY_CONFIG.clouds;

  // Starting values only; everything that animates is written through `mats`.
  const clouds = useMemo(
    () =>
      cfg.layout.map((cloud) => ({
        position: cloud.position,
        size: cloud.size,
        opacity: cloud.opacity,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uSeed: { value: cloud.seed },
          uWarm: { value: new Color(cfg.warmTint) },
          uCool: { value: new Color(cfg.coolTint) },
          uNoiseScale: { value: cfg.noiseScale },
          uDrift: { value: cfg.driftSpeed },
          uCoverage: { value: cfg.coverage },
          uSoftness: { value: cfg.softness },
        },
      })),
    [cfg],
  );

  useFrame((_state, delta) => {
    const target = STORY[step]?.day ?? 0;
    day.current += (target - day.current) * easeAlpha(DAY_EASE_SECONDS, delta);
    time.current += delta;

    if (groupRef.current) groupRef.current.visible = day.current > 0.01;

    for (let i = 0; i < clouds.length; i++) {
      const u = mats.current[i]?.uniforms;
      if (!u) continue;
      u.uTime!.value = time.current;
      u.uOpacity!.value = clouds[i]!.opacity * cfg.opacity * day.current;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {clouds.map((cloud, i) => (
        <mesh
          key={i}
          position={cloud.position}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={-50}
        >
          <planeGeometry args={[cloud.size[0], cloud.size[1]]} />
          <shaderMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={cloud.uniforms}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
