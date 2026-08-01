"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { BACKDROP_CONFIG } from "@/config/backdrop";
import { useStory } from "@/hooks/storyContext";

/**
 * The still images the map is built on: the sunset background filling the
 * viewport, and the temple standing in front of it.
 *
 * These sit BEHIND the R3F canvas in the DOM (see the layer order in
 * config/backdrop.ts), which is why they can never move — they are not scene
 * objects, so no camera orbit, revolve or rotation touches them. The canvas
 * above is cleared transparent so they show through.
 *
 * They fade up at the story beat where the sky burst covers the screen, so
 * they are already in place when it clears, and the void → stars opening plays
 * against black exactly as before.
 *
 * next/image handles the heavy PNGs — these are multi-megabyte source files,
 * and this serves sized, modern-format versions instead.
 */
export function MapBackdrop() {
  const { step } = useStory();
  const { background, temple, revealAtStep, fadeMs } = BACKDROP_CONFIG;

  const shown = step >= revealAtStep;

  const templeStyle = {
    width: `min(${temple.widthVw}vw, ${temple.maxWidthRem}rem)`,
    left: `${temple.centerX}%`,
    top: `${temple.centerY}%`,
    opacity: temple.opacity,
  } as CSSProperties;

  return (
    <div
      className={`backdrop${shown ? " is-shown" : ""}`}
      style={{ transitionDuration: `${fadeMs}ms` }}
      aria-hidden="true"
    >
      <div className="backdrop-sky">
        <Image
          src={background.src}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: background.position }}
        />
      </div>

      {temple.enabled && (
        <Image
          className="backdrop-temple"
          src={temple.src}
          alt=""
          width={1536}
          height={1024}
          priority
          sizes="100vw"
          style={templeStyle}
        />
      )}
    </div>
  );
}
