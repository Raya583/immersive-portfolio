"use client";

import { useEffect, useRef, useState } from "react";
import { PetalField } from "@/components/layout/PetalField";
import { SAKURA_CONFIG } from "@/config/sakura";
import { useStory } from "@/hooks/storyContext";
import { useSelection } from "@/hooks/selectionContext";

/**
 * Falling cherry blossom petals over the island MAP — the one moving layer on
 * top of the still backdrop images. A DOM overlay above the R3F canvas, which
 * is why it lives out here alongside Narration rather than inside the scene.
 *
 * The framing branches used to be drawn here as SVG; map-bg.png supplies them
 * now, so only the petals remain.
 *
 * It shows only on the map: it fades up once the camera has settled into the
 * bird's-eye view, and the petal loop is stopped outright the moment a project
 * opens, so nothing is animating underneath a landing page.
 *
 * The container is pointer-events: none — clicks reach the islands as before.
 */
export function SakuraOverlay() {
  const { step } = useStory();
  const { phase } = useSelection();

  /** Petals belong to the map, so they stop as soon as a project is opening. */
  const onMap = step >= SAKURA_CONFIG.appearAtStep;
  const active = onMap && (phase === "idle" || phase === "approach");

  // Held back until the map flatten has finished, so petals don't drift over
  // the closing beat of the cinematic.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!onMap) {
      setRevealed(false);
      return;
    }
    const id = window.setTimeout(
      () => setRevealed(true),
      SAKURA_CONFIG.fadeDelayMs,
    );
    return () => window.clearTimeout(id);
  }, [onMap]);

  const burstRef = useRef<((x: number, y: number) => void) | null>(null);

  if (!onMap) return null;

  return (
    <div
      className={`sakura${revealed && active ? " is-shown" : ""}`}
      style={{ transitionDuration: `${SAKURA_CONFIG.fadeMs}ms` }}
    >
      <PetalField active={active && revealed} burstRef={burstRef} />
    </div>
  );
}
