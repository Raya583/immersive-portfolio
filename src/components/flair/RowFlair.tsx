"use client";

import { useEffect, useRef } from "react";
import type { DriftKind, RowBranding } from "@/config/projectFlair";
import { Cat } from "./Cat";
import { mulberry32, span } from "@/lib/random";
import { drawShape } from "./shapes";

/**
 * The decoration inside a branded quest-log row: slices drifting across it,
 * and a cat sitting on one end.
 *
 * ── CLIPPED TO THE ROW ─────────────────────────────────────────────────────
 * The canvas fills the row rather than the viewport, and sizes itself from its
 * own box through a ResizeObserver. Rows change height when the window is
 * resized — and on a phone they restack entirely — so measuring the window
 * would leave the drift running in the wrong rectangle.
 *
 * Behind the row's own content and `pointer-events: none`, so the row stays
 * one clickable button.
 */

interface Piece {
  kind: DriftKind;
  colors: string[];
  x: number;
  y: number;
  size: number;
  speed: number;
  bob: number;
  bobSpeed: number;
  phase: number;
  spin: number;
  angle: number;
  alpha: number;
}

export function RowFlair({ branding }: { branding: RowBranding }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    const motion = reduced ? 0.22 : 1;
    const spec = branding.drift;
    if (!spec) return;

    let width = 0;
    let height = 0;
    let pieces: Piece[] = [];
    const rand = mulberry32(0x51ce5);
    const TAU = Math.PI * 2;

    const build = () => {
      const count = mobile ? spec.mobileCount : spec.count;
      // Weighted, like the page-wide field — so a row can carry a mix rather
      // than only whatever happens to be first.
      const total = spec.mix.reduce((n: number, m) => n + m.weight, 0);
      const pickEntry = () => {
        let r = rand() * total;
        for (const m of spec.mix) {
          r -= m.weight;
          if (r <= 0) return m;
        }
        return spec.mix[0];
      };
      pieces = Array.from({ length: count }, () => {
        // ONE draw per piece. Calling pickEntry twice would let a headphone
        // take a pizza's colours whenever the two rolls disagreed.
        const entry = pickEntry();
        return {
        kind: entry?.kind ?? "slice",
        colors: entry?.colors ?? ["#fff"],
        x: rand() * width,
        // Kept off the very top and bottom, so a slice never looks half-eaten
        // by the row's rounded corner.
        y: height * (0.16 + rand() * 0.68),
        size: span(rand, spec.size),
        speed: span(rand, spec.speed),
        bob: span(rand, spec.bob),
        bobSpeed: span(rand, spec.bobSpeed),
        phase: rand() * TAU,
        spin: span(rand, spec.spin),
        angle: rand() * TAU,
        alpha: span(rand, spec.opacity),
        };
      });
    };

    const measure = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = r.width;
      height = r.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(canvas);

    let last = 0;
    let frame = 0;

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const p of pieces) {
        p.x += p.speed * dt * motion;
        p.phase += p.bobSpeed * dt * TAU * motion;
        p.angle += p.spin * dt * TAU * motion;
        // Wrap within the row, both ways.
        if (p.speed > 0 && p.x - p.size > width) p.x = -p.size;
        if (p.speed < 0 && p.x + p.size < 0) p.x = width + p.size;

        ctx.save();
        ctx.translate(p.x, p.y + Math.sin(p.phase) * p.bob);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        drawShape(ctx, p.kind, p.size, p.alpha, p.colors);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [branding]);

  return (
    <span className="row-flair" aria-hidden="true">
      {branding.drift && <canvas ref={canvasRef} className="row-flair-canvas" />}
      {branding.cat && (
        <span className={`row-flair-cat row-flair-cat-${branding.cat.at}`}>
          <Cat
            spec={{
              perch: "title",
              pose: branding.cat.pose,
              size: branding.cat.size,
              flip: branding.cat.flip,
              delay: branding.cat.delay,
              color: branding.cat.color,
              label: "",
            }}
          />
        </span>
      )}
    </span>
  );
}
