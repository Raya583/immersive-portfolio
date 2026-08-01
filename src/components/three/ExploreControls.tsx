"use client";

import { useMemo, useRef } from "react";
import type { ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { EXPLORE_CONFIG } from "@/config/explore";
import { MAP_CONFIG } from "@/config/map";
import { getIsland } from "@/config/islands";
import { useCreationStep } from "@/hooks/creationContext";
import { useMapProgress, useRevolveAngle } from "@/hooks/mapContext";
import { useSelection } from "@/hooks/selectionContext";
import { easeAlpha } from "@/hooks/creationMath";

/**
 * The camera's single owner once the cinematic ends. Everything that moves the
 * camera lives here on purpose — two components easing the same camera would
 * fight, and the loser wins on alternate frames.
 *
 * Three jobs, in order:
 *
 *  1. EXPLORE unlocks at the final story step: OrbitControls mount and the
 *     camera is placed at a front, slightly-elevated establishing angle.
 *  2. FLATTEN INTO A MAP — after a beat, the camera lifts to the bird's-eye
 *     framing in MAP_CONFIG and is then handed to the viewer for good.
 *  3. PROJECT FLY-IN — clicking an island flies the camera in close, holds it
 *     while the scroll is open, then flies back to exactly where the viewer
 *     left off. Orbit input is muted for the whole round trip.
 *
 * During the fly-in this drives camera.lookAt directly rather than calling
 * controls.update(), which would clamp the camera back out of the close framing
 * on the map's own min-distance. controls.target is kept in step regardless, so
 * handing control back at the end causes no snap.
 */
export function ExploreControls() {
  const step = useCreationStep();
  const camera = useThree((s) => s.camera);
  const progress = useMapProgress();
  const revolve = useRevolveAngle();
  const { selectedId, phase, arrive, finishReturn } = useSelection();

  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const placed = useRef(false);
  /** Seconds since the map transition armed. */
  const elapsed = useRef(0);
  /** Map-flatten completion 0 → 1. Advances on wall-clock, never rewinds. */
  const flight = useRef(0);
  const started = useRef(false);

  /** Fly-in / fly-out completion 0 → 1, reset at each phase change. */
  const focusFlight = useRef(0);
  const lastPhase = useRef(phase);
  /** Where the viewer was before the fly-in, so we can put them back. */
  const restPos = useMemo(() => new Vector3(), []);
  const restTarget = useMemo(() => new Vector3(), []);

  // Scratch vectors — never allocate inside useFrame.
  const desiredPos = useMemo(() => new Vector3(), []);
  const desiredTarget = useMemo(() => new Vector3(), []);

  const cfg = EXPLORE_CONFIG;
  const map = MAP_CONFIG;
  const focus = MAP_CONFIG.focus;

  useFrame((_state, delta) => {
    const controls = controlsRef.current;
    if (!controls || step < map.triggerAtStep) return;

    // ── 2. Map flatten ─────────────────────────────────────────────────────
    if (flight.current < 1) {
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
      return;
    }

    // ── 3. Project fly-in ──────────────────────────────────────────────────
    if (phase !== lastPhase.current) {
      if (phase === "approach") {
        // Remember exactly where the viewer was, so the return lands there
        // rather than at the default map pose they may have orbited away from.
        restPos.copy(camera.position);
        restTarget.copy(controls.target);
        controls.enabled = false;
        focusFlight.current = 0;
      } else if (phase === "return") {
        focusFlight.current = 0;
      }
      lastPhase.current = phase;
    }

    if (phase === "idle") return;

    if (phase === "approach" || phase === "return") {
      const flying = phase === "approach";
      const seconds = flying ? focus.flightSeconds : focus.returnSeconds;

      if (flying) {
        const island = getIsland(selectedId);
        if (!island) {
          // Nothing to fly to — hand the camera straight back.
          controls.enabled = true;
          arrive();
          return;
        }
        const off = island.focusOffset ?? focus.offset;
        // The constellation revolves, so an island's world position is its
        // config position turned by the current revolve angle. Aiming at the
        // raw config position would fly the camera to empty sky.
        const cos = Math.cos(revolve.current);
        const sin = Math.sin(revolve.current);
        const wx = island.position[0] * cos + island.position[2] * sin;
        const wz = -island.position[0] * sin + island.position[2] * cos;

        desiredPos.set(wx + off[0], island.position[1] + off[1], wz + off[2]);
        desiredTarget.set(wx, island.position[1] + focus.targetHeight, wz);
      } else {
        desiredPos.copy(restPos);
        desiredTarget.copy(restTarget);
      }

      focusFlight.current = Math.min(1, focusFlight.current + delta / seconds);

      const alpha = easeAlpha(focus.easeSeconds, delta);
      camera.position.lerp(desiredPos, alpha);
      controls.target.lerp(desiredTarget, alpha);
      camera.lookAt(controls.target);

      if (focusFlight.current >= 1) {
        camera.position.copy(desiredPos);
        controls.target.copy(desiredTarget);
        camera.lookAt(controls.target);
        if (flying) {
          arrive();
        } else {
          controls.enabled = true;
          finishReturn();
        }
      }
      return;
    }

    // phase is "open" or "rollup": hold the framing, input stays muted.
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
