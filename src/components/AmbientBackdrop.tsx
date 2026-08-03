"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import { PARALLAX, ambientFor, type AmbientSpec } from "@/config/ambient";
import { mulberry32, pick, span } from "@/lib/random";

/**
 * The living background behind a section page.
 *
 * Layers moving at different speeds as the page scrolls, which is where the
 * depth comes from. Tuning is all in config/ambient.ts; this file only knows
 * how to draw and move things.
 *
 * ── THE FORGE'S SCENE ──────────────────────────────────────────────────────
 * The Forge sits on the city island, so its backdrop is that city seen from
 * the water late in the afternoon: sky, sun, sea, the skyline itself, ships
 * working in front of it, birds over the top, weather crossing all of it.
 *
 * The skyline is drawn from the map's OWN cityland artwork, pushed back into
 * the haze — so the hub and the island you clicked to reach it are
 * unmistakably the same place. Each element sits on its own parallax depth;
 * see DEPTH below.
 *
 * ── IT SITS BEHIND, ALWAYS ─────────────────────────────────────────────────
 * The whole backdrop is `pointer-events: none` and pinned below the content's
 * stacking level, so nothing here can intercept a click or paint over a word.
 * A scrim between the scene and the text keeps the copy legible.
 *
 * ── COST ───────────────────────────────────────────────────────────────────
 * A frame is a couple of gradient fills, a few dozen small shapes and a
 * handful of drawImage calls. Sprites decode once, and the skyline is tinted
 * once into an offscreen canvas rather than every frame. The two rear DOM
 * layers move by `transform` alone, so they are compositor work.
 */

/**
 * How far each thing travels with the scroll, as a multiple of the near-layer
 * parallax. Small numbers are far away. These ratios ARE the sense of depth —
 * raise them together to exaggerate it.
 */
const DEPTH = {
  sky: 0.06,
  sun: 0.1,
  city: 0.34,
  sea: 0.46,
  ships: 0.62,
  birds: 0.85,
  clouds: 1.1,
} as const;

type Scene = NonNullable<AmbientSpec["scene"]>;

interface Cloud {
  x: number;
  y: number;
  w: number;
  speed: number;
  alpha: number;
  seed: number;
}

interface Ship {
  x: number;
  /** Distance BELOW the waterline, in px. Not an absolute y — see the note
   *  where ships are drawn. */
  below: number;
  w: number;
  speed: number;
  alpha: number;
  bobPhase: number;
  bobSpeed: number;
  img: HTMLImageElement | null;
  flip: boolean;
}

interface Bird {
  /** Offset from the flock's leader. */
  dx: number;
  dy: number;
  size: number;
  phase: number;
  flap: number;
}

interface Glint {
  /** Fractions of the sea band, so it survives a resize. */
  fx: number;
  fy: number;
  r: number;
  alpha: number;
  twinkle: number;
  phase: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  twinkle: number;
  phase: number;
}

interface Flock {
  x: number;
  y: number;
  speed: number;
  birds: Bird[];
}

/** Swaps the trailing alpha of an `rgba(r, g, b, 1)` string from config. */
const at = (rgba: string, alpha: number) => rgba.replace(/[\d.]+\)$/, `${alpha})`);

