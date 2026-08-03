"use client";

import type { CSSProperties } from "react";
import { ISLANDS } from "@/config/islands";
import { TRAIL, TRAIL_ORDER } from "@/config/trail";

/**
 * THE TRAIL — a dotted route showing which island to visit first.
 *
 * ── THE WAYPOINTS ARE THE ISLANDS ──────────────────────────────────────────
 * Every point is read from `ISLANDS` in config/islands.ts. Nothing about the
 * route's geometry is written down twice, so moving an island moves the trail
 * with it — the alternative is a second set of coordinates that silently goes
 * stale the first time the map is rearranged.
 *
 * ── WHY TWO PATHS ──────────────────────────────────────────────────────────
 * The islands sit at different coordinates on phones, so the route does too.
 * Both paths are rendered and CSS shows one; computing it from a media query
 * in JS would mean the wrong route on the first paint and a jump afterwards.
 *
 * ── COORDINATES: 160 x 90, NOT 100 x 100 ───────────────────────────────────
 * The viewBox matches the frame's real 16:9 aspect, so one x-unit and one
 * y-unit are the same number of pixels and NOTHING is distorted.
 *
 * The first version used `viewBox="0 0 100 100"` with
 * `preserveAspectRatio="none"` to make a config value of `x: 50` land at 50%
 * of the frame. That works for a line, and `vector-effect` can rescue the
 * stroke — but it cannot rescue a SHAPE. A boat drawn in that space comes out
 * stretched, and worse, `offset-rotate` turns it inside the stretched space,
 * so it SHEARS as it changes heading. A constant counter-scale fixes the
 * unrotated case and nothing else.
 *
 * Multiplying the percentages by 1.6 and 0.9 keeps the exact same alignment
 * with the islands and makes the whole problem disappear.
 */
const VB_W = 160;
const VB_H = 90;

type Pt = { x: number; y: number };

const points = (mobile: boolean): Pt[] =>
  TRAIL_ORDER.map((id) => {
    const isle = ISLANDS.find((i) => i.id === id);
    if (!isle) return null;
    return mobile
      ? { x: isle.mobile.x, y: isle.mobile.y }
      : { x: isle.x, y: isle.y };
  }).filter((p): p is Pt => p !== null);

/**
 * Percentages into the 160x90 viewBox.
 *
 * Kept as a separate step, because the two consumers want different spaces:
 * the PATH is drawn in viewBox units, and the numbered markers are HTML
 * positioned with `left: %`. Converting inside `points()` silently sent 135
 * to a marker's `left`, which threw the whole set off the right of the map.
 */
const toVb = (p: Pt): Pt => ({ x: (p.x / 100) * VB_W, y: (p.y / 100) * VB_H });

/**
 * A path through the waypoints, bowed between each pair.
 *
 * The control point sits at the leg's midpoint pushed along its PERPENDICULAR,
 * so the curve always bulges sideways relative to that leg rather than in some
 * fixed screen direction — which is what keeps the bow looking the same on a
 * short vertical hop as on a long diagonal.
 */
const buildPath = (pts: Pt[]): string => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const bow = TRAIL.bow[i - 1] ?? 0;

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    // Perpendicular to the leg, scaled by the bow.
    const cx = mx - dy * bow;
    const cy = my + dx * bow;

    d += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  }
  return d;
};

/**
 * One boat: the real artwork, centred on the point that rides the path.
 *
 * ── WHY IT IS NOT ROTATED ──────────────────────────────────────────────────
 * The drifting ships elsewhere on this map are drawn upright, and these are
 * the same pictures. Turning them to face their heading would tip them onto
 * their side on the vertical legs, which looks like a shipwreck rather than
 * navigation — `offset-rotate` is set to `0deg` in the stylesheet for exactly
 * this reason. Direction of travel is already carried by the marching dots.
 */
function Ship() {
  const w = TRAIL.ships.width;
  const h = w / TRAIL.ships.aspect;
  return (
    <image
      className="trail-ship-img"
      href={TRAIL.ships.src}
      x={-w / 2}
      y={-h / 2}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

function Route({ mobile }: { mobile: boolean }) {
  const pts = points(mobile).map(toVb);
  const d = buildPath(pts);
  if (!d) return null;

  const pathId = mobile ? "trail-path-mobile" : "trail-path-wide";
  const { count, voyageS } = TRAIL.ships;

  return (
    <g className={mobile ? "trail-route trail-route-mobile" : "trail-route trail-route-wide"}>
      {/* Halo first, so the dotted line always has something to sit on. */}
      <path className="trail-glow" d={d} />
      <path id={pathId} className="trail-line" d={d} />
      <path className="trail-line trail-line-core" d={d} />

      {/*
        Sailed with a CSS motion path, not SMIL `<animateMotion>`.
        `animateMotion` placed the boats correctly and then never advanced them
        — its timeline simply does not run in every context, and it is also
        deaf to `prefers-reduced-motion`. `offset-path` is an ordinary
        animatable property: it can be paused, reduced, and inspected like any
        other, and it reads the same path string the dotted line is drawn from.

        A NEGATIVE `animation-delay` starts each boat already part-way along,
        which is how the fleet ends up spread over the route rather than
        queueing at the first island.
      */}
      {Array.from({ length: count }, (_, i) => (
        <g
          key={i}
          className="trail-ship"
          style={
            {
              "--sail-path": `path("${d}")`,
              "--sail-delay": `-${((voyageS / count) * i).toFixed(2)}s`,
            } as CSSProperties
          }
        >
          <Ship />
        </g>
      ))}
    </g>
  );
}

/**
 * The numbered stops.
 *
 * HTML, not SVG. The path's viewBox is stretched with
 * `preserveAspectRatio="none"` so its coordinates line up with the islands'
 * percentages — and that same stretch turns any circle drawn inside it into an
 * ellipse and skews the numerals. Positioned divs are immune to it, and get
 * real text for free.
 */
function Markers({ mobile }: { mobile: boolean }) {
  return (
    <div
      className={
        mobile ? "trail-marks trail-marks-mobile" : "trail-marks trail-marks-wide"
      }
      aria-hidden="true"
    >
      {points(mobile).map((p, i) => (
        <span
          key={i}
          className="trail-mark"
          style={{
            left: `${p.x}%`,
            top: `calc(${p.y}% + ${TRAIL.markerOffsetY}%)`,
          }}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}

export function MapTrail() {
  return (
    <>
      <svg
        className="map-trail"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        aria-hidden="true"
        focusable="false"
      >
        <Route mobile={false} />
        <Route mobile />
      </svg>
      {TRAIL.markers && (
        <>
          <Markers mobile={false} />
          <Markers mobile />
        </>
      )}
    </>
  );
}
