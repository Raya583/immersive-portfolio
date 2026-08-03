"use client";

import type { CSSProperties } from "react";
import type { Cat as CatSpec } from "@/config/projectFlair";

/**
 * A small cat, resting on the furniture.
 *
 * Drawn as inline SVG — original shapes, no image and nothing traced. Three
 * poses, each anchored differently so it can sit ON something: `sitting` and
 * `curled` rest their feet on the bottom edge of whatever they are placed
 * against, `peeking` hangs over a top edge.
 *
 * ── HOW THEY BREATHE ───────────────────────────────────────────────────────
 * Three loops at unrelated periods — a slow breath in the body, a tail sway,
 * and an ear flick that is mostly stillness with a twitch in it. Each cat gets
 * its own `--cat-delay` from the config so they never move together, which is
 * the entire difference between "a few cats" and "a repeated asset".
 *
 * Decorative and inert: `pointer-events: none`, `aria-hidden` unless the config
 * gives it a label.
 */
export function Cat({ spec }: { spec: CatSpec }) {
  const { pose, size, flip, delay, color, label } = spec;

  return (
    <span
      className={`cat cat-${pose}`}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      style={
        {
          "--cat-size": `${size}px`,
          "--cat-delay": `${-delay}s`,
          "--cat-color": color,
          transform: flip ? "scaleX(-1)" : undefined,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
        {/* Tail: swept out behind, swaying from where it meets the body. */}
        <g className="cat-tail">
          <path
            d="M44 50 C54 50 58 42 55 34 C53 29 47 28 45 32 C43.5 35.2 46 38 48.5 36.5"
            stroke="var(--cat-color)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        {/* Body — the breath is a very slight vertical swell. */}
        <g className="cat-body">
          {pose === "curled" ? (
            <ellipse cx="32" cy="44" rx="21" ry="13" fill="var(--cat-color)" />
          ) : (
            <path
              d="M20 52 C18 40 22 30 32 30 C42 30 46 40 44 52 Z"
              fill="var(--cat-color)"
            />
          )}

          {/* Head, with the ears cut as one shape so the silhouette reads. */}
          <g className={pose === "curled" ? "cat-head cat-head-low" : "cat-head"}>
            <path
              d="M21 22 L24.5 12 L30 18 A10.5 10.5 0 0 1 34 18 L39.5 12 L43 22 A12 12 0 1 1 21 22 Z"
              fill="var(--cat-color)"
            />
            {/* Eyes: closed, content. Two small arcs. */}
            <path
              d="M26.5 25.5 A3 3 0 0 0 31 25.5 M33 25.5 A3 3 0 0 0 37.5 25.5"
              stroke="var(--cat-eye, rgba(255,255,255,0.85))"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Nose. */}
            <path
              d="M31.2 29.4 L32.8 29.4 L32 30.8 Z"
              fill="var(--cat-eye, rgba(255,255,255,0.85))"
            />
          </g>
        </g>
      </svg>
    </span>
  );
}

/** Every cat configured for one perch, or nothing. */
export function Cats({ cats }: { cats: CatSpec[] }) {
  if (!cats.length) return null;
  return (
    <>
      {cats.map((c, i) => (
        <Cat key={`${c.perch}-${i}`} spec={c} />
      ))}
    </>
  );
}
