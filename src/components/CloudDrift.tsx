"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { CLOUDS, type CloudDeck } from "@/config/clouds";
import { mulberry32, span } from "@/lib/random";

/**
 * One deck of clouds drifting across the map.
 *
 * Every cloud is a single element; all of its variation — size, height, speed,
 * softness, opacity, and which of the three gradient shapes it wears — is
 * generated once from a fixed seed and handed to CSS as custom properties. The
 * animation itself is a plain infinite `translate3d` keyframe, so once the page
 * has painted, JavaScript is finished with this entirely.
 *
 * The trick that makes the sky look already-in-motion on arrival, rather than
 * clouds filing in from the left edge: a NEGATIVE animation delay, unique per
 * cloud, which starts each one partway through its own crossing.
 */
export function CloudDrift({
  deck,
  variant,
  visible,
}: {
  deck: CloudDeck;
  /** "back" sits under the islands, "front" passes over them. */
  variant: "back" | "front";
  visible: boolean;
}) {
  const clouds = useMemo(() => {
    // Offset the seed per deck, so the two don't come out as twins.
    const rand = mulberry32(CLOUDS.seed + (variant === "front" ? 977 : 0));
    return Array.from({ length: deck.count }, (_, i) => {
      const width = span(rand, deck.width);
      const crossS = span(rand, deck.crossS);
      return {
        key: `${variant}-${i}`,
        width,
        height: width * span(rand, deck.squash),
        top: span(rand, deck.band),
        crossS,
        // Somewhere in its own cycle already — see the note above.
        offsetS: -rand() * crossS,
        opacity: span(rand, deck.opacity),
        blur: span(rand, deck.blurPx),
        // Three hand-written puff shapes, cycled; see globals.css.
        shape: (i % 3) + 1,
      };
    });
  }, [deck, variant]);

  return (
    <div
      className={`cloud-layer cloud-layer-${variant}`}
      aria-hidden="true"
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${CLOUDS.fadeInMs}ms`,
      }}
    >
      {clouds.map((c) => (
        <span
          key={c.key}
          className={`cloud cloud-shape-${c.shape}`}
          style={
            {
              "--cloud-w": `${c.width}vw`,
              "--cloud-h": `${c.height}vw`,
              "--cloud-top": `${c.top}%`,
              "--cloud-dur": `${c.crossS}s`,
              "--cloud-delay": `${c.offsetS}s`,
              "--cloud-o": c.opacity,
              "--cloud-blur": `${c.blur}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
