"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { CURTAIN_CONFIG } from "@/config/curtain";
import { getIslandTheme } from "@/config/islandThemes";
import { useSelection } from "@/hooks/selectionContext";
import type { SelectionPhase } from "@/hooks/selectionContext";

/**
 * The scroll curtain — a parchment that unrolls down the screen, holds a beat,
 * then wipes away sideways to reveal the island's landing page behind it. Pure
 * CSS/HTML (see the `.curtain-*` rules in globals.css): no model, no image.
 *
 * It is a TRANSITION, not a container. The only thing written on it is the
 * island's name during the held beat, so the wait reads as "travelling to
 * somewhere" rather than "waiting for something".
 *
 * The component owns the beats between the two camera flights, advancing the
 * phase on timers taken from the same config that feeds the CSS durations.
 */

/** Which beat follows which, and how long the current one lasts. */
const BEATS: Partial<
  Record<SelectionPhase, { next: SelectionPhase; ms: number }>
> = {
  unroll: { next: "hold", ms: CURTAIN_CONFIG.unrollMs },
  hold: { next: "wipe", ms: CURTAIN_CONFIG.holdMs },
  wipe: { next: "page", ms: CURTAIN_CONFIG.wipeMs },
  unwipe: { next: "roll", ms: CURTAIN_CONFIG.wipeMs },
  // Plus a tail, so the parchment is fully shut before the curtain unmounts
  // and hands the screen back to the map — see rollTailMs.
  roll: {
    next: "return",
    ms: CURTAIN_CONFIG.rollMs + CURTAIN_CONFIG.rollTailMs,
  },
};

/** Phases during which the curtain is on screen at all. */
const MOUNTED: SelectionPhase[] = [
  "unroll",
  "hold",
  "wipe",
  "page",
  "unwipe",
  "roll",
];

/** The scroll itself: two rollers with parchment between. Rendered once per
    half; each copy is viewport-aligned, so the seam is invisible. */
function CurtainFace({
  title,
  showMark,
}: {
  title: string;
  showMark: boolean;
}) {
  return (
    <>
      <div className="curtain-roller" />
      <div className="curtain-sheet">
        <div className={`curtain-mark${showMark ? " is-shown" : ""}`}>
          <span className="curtain-spinner" />
          <span className="font-hylia curtain-name">{title}</span>
        </div>
      </div>
      <div className="curtain-roller" />
    </>
  );
}

export function ScrollCurtain() {
  const { selectedId, phase, advance } = useSelection();
  const theme = getIslandTheme(selectedId);

  /** Parchment at full height (false = rolled shut). */
  const [tall, setTall] = useState(false);
  /** Parchment wiped off to the side (false = covering the screen). */
  const [wiped, setWiped] = useState(false);

  const mounted = MOUNTED.includes(phase);

  // Walk the beats. Each timeout is matched to the CSS duration for that beat,
  // so the state changes exactly when the animation finishes.
  useEffect(() => {
    const beat = BEATS[phase];
    if (!beat) return;
    const id = window.setTimeout(
      () => advance(phase, beat.next),
      beat.ms,
    );
    return () => window.clearTimeout(id);
  }, [phase, advance]);

  // Flip the CSS state one frame after the phase lands, so each transition has
  // a start value to animate away from rather than snapping to the end.
  useEffect(() => {
    if (!mounted) {
      setTall(false);
      setWiped(false);
      return;
    }
    let id = 0;
    if (phase === "unroll") id = requestAnimationFrame(() => setTall(true));
    else if (phase === "wipe") id = requestAnimationFrame(() => setWiped(true));
    else if (phase === "unwipe") id = requestAnimationFrame(() => setWiped(false));
    else if (phase === "roll") id = requestAnimationFrame(() => setTall(false));
    return () => {
      if (id) cancelAnimationFrame(id);
    };
  }, [phase, mounted]);

  if (!mounted) return null;

  const timing = {
    "--unroll-ms": `${CURTAIN_CONFIG.unrollMs}ms`,
    "--wipe-ms": `${CURTAIN_CONFIG.wipeMs}ms`,
    "--roll-ms": `${CURTAIN_CONFIG.rollMs}ms`,
    "--mark-delay": `${CURTAIN_CONFIG.markDelayMs}ms`,
  } as CSSProperties;

  const showMark = phase === "hold" || phase === "wipe";

  return (
    <div
      className={`curtain${tall ? " is-tall" : ""}${wiped ? " is-wiped" : ""}`}
      data-phase={phase}
      style={timing}
      aria-hidden="true"
    >
      {/* Two halves of one curtain. Each is clipped to its side of the screen
          and collapses toward the middle on its own transform — the close has
          to be composited, or the paper edge visibly lags the rods dragging
          it in. Both render identical, viewport-aligned content, so together
          they read as a single unbroken scroll. */}
      <div className="curtain-panel curtain-panel-left">
        <div className="curtain-face">
          <CurtainFace title={theme?.heroTitle ?? ""} showMark={showMark} />
        </div>
      </div>
      <div className="curtain-panel curtain-panel-right">
        <div className="curtain-face">
          <CurtainFace title={theme?.heroTitle ?? ""} showMark={showMark} />
        </div>
      </div>

      {/* The two rods the parchment rolls onto. They start at the screen edges
          and sweep inward to meet in the middle, so the scroll closes from both
          sides at once. Outside the clipped wrapper on purpose — each has to
          stay visible at the edge it is dragging inward. */}
      <div className="curtain-rod curtain-rod-left" />
      <div className="curtain-rod curtain-rod-right" />
    </div>
  );
}
