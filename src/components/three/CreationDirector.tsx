"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  type AmbientLight,
  type DirectionalLight,
  type Fog,
  type HemisphereLight,
} from "three";
import { CREATION_CONFIG, DAY_EASE_SECONDS } from "@/config/creation";
import { SKY_CONFIG, SUN_POSITION } from "@/config/sky";
import { STORY } from "@/config/story";
import { lerp, easeAlpha } from "@/hooks/creationMath";
import { useCreationStep } from "@/hooks/creationContext";

/**
 * Conductor of the creation cinematic. Eases fog and lighting from the void's
 * cold violet to GOLDEN HOUR as the story's `day` value rises — a low warm sun
 * plus a hemisphere fill (warm from the sky, cool violet from below) that keeps
 * the islands reading clearly from overhead even with the sun this low.
 *
 * The sky itself is drawn by SkyDome; the background colour set here is only a
 * fallback for anything the backdrop doesn't cover.
 */
export function CreationDirector() {
  const step = useCreationStep();
  const scene = useThree((s) => s.scene);

  const ambientRef = useRef<AmbientLight>(null);
  const sunRef = useRef<DirectionalLight>(null);
  const hemiRef = useRef<HemisphereLight>(null);
  const fogRef = useRef<Fog>(null);
  const day = useRef(0);

  const c = CREATION_CONFIG;
  const light = SKY_CONFIG.light;

  const bgFrom = useRef(new Color(c.voidColor));
  const bgTo = useRef(new Color(c.skyColor));
  const bgNow = useRef(new Color(c.voidColor));
  const fogFrom = useRef(new Color(c.voidFogColor));
  const fogTo = useRef(new Color(c.skyFogColor));
  const ambFrom = useRef(new Color(c.voidAmbientColor));
  const ambTo = useRef(new Color(light.ambientColor));
  const sunFrom = useRef(new Color(c.voidSunColor));
  const sunTo = useRef(new Color(light.sunColor));

  useFrame((_state, delta) => {
    const target = STORY[step]?.day ?? 0;
    day.current += (target - day.current) * easeAlpha(DAY_EASE_SECONDS, delta);
    const p = day.current;

    bgNow.current.copy(bgFrom.current).lerp(bgTo.current, p);
    scene.background = bgNow.current;

    if (fogRef.current) {
      fogRef.current.color.copy(fogFrom.current).lerp(fogTo.current, p);
      fogRef.current.near = lerp(c.voidFogNear, c.skyFogNear, p);
      fogRef.current.far = lerp(c.voidFogFar, c.skyFogFar, p);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = lerp(c.voidAmbient, light.ambientIntensity, p);
      ambientRef.current.color.copy(ambFrom.current).lerp(ambTo.current, p);
    }
    if (sunRef.current) {
      sunRef.current.intensity = lerp(c.voidSunIntensity, light.sunIntensity, p);
      sunRef.current.color.copy(sunFrom.current).lerp(sunTo.current, p);
    }
    if (hemiRef.current) {
      // Dusk-only: there is nothing for it to bounce off in the void.
      hemiRef.current.intensity = lerp(0, light.hemiIntensity, p);
    }
  });

  return (
    <>
      <fog
        ref={fogRef}
        attach="fog"
        args={[c.voidFogColor, c.voidFogNear, c.voidFogFar]}
      />
      <ambientLight
        ref={ambientRef}
        intensity={c.voidAmbient}
        color={c.voidAmbientColor}
      />
      <directionalLight
        ref={sunRef}
        position={SUN_POSITION}
        intensity={c.voidSunIntensity}
        color={c.voidSunColor}
      />
      <hemisphereLight
        ref={hemiRef}
        args={[light.hemiSkyColor, light.hemiGroundColor, 0]}
      />
    </>
  );
}
