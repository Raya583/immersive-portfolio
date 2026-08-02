"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAP_SIZE, REGIONS } from "@/config/regions";

/**
 * The map hub: the continent, with a clickable hotspot over each of its five
 * terrains.
 *
 * How the two layers stay in register: the SVG uses the image's own pixel
 * dimensions as its viewBox and is stretched over the exact same box, so every
 * polygon in config/regions.ts is in map-image pixels and scales with the art
 * at any screen size — no recalculation anywhere.
 *
 * Accessibility: the polygons are decorative and aria-hidden. Each region's
 * real, focusable, crawlable link is the HTML label sitting on top, so the map
 * is fully navigable by keyboard and legible to a search engine that never
 * renders the SVG. Hovering either the shape or its label lights up both.
 */
export function WorldMap({ revealed }: { revealed: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-[1500px] px-3 sm:px-6">
      {/*
        The box must keep the image's exact 3:2 ratio — the SVG overlay is
        stretched to this box, so any letterboxing would slide every hotspot
        out of register with the terrain under it. So instead of clamping the
        height, the WIDTH is bounded by both the column and the space actually
        available vertically, and the ratio does the rest.
      */}
      <div
        className="relative mx-auto"
        style={{
          aspectRatio: `${MAP_SIZE.width} / ${MAP_SIZE.height}`,
          width: `min(100%, calc(68dvh * ${MAP_SIZE.width / MAP_SIZE.height}))`,
        }}
      >
        {/* The continent. Masked at the edges so the artwork's own rectangular
            border melts into the navy sea instead of sitting on it as a box. */}
        <div
          className="absolute inset-0 transition-all ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "scale(1)" : "scale(1.06)",
            transitionDuration: "1600ms",
            WebkitMaskImage:
              "radial-gradient(ellipse 76% 76% at 50% 50%, #000 58%, transparent 94%)",
            maskImage:
              "radial-gradient(ellipse 76% 76% at 50% 50%, #000 58%, transparent 94%)",
          }}
        >
          <Image
            src="/images/world-map.png"
            alt="A painted map of a fantasy continent: snow peaks to the north, forest west, desert east, green plains at the centre and a harbour to the south."
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1500px"
            className="object-contain"
          />
        </div>

        {/* Hotspots. Decorative — the labels below carry the real links. */}
        <svg
          viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          {REGIONS.map((region) => (
            <polygon
              key={region.id}
              points={region.polygon.map(([x, y]) => `${x},${y}`).join(" ")}
              className={`hotspot ${active === region.id ? "is-active" : ""}`}
              onMouseEnter={() => setActive(region.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => router.push(`/${region.id}`)}
            />
          ))}
        </svg>

        {/* Labels: real links, positioned in the same coordinate space. */}
        {REGIONS.map((region) => {
          const isActive = active === region.id;
          return (
            <Link
              key={region.id}
              href={`/${region.id}`}
              onMouseEnter={() => setActive(region.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(region.id)}
              onBlur={() => setActive(null)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-sm px-1.5 py-0.5 text-center backdrop-blur-[2px] sm:px-3 sm:py-1.5 transition-all duration-300 ${
                isActive
                  ? "border border-gold/70 bg-navy-deep/80"
                  : "border border-transparent bg-navy-deep/55"
              }`}
              style={{
                left: `${(region.label.x / MAP_SIZE.width) * 100}%`,
                top: `${(region.label.y / MAP_SIZE.height) * 100}%`,
                opacity: revealed ? 1 : 0,
                transitionDuration: "900ms",
                transitionDelay: revealed ? "900ms" : "0ms",
              }}
            >
              <span
                className={`block whitespace-nowrap font-display text-[0.5rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300 sm:text-base sm:tracking-[0.2em] md:text-lg ${
                  isActive
                    ? "scale-110 text-gold-light text-gold-glow"
                    : "text-parchment-light"
                }`}
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}
              >
                {region.name}
              </span>
              <span
                className={`mt-0.5 hidden whitespace-nowrap font-body text-[0.5rem] uppercase tracking-[0.28em] transition-colors duration-300 sm:mt-1 sm:block sm:text-[0.68rem] ${
                  isActive ? "text-gold-light" : "text-parchment/90"
                }`}
                style={{ textShadow: "0 1px 5px rgba(0,0,0,0.9)" }}
              >
                {region.kicker}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
