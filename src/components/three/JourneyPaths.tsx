"use client";

import { useMemo, useRef } from "react";
import type { ComponentRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from "three";
import { ISLANDS, JOURNEY, type IslandConfig } from "@/config/islands";
import { MAP_CONFIG } from "@/config/map";
import { useMapProgress } from "@/hooks/mapContext";
import { easeAlpha } from "@/hooks/creationMath";

/**
 * The dotted trail linking the islands in JOURNEY order, drawn just beneath
 * them so it reads as a route inked on a map. The stops are smoothed into a
 * Catmull-Rom curve so the trail curves between islands instead of zig-zagging,
 * then rendered as one dashed line. It fades up with the map view; the fade is
 * written straight onto the material from useFrame.
 */
export function JourneyPaths() {
  const progress = useMapProgress();
  const lineRef = useRef<ComponentRef<typeof Line>>(null);
  const opacity = useRef(0);
  const cfg = MAP_CONFIG.path;

  const points = useMemo(() => {
    const stops = JOURNEY.map((id) => ISLANDS.find((island) => island.id === id))
      .filter((island): island is IslandConfig => island !== undefined)
      .map((island) => new Vector3(island.position[0], cfg.y, island.position[2]));

    // Fewer than two stops on screen (e.g. SOLO_MODE) — nothing to draw.
    if (stops.length < 2) return [];

    const curve = new CatmullRomCurve3(
      stops,
      false,
      "catmullrom",
      cfg.curveTension,
    );
    return curve.getPoints((stops.length - 1) * cfg.curveSegments);
  }, [cfg.y, cfg.curveTension, cfg.curveSegments]);

  useFrame((_state, delta) => {
    const line = lineRef.current;
    if (!line) return;

    const target = progress.current > cfg.fadeStart ? 1 : 0;
    opacity.current +=
      (target - opacity.current) * easeAlpha(cfg.fadeSeconds, delta);

    line.visible = opacity.current > 0.01;
    line.material.opacity = opacity.current * cfg.opacity;
  });

  if (points.length === 0) return null;

  return (
    <Line
      ref={lineRef}
      points={points}
      color={cfg.color}
      lineWidth={cfg.lineWidth}
      dashed
      dashSize={cfg.dashSize}
      gapSize={cfg.gapSize}
      transparent
      opacity={0}
      depthWrite={false}
    />
  );
}
