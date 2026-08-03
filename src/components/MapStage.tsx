"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ISLANDS, MAP_BACKGROUND, MAP_TIMING } from "@/config/islands";
import { TRANSITION } from "@/config/sections";
import { CLOUDS } from "@/config/clouds";
import { CloudDrift } from "./CloudDrift";
import { MapTrail } from "./MapTrail";
import { trailVars } from "@/config/trail";
import { BoatDrift } from "./BoatDrift";

/**
 * The world the void becomes: the ocean backdrop, and the five lands that rise
 * out of it.
 *
 * The stage is a FIXED-ASPECT box sized to fit the screen — 16:9 on desktop,
 * 3:4 on phones — which is what lets every island be placed in plain
 * percentages that hold their arrangement at any window size.
 *
 * Hover swaps to the glowing artwork. Both images are rendered from the moment
 * the islands mount and cross-faded by opacity, rather than swapping `src`:
 * the glow is therefore already decoded when the pointer arrives, so the swap
 * is instant with no flicker or network wait.
 */
export function MapStage({
  oceanVisible,
  islandsVisible,
  onSelect,
  focusId,
  zoomed,
}: {
  oceanVisible: boolean;
  islandsVisible: boolean;
  /** Called with the island's section id when it is clicked. */
  onSelect: (id: string) => void;
  /** The island being opened — the point the zoom pushes toward. */
  focusId: string | null;
  zoomed: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodes = useRef<Record<string, HTMLButtonElement | null>>({});
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  /*
   * The zoom pushes toward the island you actually clicked, so its centre has
   * to become the transform-origin. That point is measured from the live
   * element rather than derived from the config, because the island's position
   * is a percentage of a stage whose pixel size depends on the window — and
   * `transform-origin` needs somewhere concrete to aim at.
   *
   * useLayoutEffect, not useEffect: the origin must be in place in the same
   * frame the zoom class lands, or the first frame scales from the centre and
   * the whole map visibly jumps before settling.
   */
  useLayoutEffect(() => {
    if (!focusId) {
      setOrigin(null);
      return;
    }
    const el = nodes.current[focusId];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [focusId]);

  return (
    <div
      className={`map-stage ${zoomed ? "is-zoomed" : ""}`}
      data-islands={islandsVisible ? "" : undefined}
      style={
        {
          opacity: oceanVisible ? 1 : 0,
          /*
           * TWO durations, in the order `transition-property` lists them:
           * opacity (the slow ocean cross-fade) then transform (the quick zoom).
           * A single value here applies to BOTH — which is what happened, and
           * it ran the zoom at the cross-fade's 3.4s. The map was still drifting
           * inwards long after the scroll had covered it, and still drifting
           * back out when the scroll uncovered it on the way home.
           */
          transitionDuration: `${MAP_TIMING.crossFadeMs}ms, ${TRANSITION.zoomMs}ms`,
          "--zoom-scale": TRANSITION.zoomScale,
          // The trail's colours, dash and speed, from config/trail.ts.
          ...trailVars(),
          ...(origin
            ? { "--zoom-x": `${origin.x}px`, "--zoom-y": `${origin.y}px` }
            : null),
        } as CSSProperties
      }
      aria-hidden={!islandsVisible}
    >
      {/*
        The ocean covers the whole viewport, outside the frame below. Keeping
        it inside a fixed-aspect box letterboxed it with black bars on any
        screen that wasn't 16:9.
      */}
      <Image
        src={MAP_BACKGROUND}
        alt=""
        fill
        priority
        sizes="100vw"
        className="map-ocean"
      />

      {/* Weather under the islands: the sky they are sitting in. */}
      <CloudDrift deck={CLOUDS.back} variant="back" visible={oceanVisible} />

      {/*
        The frame is now purely the ISLAND COORDINATE SPACE — a fixed-aspect
        box so every percentage in config/islands.ts means the same thing at
        any window size. It paints nothing itself.
      */}
      <div className="map-frame">
        {/*
          The fleet goes in FIRST, so every ship paints behind the land and
          behind the name plaques. Being inside the frame also hands it the
          islands' own coordinate space, which is what lets the lanes in
          config/boats.ts be checked directly against the island extents.
        */}
        <BoatDrift visible={islandsVisible} />

        {/* The suggested route. Before the islands in source order and pinned
            below them, so it never covers the artwork or eats a click. */}
        <MapTrail />

        {ISLANDS.map((island) => {
          const isHovered = hovered === island.id;
          const riseDelay = island.order * MAP_TIMING.riseStagger;

          return (
            <button
              key={island.id}
              type="button"
              aria-label={island.name}
              ref={(el) => {
                nodes.current[island.id] = el;
              }}
              onClick={() => onSelect(island.id)}
              onMouseEnter={() => setHovered(island.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(island.id)}
              onBlur={() => setHovered(null)}
              tabIndex={islandsVisible ? 0 : -1}
              className={`island ${islandsVisible ? "is-risen" : ""}`}
              style={
                {
                  "--x": `${island.x}%`,
                  "--y": `${island.y}%`,
                  "--w": `${island.width}%`,
                  "--mx": `${island.mobile.x}%`,
                  "--my": `${island.mobile.y}%`,
                  "--mw": `${island.mobile.width}%`,
                  "--rise-ms": `${MAP_TIMING.riseMs}ms`,
                  "--rise-delay": `${riseDelay}ms`,
                  "--rise-drift": `${MAP_TIMING.riseDrift}px`,
                  "--rise-scale": MAP_TIMING.riseScale,
                } as CSSProperties
              }
            >
              {/*
                Inner wrapper owns the hover scale. The outer element is already
                animating transform for the rise, and one element cannot run two
                independent transforms — nesting keeps them from fighting.
              */}
              <span className="island-art">
                <Image
                  src={island.image}
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 640px) 55vw, 34vw"
                  className="island-img"
                  style={{ opacity: isHovered ? 0 : 1 }}
                />
                <Image
                  src={island.glow}
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 640px) 55vw, 34vw"
                  className="island-img island-img-glow"
                  style={{ opacity: isHovered ? 1 : 0 }}
                />
              </span>

              {/*
                The stagger goes on `--label-delay`, which globals.css applies
                to the OPACITY transition alone — not to `transition-delay`,
                which would delay every animated property on this element. It
                did exactly that: the same 0.6-1.4s stagger that walks the names
                in one by one was also sitting in front of the hover, so a label
                took over a second to light up after the pointer arrived.
              */}
              <span
                className={`island-label font-hylia ${isHovered ? "is-lit" : ""}`}
                style={
                  {
                    "--label-delay": islandsVisible
                      ? `${riseDelay + MAP_TIMING.labelDelayMs}ms`
                      : "0ms",
                    opacity: islandsVisible ? undefined : 0,
                  } as CSSProperties
                }
              >
                {island.name}
              </span>
            </button>
          );
        })}
      </div>

      {/*
        And weather in front of them. Faint by design — it crosses the island
        art and the names, so this deck buys its depth against legibility.
      */}
      <CloudDrift deck={CLOUDS.front} variant="front" visible={oceanVisible} />
    </div>
  );
}
