"use client";

import { useEffect, useRef } from "react";
import { COSMOS } from "@/config/cosmos";

/**
 * Deep space on a single Canvas 2D layer: a nebula, thousands of stars at
 * three depths, mouse parallax, click ripples, and the big bang that starts it.
 *
 * ── WHY THIS IS CHEAP ──────────────────────────────────────────────────────
 * The expensive things are painted ONCE into offscreen canvases — the nebula,
 * and each star layer — and thereafter only *moved*. A normal frame is four
 * drawImage calls plus ~130 twinkling stars, whatever the total star count. The
 * bang and click effects are the only other per-frame work, and both are
 * short-lived.
 *
 * Everything is delta-timed, so it runs at the same speed on any refresh rate,
 * and the loop stops when the scene leaves the screen.
 *
 * ── ONE RULE ───────────────────────────────────────────────────────────────
 * The loop stops for exactly one reason: the scene is not visible. It must not
 * be stopped for any other — in particular not for reduced motion, which is
 * what it used to do. A stopped loop is not a calmer sky, it is a dead one, and
 * it silently kills the pointer parallax too, because the handler goes on
 * updating a view offset that nothing will ever draw again. Motion preferences
 * are honoured by scaling the values in COSMOS.reducedMotion, never by ceasing
 * to render.
 */

const TAU = Math.PI * 2;

type Rand = () => number;

function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rand: Rand, list: readonly T[]): T =>
  list[Math.floor(rand() * list.length)] as T;

const span = (rand: Rand, r: readonly [number, number]) =>
  r[0] + rand() * (r[1] - r[0]);

/** 0-1 alpha as the two hex digits a #rrggbbaa colour needs. */
const toHexAlpha = (a: number) =>
  Math.max(0, Math.min(255, Math.round(a * 255)))
    .toString(16)
    .padStart(2, "0");

/**
 * The furthest a layer with this parallax can ever be pushed from its resting
 * place: full pointer deflection plus the idle wander riding on top of it.
 * Used to size the offscreen canvases, so no shift can pull a bare edge in.
 */
const maxTravel = (parallax: number) =>
  parallax * COSMOS.mouse.drift * (1 + COSMOS.mouse.idle.amplitude);

interface Twinkler {
  x: number;
  y: number;
  r: number;
  a: number;
  phase: number;
  speed: number;
  tint: string;
}

interface Streak {
  angle: number;
  speed: number;
  length: number;
  tint: string;
}

interface Meteor {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  t: number;
}

interface Ripple {
  x: number;
  y: number;
  t: number;
  sparks: { angle: number; speed: number }[];
}

