"use client";

import type { CSSProperties } from "react";
import { WINTER_SCENERY } from "@/config/islandThemes";

/**
 * Winter silhouettes: bare branches reaching in from the corners, and a deer
 * that crosses the lower page every so often. All of it is distant shadow —
 * dark, soft-edged, low opacity — sitting behind the snow and far behind the
 * hero text.
 *
 * Pure inline SVG, no images. The whole layer is one fixed, pointer-events-none
 * div, and every animation is a CSS transform (composited, so none of it
 * touches layout).
 *
 * Everything tunable — opacity, blur, sway, deer speed and frequency — lives in
 * WINTER_SCENERY in config/islandThemes.ts.
 */

/** One bare limb with twigs, drawn as tapering strokes. */
function Branch() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* main limb, thick at the trunk and tapering out */}
      <path d="M-6 8 C 40 22, 88 34, 132 52" strokeWidth="9" />
      <path d="M132 52 C 156 61, 174 70, 190 82" strokeWidth="5" />
      <path d="M190 82 C 202 90, 210 97, 218 106" strokeWidth="3" />

      {/* upper twigs */}
      <path d="M46 21 C 58 10, 66 4, 72 -6" strokeWidth="4" />
      <path d="M72 -6 C 76 -12, 78 -18, 79 -25" strokeWidth="2.2" />
      <path d="M62 6 C 70 2, 78 1, 86 2" strokeWidth="2" />

      <path d="M96 37 C 108 28, 116 22, 122 12" strokeWidth="3.4" />
      <path d="M122 12 C 127 6, 130 0, 131 -7" strokeWidth="1.8" />

      <path d="M150 58 C 160 50, 168 45, 178 41" strokeWidth="2.8" />
      <path d="M178 41 C 186 38, 193 37, 200 37" strokeWidth="1.6" />

      {/* lower twigs */}
      <path d="M72 27 C 80 38, 84 47, 86 58" strokeWidth="3" />
      <path d="M86 58 C 88 66, 88 72, 86 79" strokeWidth="1.7" />

      <path d="M124 48 C 132 58, 136 66, 138 76" strokeWidth="2.4" />
      <path d="M168 68 C 176 76, 180 83, 183 91" strokeWidth="1.8" />
    </g>
  );
}

/**
 * A leaping deer. Body, neck and head are filled shapes; legs and antlers are
 * strokes, which keeps the outline readable once it is blurred down to a
 * shadow. The four legs animate on alternating phases for a soft gallop.
 */
function Deer() {
  return (
    <svg
      className="winter-deer-svg"
      viewBox="0 0 230 150"
      role="img"
      aria-label=""
      focusable="false"
    >
      <g fill="currentColor" stroke="currentColor" strokeLinecap="round">
        {/* legs — behind the body, alternating gallop phases */}
        <g fill="none" strokeWidth="5">
          <path
            className="winter-deer-leg winter-deer-leg-a"
            d="M78 88 C 70 102, 62 112, 52 122"
            style={{ transformOrigin: "78px 88px" }}
          />
          <path
            className="winter-deer-leg winter-deer-leg-b"
            d="M92 90 C 88 104, 84 114, 78 126"
            style={{ transformOrigin: "92px 90px" }}
          />
          <path
            className="winter-deer-leg winter-deer-leg-b"
            d="M140 88 C 146 102, 152 112, 160 122"
            style={{ transformOrigin: "140px 88px" }}
          />
          <path
            className="winter-deer-leg winter-deer-leg-a"
            d="M152 84 C 160 96, 168 106, 178 114"
            style={{ transformOrigin: "152px 84px" }}
          />
        </g>

        {/* body */}
        <ellipse cx="114" cy="74" rx="42" ry="18" />
        {/* haunch and shoulder, rounding the body out */}
        <circle cx="82" cy="72" r="20" />
        <circle cx="146" cy="72" r="16" />

        {/* neck */}
        <path d="M142 62 L 168 30 L 180 36 L 156 70 Z" />
        {/* head */}
        <ellipse
          cx="184"
          cy="32"
          rx="15"
          ry="7.5"
          transform="rotate(-22 184 32)"
        />
        {/* snout */}
        <path d="M193 22 L 206 15 L 208 21 L 197 29 Z" />
        {/* ear */}
        <path d="M174 22 L 169 10 L 180 19 Z" />

        {/* antlers */}
        <g fill="none" strokeWidth="2.6">
          <path d="M176 20 C 178 10, 184 4, 190 1" />
          <path d="M180 12 C 186 11, 191 12, 195 14" />
          <path d="M178 16 C 174 9, 172 5, 172 0" />
          <path d="M186 6 C 190 3, 195 2, 200 3" />
        </g>

        {/* tail */}
        <path
          d="M64 62 C 58 55, 56 49, 60 43"
          fill="none"
          strokeWidth="6"
        />
      </g>
    </svg>
  );
}

export function WinterAtmosphere() {
  const { branches, deer } = WINTER_SCENERY;

  const vars = {
    "--branch-opacity": branches.opacity,
    "--branch-blur": `${branches.blur}px`,
    "--branch-sway": `${branches.swaySeconds}s`,
    "--branch-degrees": `${branches.swayDegrees}deg`,
    "--branch-color": branches.color,
    "--deer-opacity": deer.opacity,
    "--deer-blur": `${deer.blur}px`,
    "--deer-cross": `${deer.crossSeconds}s`,
    "--deer-every": `${deer.everySeconds}s`,
    "--deer-stride": `${deer.strideSeconds}s`,
    "--deer-bounce": `${deer.bouncePx}px`,
    "--deer-height": `${deer.heightPx}px`,
    "--deer-baseline": `${deer.baseline * 100}%`,
    "--deer-color": deer.color,
  } as CSSProperties;

  return (
    <div className="landing-scenery winter-scenery" style={vars} aria-hidden="true">
      {/* Branches reach in from both top corners and one side, so the hero
          reads as being framed by trees rather than decorated with them. */}
      <svg className="winter-branch winter-branch-tl" viewBox="0 0 230 120">
        <Branch />
      </svg>
      <svg className="winter-branch winter-branch-tr" viewBox="0 0 230 120">
        <Branch />
      </svg>
      <svg className="winter-branch winter-branch-l" viewBox="0 0 230 120">
        <Branch />
      </svg>

      {/* The deer crosses, then waits out the rest of the cycle off-screen. */}
      <div className="winter-deer">
        <div className="winter-deer-bob">
          <Deer />
        </div>
      </div>
    </div>
  );
}