export function AmbientBackdrop({
  sectionId,
  scrollRef,
}: {
  sectionId: string;
  /** The scrolling element the parallax reads from. */
  scrollRef: RefObject<HTMLElement | null>;
}) {
  const spec = ambientFor(sectionId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spec) return;
    const canvas = canvasRef.current;
    const scroller = scrollRef.current;
    if (!canvas || !scroller) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < PARALLAX.mobileBreakpoint;
    /** One multiplier for how far anything is allowed to move with the page. */
    const parallaxScale = reduced
      ? PARALLAX.reducedScale
      : mobile
        ? PARALLAX.mobileScale
        : 1;
    /** And one for how fast the scene animates on its own. */
    const motion = reduced ? 0.22 : 1;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let clock = 0;

    const rand = mulberry32(0x5eac17);
    const TAU = Math.PI * 2;
    const sc = spec.scene;

    let cityImg: HTMLImageElement | null = null;
    let cityLayer: HTMLCanvasElement | null = null;
    const shipImgs: HTMLImageElement[] = [];
    let stars: Star[] = [];
    let glints: Glint[] = [];
    let clouds: Cloud[] = [];
    let ships: Ship[] = [];
    let flocks: Flock[] = [];

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    /**
     * Tints the skyline into a silhouette, ONCE.
     *
     * `source-atop` is what makes this work: it keeps the fill inside the
     * artwork's own alpha, so the island darkens into the haze instead of
     * gaining a tinted rectangle around it.
     */
    const buildCity = (img: HTMLImageElement, s: Scene) => {
      const w = Math.max(1, Math.round(width * s.city.width));
      const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      if (!g) return null;
      g.drawImage(img, 0, 0, w, h);
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = `rgba(12, 18, 28, ${s.city.darken})`;
      g.fillRect(0, 0, w, h);
      g.fillStyle = s.city.tint;
      g.fillRect(0, 0, w, h);
      return c;
    };

    const populate = (s: Scene) => {
      stars = Array.from(
        { length: mobile ? s.stars.mobileCount : s.stars.count },
        () => ({
          x: rand() * width,
          y: span(rand, s.stars.band) * s.horizon * height,
          r: span(rand, s.stars.size),
          alpha: span(rand, s.stars.opacity),
          twinkle: span(rand, s.stars.twinkle),
          phase: rand() * TAU,
        }),
      );

      glints = Array.from(
        { length: mobile ? s.sea.glitter.mobileCount : s.sea.glitter.count },
        () => ({
          fx: rand(),
          // Squared, so they crowd toward the horizon the way real glitter does.
          fy: rand() * rand(),
          r: span(rand, s.sea.glitter.size),
          alpha: span(rand, s.sea.glitter.opacity),
          twinkle: span(rand, s.sea.glitter.twinkle),
          phase: rand() * TAU,
        }),
      );

      clouds = Array.from(
        { length: mobile ? s.clouds.mobileCount : s.clouds.count },
        () => ({
          x: rand() * width,
          y: span(rand, s.clouds.band) * height,
          w: span(rand, s.clouds.size) * width,
          speed: span(rand, s.clouds.speed),
          alpha: span(rand, s.clouds.opacity),
          seed: rand() * 1000,
        }),
      );

      const horizonY = s.horizon * height;
      ships = Array.from(
        { length: mobile ? s.ships.mobileCount : s.ships.count },
        () => {
          const leftward = rand() < 0.45;
          return {
            x: rand() * width,
            below: span(rand, s.ships.band) * height,
            w: span(rand, s.ships.size) * width,
            speed: span(rand, s.ships.speed) * (leftward ? -1 : 1),
            alpha: span(rand, s.ships.opacity),
            bobPhase: rand() * TAU,
            bobSpeed: 1 / span(rand, s.ships.bobS),
            img: shipImgs.length ? pick(rand, shipImgs) : null,
            // Sprites are drawn bow-right, so a westward ship is mirrored.
            flip: leftward,
          };
        },
      );

      flocks = Array.from(
        { length: mobile ? s.birds.mobileFlocks : s.birds.flocks },
        () => {
          const n = Math.round(span(rand, s.birds.perFlock));
          return {
            x: rand() * width * 1.4 - width * 0.2,
            y: span(rand, s.birds.band) * horizonY,
            speed: span(rand, s.birds.speed) * (rand() < 0.5 ? -1 : 1),
            // A ragged trailing V, not a neat one.
            birds: Array.from({ length: n }, (_, i) => ({
              dx: -i * span(rand, [10, 22]),
              dy: (i % 2 === 0 ? 1 : -1) * i * span(rand, [4, 9]),
              size: span(rand, s.birds.size),
              phase: rand() * TAU,
              flap: span(rand, s.birds.flap),
            })),
          };
        },
      );
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
      if (sc) {
        populate(sc);
        // Sized off the viewport, so it is rebuilt whenever that changes.
        if (cityImg) cityLayer = buildCity(cityImg, sc);
      }
    };
    resize();

    // Sprites arrive after the first paint; re-populate once they have.
    void (async () => {
      if (!sc) return;
      cityImg = await loadImage(sc.city.src);
      const loaded = await Promise.all(sc.ships.srcs.map(loadImage));
      for (const i of loaded) if (i) shipImgs.push(i);
      resize();
    })();

    // ── Parallax inputs ─────────────────────────────────────────────────────
    let scrollY = scroller.scrollTop;
    let pointerX = 0;
    let pointerY = 0;
    let viewX = 0;
    let viewY = 0;

    const onScroll = () => {
      scrollY = scroller.scrollTop;
    };
    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / width) * 2 - 1;
      pointerY = (e.clientY / height) * 2 - 1;
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    let last = 0;
    let frame = 0;

    /** Where a layer at this depth has been pushed to. */
    const shiftY = (depth: number) =>
      -scrollY * PARALLAX.near * parallaxScale * depth +
      viewY * PARALLAX.mouse * parallaxScale * depth;
    const shiftX = (depth: number) =>
      viewX * PARALLAX.mouse * parallaxScale * depth;

    /**
     * The height of the water surface at horizontal `x`, `f` of the way from
     * the horizon (0) to the bottom of the screen (1).
     *
     * TWO waves at unrelated wavelengths travelling in OPPOSITE directions.
     * One sine is a corrugated roof; crossing two is what gives a crest that
     * builds and flattens as it travels, which is what the eye reads as swell.
     *
     * Both amplitude and wavelength shrink toward the horizon by the same
     * perspective power, so distant water is finer AND flatter — foreshortening
     * only one of them makes the sea look like a tilted wall.
     */
    const swellAt = (x: number, f: number) => {
      if (!sc) return 0;
      const wv = sc.sea.waves;
      const k = Math.pow(Math.max(f, 0.02), wv.perspective);
      const amp = wv.amplitude * k;
      const len = wv.wavelength * Math.pow(Math.max(f, 0.02), wv.perspective * 0.55) + 26;
      const t = clock * wv.speed * TAU;
      return (
        Math.sin(x / len + t) * amp +
        Math.sin(x / (len * 0.47) - t * 1.37) * amp * 0.42
      );
    };

    /** One gull: two swept wings whose angle is the wingbeat. */
    const drawBird = (x: number, y: number, size: number, beat: number) => {
      const lift = Math.sin(beat) * 0.55;
      const rise = size * 0.42 + lift * size * 0.3;
      ctx.beginPath();
      ctx.moveTo(x - size, y + lift * size * 0.5);
      ctx.quadraticCurveTo(x - size * 0.45, y - rise, x, y);
      ctx.quadraticCurveTo(x + size * 0.45, y - rise, x + size, y + lift * size * 0.5);
      ctx.stroke();
    };

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      clock += dt;

      // Ease the pointer drift so it glides rather than snapping.
      const k = Math.min(1, dt * PARALLAX.easing);
      viewX += (pointerX - viewX) * k;
      viewY += (pointerY - viewY) * k;

      const mouse = PARALLAX.mouse * parallaxScale;

      // The two rear DOM layers: pure transform, no repaint.
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(${viewX * mouse * 0.3}px, ${
          -scrollY * PARALLAX.far * parallaxScale + viewY * mouse * 0.3
        }px, 0)`;
      }
      if (midRef.current) {
        midRef.current.style.transform = `translate3d(${viewX * mouse * 0.62}px, ${
          -scrollY * PARALLAX.mid * parallaxScale + viewY * mouse * 0.62
        }px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);
      if (!sc) {
        frame = requestAnimationFrame(draw);
        return;
      }

      const horizonY = sc.horizon * height + shiftY(DEPTH.sea);

      // ── Sky ───────────────────────────────────────────────────────────────
      const sky = ctx.createLinearGradient(
        0,
        shiftY(DEPTH.sky) - height * 0.1,
        0,
        horizonY,
      );
      sky.addColorStop(0, sc.sky[0]);
      sky.addColorStop(0.62, sc.sky[1]);
      sky.addColorStop(1, sc.sky[2]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, Math.max(0, horizonY));

      // ── Stars ─────────────────────────────────────────────────────────────
      // Drawn on the sky's own depth, so they sit furthest back of anything.
      {
        const sy0 = shiftY(DEPTH.sky);
        const sx0 = shiftX(DEPTH.sky);
        ctx.fillStyle = at(sc.stars.color, 1);
        for (const st of stars) {
          st.phase += st.twinkle * dt * TAU * motion;
          const y = st.y + sy0;
          if (y > horizonY - 6 || y < -10) continue;
          ctx.globalAlpha = st.alpha * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(st.phase)));
          ctx.beginPath();
          ctx.arc(st.x + sx0, y, st.r, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // ── Sun ───────────────────────────────────────────────────────────────
      const sx = sc.sun.at[0] * width + shiftX(DEPTH.sun);
      const sy = sc.sun.at[1] * height + shiftY(DEPTH.sun);
      const sr = Math.min(width, height) * sc.sun.radius;
      ctx.globalCompositeOperation = "lighter";
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      sg.addColorStop(0, at(sc.sun.color, 0.8 * sc.sun.intensity));
      sg.addColorStop(0.28, at(sc.sun.glow, 0.3 * sc.sun.intensity));
      sg.addColorStop(1, at(sc.sun.glow, 0));
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      // ── Clouds ────────────────────────────────────────────────────────────
      const cloudY = shiftY(DEPTH.clouds);
      const cloudX = shiftX(DEPTH.clouds);
      for (const c of clouds) {
        c.x += c.speed * dt * motion;
        if (c.x - c.w > width) c.x = -c.w;
        const cy = c.y + cloudY;
        if (cy < -height * 0.4 || cy > height * 1.3) continue;
        const cx = c.x + cloudX;
        // Three overlapping puffs, so it is lumpy rather than an ellipse.
        for (let i = 0; i < 3; i++) {
          const ox = (i - 1) * c.w * 0.26;
          const oy = Math.sin(c.seed + i) * c.w * 0.03;
          const r = c.w * (i === 1 ? 0.34 : 0.24);
          const g = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, r);
          g.addColorStop(0, at(sc.clouds.color, c.alpha));
          g.addColorStop(1, at(sc.clouds.color, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx + ox, cy + oy, r, 0, TAU);
          ctx.fill();
        }
      }

      // ── The skyline ───────────────────────────────────────────────────────
      if (cityLayer) {
        const cw = cityLayer.width;
        const ch = cityLayer.height;
        const drift = Math.sin(clock * sc.city.driftSpeed * TAU) * sc.city.drift;
        const cx = (width - cw) / 2 + drift + shiftX(DEPTH.city);
        const cy = horizonY + sc.city.sink * height - ch;

        // Lamplight spilling out of it, painted BEFORE the artwork so the city
        // sits inside its own glow rather than under a wash.
        const cg = sc.cityGlow;
        const gr = Math.min(width, height) * cg.radius;
        const gx = cx + cw / 2;
        const gy = horizonY - gr * 0.16;
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, at(cg.color, 0.5 * cg.intensity));
        g.addColorStop(0.45, at(cg.color, 0.16 * cg.intensity));
        g.addColorStop(1, at(cg.color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = sc.city.opacity;
        ctx.drawImage(cityLayer, cx, cy, cw, ch);
        ctx.globalAlpha = 1;
      }

      // ── Sea ───────────────────────────────────────────────────────────────
      if (horizonY < height) {
        const deep = height - horizonY;
        const sea = ctx.createLinearGradient(0, horizonY, 0, height);
        // Three stops: the far water catches the sky, the near water is deep.
        sea.addColorStop(0, sc.sea.far);
        sea.addColorStop(0.34, sc.sea.mid);
        sea.addColorStop(1, sc.sea.near);
        ctx.fillStyle = sea;
        ctx.fillRect(0, horizonY, width, deep);

        ctx.globalCompositeOperation = "lighter";

        // The city's lamplight, smeared straight down the water beneath it and
        // wavering — a reflection is never a clean copy.
        const rf = sc.sea.reflection;
        if (rf.opacity > 0) {
          const rx = width / 2 + Math.sin(clock * rf.waverSpeed * TAU) * rf.waver;
          const rw = width * rf.width;
          const rg = ctx.createLinearGradient(0, horizonY, 0, horizonY + deep * 0.75);
          rg.addColorStop(0, at(rf.color, rf.opacity));
          rg.addColorStop(0.4, at(rf.color, rf.opacity * 0.42));
          rg.addColorStop(1, at(rf.color, 0));
          ctx.fillStyle = rg;
          // Widening downward, the way a reflection spreads with distance.
          ctx.beginPath();
          ctx.moveTo(rx - rw * 0.32, horizonY);
          ctx.lineTo(rx + rw * 0.32, horizonY);
          ctx.lineTo(rx + rw, horizonY + deep * 0.8);
          ctx.lineTo(rx - rw, horizonY + deep * 0.8);
          ctx.closePath();
          ctx.fill();
        }

        // The specular path under the sun.
        const bands = sc.sea.shimmerBands;
        const rowH = Math.max(1, (deep / bands) * 0.5);
        for (let i = 0; i < bands; i++) {
          const f = i / bands;
          const by = horizonY + Math.pow(f, 1.7) * deep;
          const wob =
            Math.sin(clock * sc.sea.shimmerSpeed * TAU + i * 0.9) * width * 0.06;
          const bw = width * (0.16 + f * 0.5);
          const a = sc.sea.shimmerOpacity * (1 - f) * 0.9;
          const g = ctx.createLinearGradient(sx - bw + wob, 0, sx + bw + wob, 0);
          g.addColorStop(0, at(sc.sea.shimmerColor, 0));
          g.addColorStop(0.5, at(sc.sea.shimmerColor, a));
          g.addColorStop(1, at(sc.sea.shimmerColor, 0));
          ctx.fillStyle = g;
          ctx.fillRect(sx - bw + wob, by, bw * 2, rowH);
        }

        // Glitter on the surface.
        const gl = sc.sea.glitter;
        ctx.fillStyle = at(gl.color, 1);
        for (const g of glints) {
          g.phase += g.twinkle * dt * TAU * motion;
          const gy = horizonY + g.fy * deep;
          const gx = g.fx * width;
          ctx.globalAlpha =
            g.alpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(g.phase)));
          // Drawn as a short dash, not a dot — light on water is horizontal.
          ctx.fillRect(gx - g.r * 1.8, gy, g.r * 3.6, g.r * 0.85);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";

        // ── Swell ───────────────────────────────────────────────────────────
        // Each band is FILLED from its curved top edge down to the bottom of
        // the screen, at low alpha. Stacking them deepens the near water on its
        // own — no second gradient needed — and every edge is a curve, so what
        // you see is layered rolling water rather than lines on a flat pool.
        const wv = sc.sea.waves;
        const bandCount = mobile ? wv.mobileCount : wv.count;
        const step = Math.max(8, Math.round(width / 90));

        for (let i = 0; i < bandCount; i++) {
          // Packed toward the horizon, matching the sea's own foreshortening.
          const f = Math.pow((i + 1) / bandCount, 1.75);
          const baseY = horizonY + f * deep;

          ctx.beginPath();
          ctx.moveTo(0, baseY + swellAt(0, f));
          for (let x = step; x <= width; x += step) {
            ctx.lineTo(x, baseY + swellAt(x, f));
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = at(wv.color, wv.opacity);
          ctx.fill();

          // Daylight catching the crest. Brightest on the near bands, where a
          // real wave actually breaks white.
          ctx.beginPath();
          ctx.moveTo(0, baseY + swellAt(0, f));
          for (let x = step; x <= width; x += step) {
            ctx.lineTo(x, baseY + swellAt(x, f));
          }
          ctx.strokeStyle = at(wv.foam, wv.foamOpacity * (0.25 + f * 0.75));
          ctx.lineWidth = 0.8 + f * 1.4;
          ctx.stroke();
        }
      }

      // ── Mist at the waterline ─────────────────────────────────────────────
      // Painted OVER the sea's top edge, which is what dissolves the hard cut
      // between water and world into a horizon.
      {
        const mi = sc.sea.mist;
        const mh = Math.min(width, height) * mi.height;
        const mg = ctx.createLinearGradient(0, horizonY - mh, 0, horizonY + mh * 0.7);
        mg.addColorStop(0, at(mi.color, 0));
        mg.addColorStop(0.55, at(mi.color, mi.opacity));
        mg.addColorStop(1, at(mi.color, 0));
        ctx.fillStyle = mg;
        ctx.fillRect(0, horizonY - mh, width, mh * 1.7);
      }

      // ── Ships ─────────────────────────────────────────────────────────────
      /*
       * Anchored to the WATERLINE, not to the page.
       *
       * They used to carry their own parallax depth while the horizon carried
       * the sea's — a slower one — so scrolling slid the fleet upward off the
       * water and eventually over the city. A ship floats on the sea, so it
       * travels with the sea, and only its horizontal drift and bob are its
       * own. The clamp below is the backstop.
       */
      const shipX = shiftX(DEPTH.ships);
      for (const s of ships) {
        s.x += s.speed * dt * motion;
        if (s.speed > 0 && s.x > width) s.x = -s.w * 1.5;
        if (s.speed < 0 && s.x + s.w < 0) s.x = width + s.w * 0.5;
        if (!s.img) continue;
        const h = (s.img.naturalHeight / s.img.naturalWidth) * s.w;
        const bob = Math.sin(clock * s.bobSpeed * TAU + s.bobPhase) * sc.ships.bob;
        // The waterline this ship sits on — the SAME swell the sea is drawn
        // from, sampled under the hull, so the ship rides the actual waves
        // rather than bobbing to its own unrelated rhythm on a flat plane.
        const f = Math.max(0.02, Math.min(1, s.below / Math.max(1, height - horizonY)));
        const water = horizonY + s.below + bob + swellAt(s.x + shipX + s.w / 2, f);
        // Never above the horizon, whatever the bob or the rounding do.
        const y = Math.max(horizonY, water) - h;
        if (y > height || y + h < 0) continue;
        ctx.globalAlpha = s.alpha;
        if (s.flip) {
          ctx.save();
          ctx.translate(s.x + shipX + s.w, y);
          ctx.scale(-1, 1);
          ctx.drawImage(s.img, 0, 0, s.w, h);
          ctx.restore();
        } else {
          ctx.drawImage(s.img, s.x + shipX, y, s.w, h);
        }
        ctx.globalAlpha = 1;
      }

      // ── Birds ─────────────────────────────────────────────────────────────
      const bd = sc.birds;
      ctx.strokeStyle = at(bd.color, bd.opacity);
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      const birdY = shiftY(DEPTH.birds);
      const birdX = shiftX(DEPTH.birds);
      for (const f of flocks) {
        f.x += f.speed * dt * motion;
        if (f.speed > 0 && f.x > width + 200) {
          f.x = -200;
          f.y = span(rand, bd.band) * sc.horizon * height;
        }
        if (f.speed < 0 && f.x < -200) {
          f.x = width + 200;
          f.y = span(rand, bd.band) * sc.horizon * height;
        }
        for (const b of f.birds) {
          b.phase += b.flap * dt * TAU * motion;
          const bx = f.x + (f.speed < 0 ? -b.dx : b.dx) + birdX;
          const by = f.y + b.dy + birdY;
          if (by < -40 || by > height + 40) continue;
          drawBird(bx, by, b.size, b.phase);
        }
      }

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [spec, scrollRef, sectionId]);

  if (!spec) return null;

  return (
    <div className="ambient" aria-hidden="true">
      <div
        ref={farRef}
        className="ambient-far"
        style={
          {
            "--amb-wash": spec.atmosphere.wash,
            "--amb-glow-at": spec.atmosphere.glowAt,
            "--amb-glow": spec.atmosphere.glow,
            "--amb-counter": spec.atmosphere.counterGlow,
          } as CSSProperties
        }
      />

      {/* The scene itself, between the two atmosphere layers. */}
      <canvas ref={canvasRef} className="ambient-particles" />

      <div
        ref={midRef}
        className="ambient-mid"
        style={
          {
            "--amb-haze": spec.haze.color,
            "--amb-haze-o": spec.haze.opacity,
            "--amb-haze-blur": `${spec.haze.blurPx}px`,
            "--amb-haze-dur": `${spec.haze.driftS}s`,
          } as CSSProperties
        }
      >
        <span className="ambient-wisp ambient-wisp-a" />
        <span className="ambient-wisp ambient-wisp-b" />
        <span className="ambient-wisp ambient-wisp-c" />
      </div>

      {/* Keeps the page readable over all of the above. */}
      <div className="ambient-scrim" />
    </div>
  );
}
