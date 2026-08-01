"use client";

import { useMemo, useRef } from "react";
import type { ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { EXPLORE_CONFIG } from "@/config/explore";
import { MAP_CONFIG } from "@/config/map";
import { useCreationStep } from "@/hooks/creationContext";
import { useMapProgress } from "@/hooks/mapContext";
import { easeAlpha } from "@/hooks/creationMath";

/**
 * Free-explore camera. Mounts OrbitControls once the cinematic reaches its
 * final step. On the first frame of explore it places the camera at a FRONT,
 * slightly-elevated angle (not looking straight down).
 *
 * Then the world FLATTENS INTO A MAP: after a short beat (so the islands can
 * finish rising in) this steers the camera and the orbit target up to the
 * bird's-eye framing in MAP_CONFIG, using frame-rate-independent easing. Input
 * is muted for the length of the flight, and once MAP_CONFIG.flightSeconds has
 * elapsed the camera is handed back to the viewer permanently — from then on
 * this never touches it again, so orbiting from the top-down resting pose is
 * completely free.
 */
export function ExploreControls() {
  const step = useCreationStep();
  const camera = useThree((s) => s.camera);
  const progress = useMapProgress();

  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const placed = useRef(false);
  /** Seconds since the map transition armed. */
  const elapsed = useRef(0);
  /** Flight completion 0 → 1. Advances on wall-clock, never rewinds. */
  const flight = useRef(0);
  const started = useRef(false);

  // Scratch vectors — never allocate inside useFrame.
  const desiredPos = useMemo(() => new Vector3(), []);
  const desiredTarget = useMemo(() => new Vector3(), []);

  const cfg = EXPLORE_CONFIG;
  const map = MAP_CONFIG;

  useFrame((_state, delta) => {
    const controls = controlsRef.current;
    if (!controls || step < map.triggerAtStep) return;
    // Flight over: the camera belongs to the viewer now.
    if (flight.current >= 1) return;

    elapsed.current += delta;
    if (elapsed.current < map.delaySeconds) return;

    if (!started.current) {
      started.current = true;
      // Swap in the map's clamps first — the old ones would fight a top-down
      // pose (and clamp the camera straight back out of it on the next update).
      controls.minDistance = map.orbit.minDistance;
      controls.maxDistance = map.orbit.maxDistance;
      controls.minPolarAngle = map.orbit.minPolar;
      controls.maxPolarAngle = map.orbit.maxPolar;
      controls.enableRotate = false;
      controls.enableZoom = false;
    }

    flight.current = Math.min(1, flight.current + delta / map.flightSeconds);
    progress.current = flight.current;

    desiredPos.set(
      map.camera.position[0],
      map.camera.position[1],
      map.camera.position[2],
    );
    desiredTarget.set(
      map.camera.target[0],
      map.camera.target[1],
      map.camera.target[2],
    );

    const alpha = easeAlpha(map.easeSeconds, delta);
    camera.position.lerp(desiredPos, alpha);
    controls.target.lerp(desiredTarget, alpha);

    if (flight.current >= 1) {
      camera.position.copy(desiredPos);
      controls.target.copy(desiredTarget);
      controls.enableRotate = true;
      controls.enableZoom = true;
    }

    controls.update();
  });

  if (step < cfg.unlockAtStep) return null;

  if (!placed.current) {
    const [tx, ty, tz] = cfg.orbit.startPosition;
    camera.position.set(tx, ty, tz);
    camera.lookAt(cfg.orbit.target[0], cfg.orbit.target[1], cfg.orbit.target[2]);
    placed.current = true;
  }

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={cfg.orbit.target}
      minDistance={cfg.orbit.minDistance}
      maxDistance={cfg.orbit.maxDistance}
      minPolarAngle={cfg.orbit.minPolar}
      maxPolarAngle={cfg.orbit.maxPolar}
      enablePan={cfg.orbit.enablePan}
      enableDamping
      dampingFactor={cfg.orbit.dampingFactor}
    />
  );
}