export function Cosmos({
  visible,
  bang,
}: {
  /** Drives the loop. When false the canvas stops rendering entirely. */
  visible: boolean;
  /** Increment to fire the big bang. */
  bang: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{
    start: () => void;
    stop: () => void;
    fire: () => void;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /**
     * Whether to damp the scene for reduced motion. This does NOT stop the
     * render loop — see COSMOS.reducedMotion for why that was exactly the wrong
     * thing to do — it only scales the values below.
     */
    const RM = COSMOS.reducedMotion;
    const reduced =
      RM.respect &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Pointer parallax strength actually in use. */
    const DRIFT = COSMOS.mouse.drift * (reduced ? RM.driftScale : 1);
    /** Idle wander actually in use. */
    const IDLE_AMP = reduced
      ? RM.idleAmplitude
      : COSMOS.mouse.idle.amplitude;
    const TWINKLE_RATE = reduced ? RM.twinkleScale : 1;
    const METEORS_ON = reduced ? RM.meteors : true;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Weak/small devices get proportionally fewer stars.
    const scale =
      window.innerWidth < COSMOS.stars.mobileBreakpoint
        ? COSMOS.stars.mobileScale
        : 1;

    let nebula: HTMLCanvasElement | null = null;
    let layers: { canvas: HTMLCanvasElement; parallax: number }[] = [];
    let twinklers: Twinkler[] = [];

    /**
     * Paints the whole sky once: the galactic band, its dust lanes, a little
     * deep nebula colour, then the star layers on top. Re-run only on resize.
     *
     * Everything here is offscreen work — the frame loop never repeats any of
     * it, which is what allows this many stars.
     */
    const build = () => {
      const rand = mulberry32(0xc05f05);
      const big = Math.max(width, height);
      const small = Math.min(width, height);
      const B = COSMOS.band;

      // The band's axis: a line through the frame at `angleDeg`, nudged off
      // centre by `offset`. Stars and dust are both placed against it.
      const angle = (B.angleDeg * Math.PI) / 180;
      const axis = {
        x: width / 2,
        y: height / 2 + B.offset * height,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        len: big * B.length,
        thick: small * B.thickness,
      };

      /** A point on the band: `t` along it, `off` perpendicular. */
      const onBand = (t: number, off: number) => ({
        x: axis.x + axis.dx * (t - 0.5) * axis.len - axis.dy * off,
        y: axis.y + axis.dy * (t - 0.5) * axis.len + axis.dx * off,
      });

      /** Roughly gaussian in [-1,1] — clusters values near the axis. */
      const bell = () => (rand() + rand() + rand()) / 1.5 - 1;

      // ── The sky canvas ──────────────────────────────────────────────────
      const nres = COSMOS.nebula.resolution;
      const nw = Math.max(2, Math.floor(width * nres));
      const nh = Math.max(2, Math.floor(height * nres));
      const nc = document.createElement("canvas");
      nc.width = nw;
      nc.height = nh;
      const nctx = nc.getContext("2d");

      if (nctx) {
        nctx.fillStyle = COSMOS.base;
        nctx.fillRect(0, 0, nw, nh);
        nctx.globalCompositeOperation = "lighter";

        // Deep colour clouds — restrained, just depth behind the stars.
        for (let i = 0; i < COSMOS.nebula.blobs; i++) {
          const cx = rand() * nw;
          const cy = rand() * nh;
          const r = span(rand, COSMOS.nebula.blobRadius) * big * nres;
          const tint = pick(rand, COSMOS.nebula.colors);
          const g = nctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `${tint}59`);
          g.addColorStop(0.5, `${tint}1f`);
          g.addColorStop(1, `${tint}00`);
          nctx.fillStyle = g;
          nctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }

        // The band itself: an elongated glow along the axis, warm at the core.
        nctx.save();
        nctx.translate(axis.x * nres, axis.y * nres);
        nctx.rotate(angle);
        nctx.scale(1, (axis.thick / axis.len) * 2.1);
        const bandR = axis.len * nres * 0.5;
        const bg = nctx.createRadialGradient(0, 0, 0, 0, 0, bandR);
        bg.addColorStop(0, `${B.warm}${toHexAlpha(B.alpha)}`);
        bg.addColorStop(0.34, `${B.mid}${toHexAlpha(B.alpha * 0.5)}`);
        bg.addColorStop(0.7, `${B.cool}${toHexAlpha(B.alpha * 0.24)}`);
        bg.addColorStop(1, `${B.cool}00`);
        nctx.fillStyle = bg;
        nctx.fillRect(-bandR, -bandR, bandR * 2, bandR * 2);
        nctx.restore();

        // The galactic core: a concentrated warm bloom on the band.
        const core = onBand(B.coreAt, 0);
        const cr = axis.thick * 0.85 * nres;
        const cg = nctx.createRadialGradient(
          core.x * nres, core.y * nres, 0,
          core.x * nres, core.y * nres, cr,
        );
        cg.addColorStop(0, `${B.warm}${toHexAlpha(B.coreGlow * 0.8)}`);
        cg.addColorStop(0.4, `${B.warm}${toHexAlpha(B.coreGlow * 0.28)}`);
        cg.addColorStop(1, `${B.warm}00`);
        nctx.fillStyle = cg;
        nctx.fillRect(core.x * nres - cr, core.y * nres - cr, cr * 2, cr * 2);

        // Dust lanes — dark streaks along the band. These are what break the
        // glow into texture; without them it reads as a smooth gradient.
        nctx.globalCompositeOperation = "source-over";
        for (let i = 0; i < B.dustLanes; i++) {
          const t = rand();
          const off = bell() * axis.thick * 0.5;
          const p = onBand(t, off);
          const laneLen = axis.len * span(rand, [0.08, 0.3]);
          const laneW = axis.thick * span(rand, [0.04, 0.16]);
          nctx.save();
          nctx.translate(p.x * nres, p.y * nres);
          nctx.rotate(angle + (rand() - 0.5) * 0.24);
          nctx.scale(1, (laneW / laneLen) * 2);
          const lr = laneLen * nres * 0.5;
          const lg = nctx.createRadialGradient(0, 0, 0, 0, 0, lr);
          const la = B.dustAlpha * (0.5 + rand() * 0.5);
          lg.addColorStop(0, `rgba(4,4,12,${la})`);
          lg.addColorStop(0.6, `rgba(4,4,12,${la * 0.45})`);
          lg.addColorStop(1, "rgba(4,4,12,0)");
          nctx.fillStyle = lg;
          nctx.fillRect(-lr, -lr, lr * 2, lr * 2);
          nctx.restore();
        }

        // Calm the middle so the narration always has something to sit on.
        const v = nctx.createRadialGradient(
          nw / 2, nh / 2, 0,
          nw / 2, nh / 2, Math.max(nw, nh) * 0.6,
        );
        v.addColorStop(0, `rgba(3,3,10,${COSMOS.nebula.readabilityVignette})`);
        v.addColorStop(1, "rgba(3,3,10,0)");
        nctx.fillStyle = v;
        nctx.fillRect(0, 0, nw, nh);
      }
      nebula = nc;

      // ── Star layers ─────────────────────────────────────────────────────
      // Each layer is painted onto a canvas larger than the screen by exactly
      // as far as it can ever travel, so sliding it never drags an empty edge
      // into view. `maxTravel` must therefore account for BOTH the pointer's
      // full deflection and the idle wander stacked on top of it.
      layers = COSMOS.stars.layers.map((layer, li) => {
        const margin = maxTravel(layer.parallax) + 4;
        const lw = Math.ceil(width + margin * 2);
        const lh = Math.ceil(height + margin * 2);
        const lc = document.createElement("canvas");
        lc.width = lw;
        lc.height = lh;
        const lctx = lc.getContext("2d");

        if (lctx) {
          const count = Math.round(layer.count * scale);
          for (let i = 0; i < count; i++) {
            let x: number;
            let y: number;
            // A share of every layer hugs the band; the rest fills the sky.
            if (rand() < layer.bandBias) {
              const p = onBand(rand(), bell() * axis.thick);
              x = p.x + margin;
              y = p.y + margin;
            } else {
              x = rand() * lw;
              y = rand() * lh;
            }
            const r = span(rand, layer.size);
            lctx.globalAlpha = span(rand, layer.alpha);
            lctx.fillStyle = pick(rand, COSMOS.stars.tints);
            lctx.beginPath();
            lctx.arc(x, y, r, 0, Math.PI * 2);
            lctx.fill();
          }

          // Knots of stars along the band, so the density is uneven the way a
          // real sky is rather than evenly sprayed.
          if (li < 2) {
            const clusters = Math.round(COSMOS.stars.clusters * scale);
            for (let c = 0; c < clusters; c++) {
              const at = onBand(rand(), bell() * axis.thick * 0.8);
              const cr = span(rand, COSMOS.stars.clusterRadius);
              const n = Math.round(span(rand, COSMOS.stars.clusterStars) * scale);
              for (let k = 0; k < n; k++) {
                const a = rand() * Math.PI * 2;
                const d = Math.sqrt(rand()) * cr;
                lctx.globalAlpha = span(rand, [0.2, 0.7]);
                lctx.fillStyle = pick(rand, COSMOS.stars.tints);
                lctx.beginPath();
                lctx.arc(
                  at.x + margin + Math.cos(a) * d,
                  at.y + margin + Math.sin(a) * d,
                  span(rand, [0.25, 0.7]),
                  0,
                  Math.PI * 2,
                );
                lctx.fill();
              }
            }
          }
          lctx.globalAlpha = 1;
        }
        return { canvas: lc, parallax: layer.parallax };
      });

      // ── Twinklers ───────────────────────────────────────────────────────
      // These are the nearest things in the scene and so travel furthest. They
      // are drawn live in screen space rather than off a canvas, so they get
      // their margin by being SCATTERED past the edges instead — otherwise a
      // hard band of empty sky follows the pointer in from whichever side.
      const tm = maxTravel(COSMOS.mouse.twinkle);
      const tc = Math.round(COSMOS.stars.twinklers * scale);
      twinklers = Array.from({ length: tc }, () => {
        const near = rand() < 0.6;
        const p = near ? onBand(rand(), bell() * axis.thick) : null;
        return {
          x: p ? p.x : -tm + rand() * (width + tm * 2),
          y: p ? p.y : -tm + rand() * (height + tm * 2),
          r: span(rand, [0.7, 1.9]),
          a: span(rand, [0.5, 1]),
          phase: rand() * Math.PI * 2,
          speed: span(rand, COSMOS.stars.twinkleSpeed),
          tint: pick(rand, COSMOS.stars.tints),
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();

    // ── Interaction state ───────────────────────────────────────────────────
    let pointerX = 0;
    let pointerY = 0;
    let viewX = 0;
    let viewY = 0;
    /** Seconds since the scene started, driving the idle wander. */
    let clock = 0;

    let bangT = -1;
    let streaks: Streak[] = [];
    let ripples: Ripple[] = [];
    let meteors: Meteor[] = [];
    let nextMeteor = COSMOS.meteors.everyMs[0];
    let nebulaBoost = 0;

    const seedRand = mulberry32(0x1337);

    const fire = () => {
      bangT = 0;
      nebulaBoost = COSMOS.bang.nebulaFlash;
      streaks = Array.from({ length: Math.round(COSMOS.bang.streaks * scale) }, () => ({
        angle: seedRand() * Math.PI * 2,
        speed: span(seedRand, COSMOS.bang.streakSpeed),
        length: span(seedRand, COSMOS.bang.streakLength),
        tint: pick(seedRand, COSMOS.stars.tints),
      }));
    };

    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / width) * 2 - 1;
      pointerY = (e.clientY / height) * 2 - 1;
    };

    const onDown = (e: PointerEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        t: 0,
        sparks: Array.from({ length: COSMOS.mouse.click.sparks }, () => ({
          angle: seedRand() * Math.PI * 2,
          speed: span(seedRand, COSMOS.mouse.click.sparkSpeed),
        })),
      });
      nebulaBoost = Math.max(nebulaBoost, COSMOS.mouse.click.nebulaPulse);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    // ── Frame ───────────────────────────────────────────────────────────────
    const draw = (dt: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const half = Math.hypot(cx, cy);

      // Ease the view toward the pointer — this is the look-around. The lower
      // `easing` is, the more the view coasts after the cursor stops.
      const k = Math.min(1, dt * COSMOS.mouse.easing);
      viewX += (pointerX - viewX) * k;
      viewY += (pointerY - viewY) * k;

      // ...and a slow wander on top, so the sky keeps breathing when the mouse
      // is still. The two axes run at mismatched speeds, so the pair never
      // settles into a loop the eye can pick out.
      clock += dt;
      const I = COSMOS.mouse.idle;
      const vx = viewX + Math.sin(clock * I.xSpeed * TAU) * IDLE_AMP;
      const vy = viewY + Math.sin(clock * I.ySpeed * TAU + 1.7) * IDLE_AMP;

      ctx.clearRect(0, 0, width, height);

      // Nebula and band. The furthest thing away, so it moves the LEAST — less
      // even than the far stars. Give it more and the depth collapses: the sky
      // reads as one flat sheet sliding around behind the stars.
      if (nebula) {
        const nOff = maxTravel(COSMOS.mouse.sky);
        // maxTravel sizes for the FULL configured drift, so the oversized draw
        // still covers the frame when the effective drift is smaller.
        ctx.globalAlpha = Math.min(1, 1 + nebulaBoost);
        ctx.drawImage(
          nebula,
          -vx * nOff - nOff,
          -vy * nOff - nOff,
          width + nOff * 2,
          height + nOff * 2,
        );
        ctx.globalAlpha = 1;
      }
      nebulaBoost = Math.max(0, nebulaBoost - dt * 1.4);

      // Star layers: one drawImage each, offset by depth. This is where the 3D
      // comes from — three canvases sliding across each other at three speeds.
      for (const layer of layers) {
        const p = layer.parallax * DRIFT;
        const m = maxTravel(layer.parallax) + 4;
        ctx.drawImage(layer.canvas, -m - vx * p, -m - vy * p);
      }

      // The few stars that actually pulse — nearest of all, so furthest moved.
      const tp = COSMOS.mouse.twinkle * DRIFT;
      for (const t of twinklers) {
        t.phase += t.speed * dt * TWINKLE_RATE;
        const a = t.a * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t.phase)));
        ctx.globalAlpha = a;
        ctx.fillStyle = t.tint;
        ctx.beginPath();
        ctx.arc(t.x - vx * tp, t.y - vy * tp, t.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── The bang ──────────────────────────────────────────────────────────
      if (bangT >= 0) {
        bangT += dt * 1000;
        const B = COSMOS.bang;

        // Core flash.
        if (bangT < B.coreMs) {
          const t = bangT / B.coreMs;
          const r = half * (0.15 + t * 1.5);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          const a = (1 - t) ** 1.6;
          g.addColorStop(0, `rgba(255,255,255,${a})`);
          g.addColorStop(0.28, `rgba(255,243,214,${a * 0.75})`);
          g.addColorStop(0.6, `rgba(190,140,255,${a * 0.3})`);
          g.addColorStop(1, "rgba(120,60,220,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);
        }

        // Shock rings.
        for (let i = 0; i < B.rings; i++) {
          const rt = (bangT - i * B.ringGapMs) / B.shockMs;
          if (rt <= 0 || rt >= 1) continue;
          const eased = 1 - (1 - rt) ** 3;
          const r = eased * half * B.reach;
          ctx.globalAlpha = (1 - rt) ** 1.5 * 0.7;
          ctx.strokeStyle = i === 0 ? "#fff6e0" : "#c9a6ff";
          ctx.lineWidth = Math.max(0.6, 7 * (1 - rt));
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Streaking particles.
        if (bangT < B.streakMs) {
          const t = bangT / B.streakMs;
          const fade = (1 - t) ** 1.4;
          ctx.lineCap = "round";
          for (const s of streaks) {
            const d = s.speed * (bangT / 1000) * (1 - t * 0.35);
            const x = cx + Math.cos(s.angle) * d;
            const y = cy + Math.sin(s.angle) * d;
            const len = s.length * (0.4 + fade);
            ctx.globalAlpha = fade;
            ctx.strokeStyle = s.tint;
            ctx.lineWidth = 1.6 * fade + 0.4;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - Math.cos(s.angle) * len, y - Math.sin(s.angle) * len);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        if (bangT > Math.max(B.shockMs + B.rings * B.ringGapMs, B.streakMs)) {
          bangT = -1;
          streaks = [];
        }
      }

      // ── Meteors ───────────────────────────────────────────────────────────
      const M = COSMOS.meteors;
      if (METEORS_ON) nextMeteor -= dt * 1000;
      if (METEORS_ON && nextMeteor <= 0) {
        nextMeteor = span(seedRand, M.everyMs);
        const deg = span(seedRand, M.angleDeg);
        const a = (deg * Math.PI) / 180;
        meteors.push({
          // Enter from the top or the left edge, heading down-right.
          x: seedRand() * width * 1.1 - width * 0.15,
          y: -40 - seedRand() * height * 0.2,
          angle: a,
          speed: span(seedRand, M.speed),
          length: span(seedRand, M.length),
          t: 0,
        });
      }
      meteors = meteors.filter((m) => {
        m.t += dt * 1000;
        const life = m.t / M.lifeMs;
        if (life >= 1) return false;
        const d = m.speed * (m.t / 1000);
        const hx = m.x + Math.cos(m.angle) * d;
        const hy = m.y + Math.sin(m.angle) * d;
        if (hx > width + 200 || hy > height + 200) return false;

        // Fade in fast, out slowly — the classic meteor profile.
        const fade = life < 0.15 ? life / 0.15 : (1 - life) ** 1.3;
        const tx = hx - Math.cos(m.angle) * m.length;
        const ty = hy - Math.sin(m.angle) * m.length;
        const g = ctx.createLinearGradient(hx, hy, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
        g.addColorStop(0.35, `rgba(210,225,255,${0.4 * fade})`);
        g.addColorStop(1, "rgba(180,200,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.globalAlpha = fade;
        ctx.fillStyle = M.tint;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      // ── Click ripples ─────────────────────────────────────────────────────
      const C = COSMOS.mouse.click;
      ripples = ripples.filter((rip) => {
        rip.t += dt * 1000;
        const t = rip.t / C.rippleMs;
        if (t >= 1) return false;

        const eased = 1 - (1 - t) ** 3;
        ctx.globalAlpha = (1 - t) ** 1.6 * 0.8;
        ctx.strokeStyle = "#dcc8ff";
        ctx.lineWidth = Math.max(0.5, 3 * (1 - t));
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, eased * C.rippleRadius, 0, Math.PI * 2);
        ctx.stroke();

        const st = rip.t / C.sparkMs;
        if (st < 1) {
          const fade = (1 - st) ** 1.5;
          ctx.globalAlpha = fade;
          ctx.fillStyle = "#fff3d8";
          for (const sp of rip.sparks) {
            const d = sp.speed * (rip.t / 1000) * (1 - st * 0.4);
            ctx.beginPath();
            ctx.arc(
              rip.x + Math.cos(sp.angle) * d,
              rip.y + Math.sin(sp.angle) * d,
              1.5 * fade + 0.4,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        return true;
      });
    };

    let frame = 0;
    let last = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      draw(dt);
      frame = requestAnimationFrame(tick);
    };

    api.current = {
      // The loop runs whenever the scene is on screen, reduced motion or not.
      // Stopping it was what left the sky frozen and the pointer inert; motion
      // preferences are handled by scaling values, never by ceasing to draw.
      start: () => {
        if (running) return;
        running = true;
        last = 0;
        frame = requestAnimationFrame(tick);
      },
      stop: () => {
        if (!running) return;
        running = false;
        cancelAnimationFrame(frame);
      },
      fire,
    };

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      api.current = null;
    };
  }, []);

  useEffect(() => {
    if (visible) api.current?.start();
    else api.current?.stop();
  }, [visible]);

  useEffect(() => {
    if (bang > 0) api.current?.fire();
  }, [bang]);

  return <canvas ref={canvasRef} className="cosmos" aria-hidden="true" />;
}
