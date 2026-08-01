"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ReactNode } from "react";
import type { Group } from "three";
import { MAP_CONFIG } from "@/config/map";
import { useRevolveAngle } from "@/hooks/mapContext";

/**
 * Turns the whole constellation slowly about the map's centre, like an orrery.
 *
 * Everything that has to stay aligned with the islands goes INSIDE this group —
 * the islands, their name labels and the dotted journey trail — so they all
 * share one transform and can never drift apart. (Each island still spins on
 * its own axis inside this; the two motions compose.)
 *
 * The angle is written to a shared ref as well as to the group, because once
 * the islands are moving, an island is no longer where its config position
 * says it is — the project fly-in needs the live angle to aim at one.
 *
 * Constant angular velocity × delta, so the turn takes the same wall-clock
 * time at 60Hz or 144Hz. (easeAlpha is for easing toward a target; a steady
 * rotation just needs delta.)
 */
export function MapOrbit({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group>(null);
  const revolve = useRevolveAngle();

  const speed =
    ((Math.PI * 2) / MAP_CONFIG.revolve.secondsPerRevolution) *
    MAP_CONFIG.revolve.direction;

  useFrame((_state, delta) => {
    revolve.current += speed * delta;
    if (groupRef.current) groupRef.current.rotation.y = revolve.current;
  });

  return <group ref={groupRef}>{children}</group>;
}
