"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { SAKURA_CONFIG } from "@/config/sakura";

const CELL = 24;
/** Rotation steps baked into the atlas. 16 is indistinguishable from smooth
    at petal size, and means the draw loop never sets a transform. */
const ROTATIONS = 16;

function between(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Pre-renders every petal the engine will ever draw: one row per tint, one
 * column per rotation step. Alpha is baked into the tint, so the loop never
 * touches globalAlpha either — each petal is a single drawImage and nothing
 * else, which is what makes ~900 of them cheap.
 */
function buildAtlas(tints: readonly string[]): HTMLCanvasElement {
  const atlas = document.createElement("canvas");
  atlas.width = CELL * ROTATIONS;
  atlas.height = CELL * tints.length;
  const ctx = atlas.getContext("2d");
  if (!ctx) return atlas;

  const half = CELL / 2;
  const w = CELL * 0.42;
  const h = CELL * 0.72;

  for (let t = 0; t < tints.length; t++) {
    for (let r = 0; r < ROTATIONS; r++) {
      ctx.save();
      ctx.translate(r * CELL + half, t * CELL + half);
      ctx.rotate((r / ROTATIONS) * Math.PI * 2);
      ctx.fillStyle = tints[t]!;
      // Softens the outline so petals read as blossom, not confetti.
      ctx.filter = "blur(0.6px)";

      // A petal: rounded at the wide end, notched at the tip.
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.bezierCurveTo(w * 0.55, -h * 0.34, w * 0.5, h * 0.22, w * 0.16, h / 2);
      ctx.quadraticCurveTo(0, h * 0.36, -w * 0.16, h / 2);
      ctx.bezierCurveTo(-w * 0.5, h * 0.22, -w * 0.55, -h * 0.34, 0, -h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  return atlas;
}

interface Engine {
  start: () => void;
  stop: () => void;
  destroy: () => void;
  burstAt: (x: number, y: number) => void;
}

function createEngine(canvas: HTMLCanvasElement): Engine | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cfg = SAKURA_CONFIG.petals;
  const atlas = buildAtlas(cfg.tints);

  const ambient =
    window.innerWidth < cfg.mobileBreakpoint ? cfg.mobileCount : cfg.count;
  const total = ambient + cfg.burstPool;

  // ── Preallocated, for the whole life of the page ─────────────────────────
  const x = new Float32Array(total);
  const y = new Float32Array(total);
  const size = new Float32Array(total);
  const fall = new Float32Array(total);
  const swayAmp = new Float32Array(total);
  const swayRate = new Float32Array(total);
  const phase = new Float32Array(total);
  const spin = new Float32Array(total);
  const angle = new Float32Array(total);
  const flutter = new Float32Array(total);
  const flutterRate = new Float32Array(total);
  const vx = new Float32Array(total);
  const vy = new Float32Array(total);
  const variant = new Uint8Array(total);
  const alive = new Uint8Array(total);

  let width = window.innerWidth;
  let height = window.innerHeight;

  const seed = (i: number, atX: number, atY: number) => {
    x[i] = atX;
    y[i] = atY;
    size[i] = between(cfg.size[0], cfg.size[1]);
    fall[i] = between(cfg.speed[0], cfg.speed[1]);
    swayAmp[i] = between(cfg.sway[0], cfg.sway[1]);
    swayRate[i] = between(cfg.swaySpeed[0], cfg.swaySpeed[1]);
    phase[i] = Math.random() * Math.PI * 2;
    spin[i] = between(cfg.spin[0], cfg.spin[1]) * (Math.random() < 0.5 ? -1 : 1);
    angle[i] = Math.random() * Math.PI * 2;
    flutter[i] = Math.random() * Math.PI * 2;
    flutterRate[i] = between(cfg.flutterSpeed[0], cfg.flutterSpeed[1]);
    vx[i] = 0;
    vy[i] = 0;
    variant[i] = Math.floor(Math.random() * cfg.tints.length);
  };

  for (let i = 0; i < ambient; i++) {
    seed(i, Math.random() * width, Math.random() * height);
    alive[i] = 1;
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  /** Next burst slot. Bursts recycle oldest-first, so the count is bounded. */
  let burstCursor = 0;

  const burstAt = (bx: number, by: number) => {
    for (let k = 0; k < cfg.burstCount; k++) {
      const i = ambient + burstCursor;
      burstCursor = (burstCursor + 1) % cfg.burstPool;

      seed(i, bx, by);
      const dir = Math.random() * Math.PI * 2;
      const speed = between(cfg.burstSpeed[0], cfg.burstSpeed[1]);
      vx[i] = Math.cos(dir) * speed;
      vy[i] = Math.sin(dir) * speed - cfg.burstLift;
      alive[i] = 1;
    }
  };

  const step = (delta: number) => {
    // One exponential decay for every impulse this frame.
    const decay = Math.exp(-cfg.burstDecay * delta);

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < total; i++) {
      if (!alive[i]) continue;

      vx[i]! *= decay;
      vy[i]! *= decay;

      x[i]! += (cfg.drift + vx[i]!) * delta;
      y[i]! += (fall[i]! + vy[i]!) * delta;
      phase[i]! += swayRate[i]! * delta;
      angle[i]! += spin[i]! * delta;
      flutter[i]! += flutterRate[i]! * delta;

      const drawn = size[i]!;
      const margin = drawn * 2;

      if (i < ambient) {
        // Ambient petals cycle forever.
        if (y[i]! > height + margin) {
          y[i] = -margin;
          x[i] = Math.random() * width;
        }
        if (x[i]! < -margin) x[i] = width + margin;
        else if (x[i]! > width + margin) x[i] = -margin;
      } else if (
        y[i]! > height + margin ||
        x[i]! < -margin ||
        x[i]! > width + margin
      ) {
        // Burst petals retire once they leave, freeing the slot.
        alive[i] = 0;
        continue;
      }

      // Turning edge-on narrows the petal — this is the tumble.
      const flat = 0.28 + 0.72 * Math.abs(Math.cos(flutter[i]!));
      const cell =
        ((angle[i]! / (Math.PI * 2)) % 1 + 1) % 1 * ROTATIONS;
      const col = cell | 0;
      const w = drawn * flat;

      ctx.drawImage(
        atlas,
        col * CELL,
        variant[i]! * CELL,
        CELL,
        CELL,
        x[i]! + Math.sin(phase[i]!) * swayAmp[i]! - w / 2,
        y[i]! - drawn / 2,
        w,
        drawn,
      );
    }
  };

  let frame = 0;
  let last = 0;
  let running = false;

  const tick = (now: number) => {
    // Clamped so a backgrounded tab doesn't teleport every petal on return.
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;
    step(delta);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = 0;
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
  };

  window.addEventListener("resize", resize);

  return {
    start,
    stop,
    burstAt,
    destroy: () => {
      stop();
      window.removeEventListener("resize", resize);
    },
  };
}

/**
 * The falling petals. One canvas for all of them, running only while the map
 * is on screen — the loop is stopped outright behind a landing page rather
 * than left spinning under an opaque overlay.
 *
 * Tune count, speed, size and burst size in SAKURA_CONFIG.petals.
 */
export function PetalField({
  active,
  burstRef,
}: {
  active: boolean;
  burstRef: MutableRefObject<((x: number, y: number) => void) | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createEngine(canvas);
    if (!engine) return;
    engineRef.current = engine;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) burstRef.current = engine.burstAt;

    return () => {
      engine.destroy();
      engineRef.current = null;
      burstRef.current = null;
    };
  }, [burstRef]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active && !reduced) engine.start();
    else engine.stop();
  }, [active]);

  return <canvas ref={canvasRef} className="sakura-petals" aria-hidden="true" />;
}
