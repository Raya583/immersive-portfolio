"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { origins, type BeyondIcon } from "@/content/portfolio";
import { ORIGINS_SCENE } from "@/config/origins";
import { mulberry32, span, pick } from "@/lib/random";

/**
 * ORIGINS — the story, told on the forest island.
 *
 * Every word comes from `origins` in content/portfolio.ts. The page's job is
 * to give each section the SHAPE its content wants: prose reads as prose,
 * experience as a timeline, talents as cards.
 */

/**
 * The wood: fireflies blinking through drifting leaves, with the island behind
 * them — all sharing one pointer and one animation frame.
 *
 * ── ONE EFFECT OWNS THE LOT ────────────────────────────────────────────────
 * The island is a DOM element and the rest is a canvas. Eased separately they
 * drift fractionally out of step, which is exactly what breaks the sense of a
 * single space.
 *
 * ── WHY SPRITE + PATH ──────────────────────────────────────────────────────
 * Fireflies are soft radial glows, pre-rendered once and stamped with
 * drawImage — building that gradient per fly per frame would be ~38
 * `createRadialGradient` calls every 16ms. Leaves are drawn as paths because
 * each one tumbles to its own angle, which a sprite cannot do.
 */
function OriginsScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const island = islandRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const P = ORIGINS_SCENE.parallax;
    const isImage = ORIGINS_SCENE.backdrop.mode === "image";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    // Reduced motion slows the drift rather than freezing it — a still frame
    // of scattered dots reads as a broken canvas, not as calm.
    const motion = reduced ? 0.24 : 1;
    const depth = mobile ? P.mobileScale : reduced ? P.reducedScale : 1;
    const rand = mulberry32(0x0f0235);
    const TAU = Math.PI * 2;

    /** One soft warm disc, pre-rendered. */
    const glow = (() => {
      const R = 48;
      const c = document.createElement("canvas");
      c.width = c.height = R * 2;
      const g = c.getContext("2d");
      if (!g) return c;
      const grad = g.createRadialGradient(R, R, 0, R, R, R);
      grad.addColorStop(0, "rgba(255, 240, 190, 1)");
      grad.addColorStop(0.22, "rgba(233, 196, 106, 0.55)");
      grad.addColorStop(1, "rgba(233, 196, 106, 0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(R, R, R, 0, TAU);
      g.fill();
      return c;
    })();

    let width = 0;
    let height = 0;

    type Fly = {
      x: number; y: number; r: number; dx: number; dy: number;
      sway: number; swaySpeed: number; phase: number; alpha: number;
      blink: number; blinkSpeed: number;
    };
    type Leaf = {
      x: number; y: number; len: number; speed: number;
      sway: number; swaySpeed: number; phase: number;
      angle: number; spin: number; alpha: number; color: string;
    };
    let flies: Fly[] = [];
    let leaves: Leaf[] = [];

    const build = () => {
      const F = ORIGINS_SCENE.fireflies;
      const L = ORIGINS_SCENE.leaves;

      flies = Array.from({ length: mobile ? F.mobileCount : F.count }, () => ({
        x: rand() * width,
        y: rand() * height,
        r: span(rand, F.size),
        dx: span(rand, F.driftX),
        dy: span(rand, F.driftY),
        sway: span(rand, F.sway),
        swaySpeed: span(rand, F.swaySpeed),
        phase: rand() * TAU,
        alpha: span(rand, F.opacity),
        blink: rand() * TAU,
        blinkSpeed: span(rand, F.blinkSpeed),
      }));

      leaves = Array.from({ length: mobile ? L.mobileCount : L.count }, () => ({
        x: rand() * width,
        y: rand() * height,
        len: span(rand, L.size),
        speed: span(rand, L.speed),
        sway: span(rand, L.sway),
        swaySpeed: span(rand, L.swaySpeed),
        phase: rand() * TAU,
        angle: rand() * TAU,
        spin: span(rand, L.spin),
        alpha: span(rand, L.opacity),
        color: pick(rand, L.colors),
      }));
    };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    measure();
    window.addEventListener("resize", measure);

    // Pointer as -1..1 from centre; `cur` chases `target`.
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / width) * 2 - 1;
      targetY = (e.clientY / height) * 2 - 1;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    if (depth > 0) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }

    /**
     * A leaf: two arcs meeting at a point at each end, with a midrib. Drawn
     * facing right and rotated by the caller.
     */
    const drawLeaf = (len: number, color: string) => {
      const w = len * 0.44;
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);
      ctx.quadraticCurveTo(0, -w, len / 2, 0);
      ctx.quadraticCurveTo(0, w, -len / 2, 0);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      // The midrib, a shade darker via a translucent black hairline.
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);
      ctx.lineTo(len / 2, 0);
      ctx.strokeStyle = "rgba(20, 34, 24, 0.4)";
      ctx.lineWidth = Math.max(len * 0.045, 0.6);
      ctx.stroke();
    };

    let last = 0;
    let frame = 0;
    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      /*
       * Exponential smoothing, framerate-independent. A plain lerp eases
       * faster on a 120Hz screen than a 60Hz one; folding dt through exp()
       * makes the settle time the same wall-clock duration everywhere.
       */
      const k = 1 - Math.exp(-P.easing * dt);
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;

      /*
       * The cut-out is centred with `left: 50%`, so its transform must carry
       * the -50% that does the centring; the full-bleed image is positioned by
       * `inset` and must NOT, or it jumps half a screen to the left.
       */
      if (island) {
        const ix = -curX * P.island * depth;
        const iy = -curY * P.island * depth * 0.5;
        island.style.transform = isImage
          ? `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0)`
          : `translate3d(calc(-50% + ${ix.toFixed(2)}px), ${iy.toFixed(2)}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      // Leaves behind the lights — a firefly passing in front of a leaf reads
      // correctly; the reverse looks like a hole.
      for (const l of leaves) {
        l.y += l.speed * dt * motion;
        l.phase += l.swaySpeed * dt * TAU * motion;
        l.angle += l.spin * dt * TAU * motion;
        if (l.y - l.len > height) {
          l.y = -l.len;
          l.x = rand() * width;
        }
        const x = l.x + Math.sin(l.phase) * l.sway - curX * P.leaves * depth;
        const y = l.y - curY * P.leaves * depth * 0.5;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(l.angle);
        ctx.globalAlpha = l.alpha;
        drawLeaf(l.len, l.color);
        ctx.restore();
      }

      const floor = ORIGINS_SCENE.fireflies.blinkFloor;
      for (const f of flies) {
        f.x += f.dx * dt * motion;
        f.y += f.dy * dt * motion;
        f.phase += f.swaySpeed * dt * TAU * motion;
        f.blink += f.blinkSpeed * dt * TAU * motion;

        // Wander off any edge and reappear on the opposite one.
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;

        const x = f.x + Math.sin(f.phase) * f.sway - curX * P.fireflies * depth;
        const y = f.y - curY * P.fireflies * depth * 0.6;
        // Blink: a sine between the floor and full, on its own phase.
        const b = floor + (1 - floor) * (0.5 + 0.5 * Math.sin(f.blink));
        // The sprite's falloff runs to its full radius, so a fly of radius r
        // is drawn wider than r to keep the halo outside the core.
        const d = f.r * 5;
        ctx.globalAlpha = f.alpha * b;
        ctx.drawImage(glow, x - d, y - d, d * 2, d * 2);
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const { src, glow } = ORIGINS_SCENE.island;

  return (
    <>
      {/*
        Both backdrops share this element, so they share the parallax written
        to it every frame. Which one renders is `backdrop.mode` in the config;
        the forest cut-out branch is intact and one word away.
      */}
      {ORIGINS_SCENE.backdrop.mode === "image" ? (
        <div ref={islandRef} className="or-backdrop" aria-hidden="true">
          <Image
            src={ORIGINS_SCENE.backdrop.image.src}
            alt=""
            fill
            sizes="100vw"
            className="or-backdrop-img"
            priority
          />
        </div>
      ) : (
        <div ref={islandRef} className="or-island" aria-hidden="true">
          <Image src={glow} alt="" width={1536} height={1024} className="or-island-glow" />
          <Image src={src} alt="" width={1536} height={1024} className="or-island-art" priority />
        </div>
      )}

      {/* Dusk light through the canopy. CSS gradients, not canvas — a shaft is
          a soft wedge that barely moves. */}
      <span className="or-rays" aria-hidden="true">
        {Array.from({ length: ORIGINS_SCENE.rays.count }, (_, i) => (
          <span
            key={i}
            className="or-ray"
            style={{ "--i": i - (ORIGINS_SCENE.rays.count - 1) / 2 } as CSSProperties}
          />
        ))}
      </span>

      <span className="or-scrim" aria-hidden="true" />
      <canvas ref={canvasRef} className="or-weather" aria-hidden="true" />
      <span className="or-mist" aria-hidden="true" />
    </>
  );
}



/** Small marks for the talents. Original paths, no icon font. */
function TalentIcon({ kind }: { kind: BeyondIcon }) {
  const c = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    "aria-hidden": true as const,
    className: "or-talent-icon",
  };
  if (kind === "piano") {
    return (
      <svg {...c}>
        <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 5v8M12 5v8M16 5v8M3 13h18" stroke="currentColor" strokeWidth="1.35" />
      </svg>
    );
  }
  if (kind === "dance") {
    return (
      <svg {...c}>
        <circle cx="13" cy="4.6" r="2" fill="currentColor" />
        <path
          d="M13 7v5l-3 4.5M13 12l3 4.5M9 8.5l4 1.4 4-2.4M10 16.5 8 21M16 16.5 18 21"
          fill="none" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "mic") {
    return (
      <svg {...c}>
        <rect x="9" y="3" width="6" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...c}>
      <path d="M12 3.2 14.1 9h5.9l-4.8 3.6 1.8 5.8L12 15l-5 3.4 1.8-5.8L4 9h5.9Z"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A titled section that reveals as it scrolls into view.
 *
 * ── THE OBSERVER'S ROOT IS NOT THE WINDOW ──────────────────────────────────
 * This page scrolls inside `.section-page`, a fixed element with its own
 * `overflow-y: auto`. An IntersectionObserver left on the default root watches
 * the VIEWPORT, which never scrolls here — so every section would either be
 * "visible" from the start or never fire at all. The root is found with
 * `closest()` from the section's own ref.
 *
 * Revealed once and then unobserved: re-hiding a section when it leaves the
 * top of the screen makes scrolling back up feel broken.
 */
function Section({
  id,
  heading,
  note,
  wide,
  children,
}: {
  id: string;
  heading: string;
  note?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const root = el.closest(".section-page");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      // Fires a little before the section reaches the bottom edge, so the
      // motion is finishing as it arrives rather than starting.
      { root, rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={wide ? "or-block or-block-wide" : "or-block"}
      data-shown={shown || undefined}
    >
      <h3 className="or-label">
        <span className="or-label-text">{heading}</span>
        {note && <span className="or-label-note">{note}</span>}
      </h3>
      {children}
    </section>
  );
}

export function OriginsPage() {
  const o = origins;

  return (
    <div className="or">
      <OriginsScene />

      <div className="or-body">
        {/* An opening line, larger than the sections that follow — the page
            needs a voice before it starts listing things. */}
        <p className="or-opening">{o.roots.body}</p>

        <Section id="spark" heading={o.spark.heading} note="The turning point">
          <blockquote className="or-quote">
            <p>{o.spark.body}</p>
          </blockquote>
        </Section>

        <Section id="who" heading={o.whoIAm.heading}>
          <p className="or-prose or-prose-lead">{o.whoIAm.body}</p>
        </Section>

        <Section id="experience" heading={o.experience.heading} note="Where I have worked" wide>
          <ol className="or-timeline">
            {o.experience.items.map((e) => (
              <li key={e.org} className="or-tl-item">
                <span className="or-tl-dot" aria-hidden="true" />
                <div className="or-tl-text">
                  <p className="or-tl-when">{e.period}</p>
                  <h4 className="or-tl-org">{e.org}</h4>
                  <p className="or-tl-meta">
                    <span className="or-tl-role">{e.role}</span>
                    {e.place && <span className="or-tl-place">{e.place}</span>}
                  </p>
                  {e.body && <p className="or-prose">{e.body}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="leadership" heading={o.leadership.heading} note={o.leadership.note} wide>
          <ul className="or-cards">
            {o.leadership.items.map((r) => (
              <li key={r.name} className="or-card">
                <h4 className="or-card-title">{r.name}</h4>
                <p className="or-card-role">{r.role}</p>
                {r.body && <p className="or-card-body">{r.body}</p>}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="beyond" heading={o.beyond.heading} note="Away from the screen" wide>
          <ul className="or-talents">
            {o.beyond.items.map((t) => (
              <li key={t.label} className="or-talent">
                <span className="or-talent-mark" aria-hidden="true">
                  <TalentIcon kind={t.icon} />
                </span>
                <div>
                  <h4 className="or-talent-label">{t.label}</h4>
                  <p className="or-talent-body">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="dreams" heading={o.dreams.heading}>
          <div className="or-callout">
            <span className="or-callout-mark" aria-hidden="true">
              ✦
            </span>
            <p>{o.dreams.body}</p>
          </div>
        </Section>

        <Section id="headed" heading={o.headed.heading} note="What comes next">
          <p className="or-prose or-prose-lead">{o.headed.body}</p>
        </Section>

        <Section id="education" heading={o.education.heading} wide>
          <ol className="or-timeline or-timeline-tight">
            {o.education.items.map((s) => (
              <li key={s.school} className="or-tl-item">
                <span className="or-tl-dot" aria-hidden="true" />
                <div className="or-tl-text">
                  <p className="or-tl-when">{s.period}</p>
                  <h4 className="or-tl-org">{s.school}</h4>
                  {s.detail && (
                    <p className="or-tl-meta">
                      <span className="or-tl-role">{s.detail}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* The sign-off, so the page closes rather than stopping. */}
        <p className="or-closing">
          <span className="or-closing-mark" aria-hidden="true">
            ❧
          </span>
          <span className="or-closing-title">{o.closing.heading}</span>
          <span className="or-closing-body">{o.closing.body}</span>
        </p>
      </div>
    </div>
  );
}
