"use client";

import { useEffect, useState } from "react";
import { TRANSITION } from "@/config/sections";

/**
 * The pirate scroll that wipes between the map and a section page.
 *
 * It is a CURTAIN, not a container — nothing you can read lives inside it for
 * long, and it never scrolls or holds layout. Entirely CSS: the parchment is
 * built from stacked gradients (see `.scroll-parchment` in globals.css), the
 * rollers are gradient bars, and no image is loaded for any of it.
 *
 * ── HOW THE UNROLL WORKS ───────────────────────────────────────────────────
 * The sheet's WIDTH (or height) animates while the parchment inside it is
 * painted with `background-attachment: fixed`. That pins the texture to the
 * viewport instead of to the element, so widening the sheet slides an edge
 * across a stationary sheet of parchment — which is what unrolling looks like.
 * Animating a transform instead would stretch the texture and give the game
 * away immediately.
 *
 * The rollers are separate elements riding the sheet's edges, and they swap
 * from vertical to horizontal with the axis.
 */
export type WipeAxis = "horizontal" | "vertical";
export type WipeState = "closed" | "open";

export function ScrollWipe({
  axis,
  state,
  durationMs,
  title,
  showTitle,
}: {
  /** Which way the scroll is unrolled. Horizontal going in, vertical coming out. */
  axis: WipeAxis;
  /** "open" fills the screen; "closed" is a hairline at the centre. */
  state: WipeState;
  durationMs: number;
  /** Destination name, shown during the hold. */
  title: string;
  showTitle: boolean;
}) {
  /**
   * ── WHY THE ENTER IS DEFERRED A FRAME ──────────────────────────────────────
   * This component mounts already asking to be OPEN, and a CSS transition needs
   * a previous computed value to move away from — on a fresh mount there isn't
   * one, so the sheet simply appeared at full width with no unroll at all.
   *
   * So it paints once rolled up at the centre, and only then flips to open,
   * which gives the transition its starting point. Two frames rather than one:
   * the first guarantees the closed geometry has actually been committed to
   * style, the second changes it.
   */
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  const open = state === "open" && entered;

  return (
    <div
      className={`scroll-wipe scroll-wipe-${axis}`}
      aria-hidden="true"
      style={{ "--wipe-ms": `${durationMs}ms` } as React.CSSProperties}
    >
      <div
        className={`scroll-sheet ${open ? "is-open" : ""}`}
        style={
          {
            // The axis being animated collapses to the rolled-up spine; the
            // other stays full-bleed. The sheet is centred on the screen in
            // CSS, so growing one of these expands it symmetrically both ways
            // from the exact middle.
            "--sheet-w":
              axis === "horizontal"
                ? open
                  ? "100vw"
                  : TRANSITION.closedStrip
                : "100vw",
            "--sheet-h":
              axis === "vertical"
                ? open
                  ? "100dvh"
                  : TRANSITION.closedStrip
                : "100dvh",
          } as React.CSSProperties
        }
      >
        <div className="scroll-parchment">
          <div
            className="scroll-title font-hylia"
            style={{
              opacity: showTitle ? 1 : 0,
              transitionDuration: `${Math.round(TRANSITION.holdMs * 0.4)}ms`,
            }}
          >
            {title}
            <span className="scroll-loading" />
          </div>
        </div>

        {/* The rollers. Which pair is visible follows the axis — see globals.css. */}
        <span className="scroll-roller scroll-roller-a" />
        <span className="scroll-roller scroll-roller-b" />
      </div>
    </div>
  );
}
