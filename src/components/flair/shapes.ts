import type { DriftKind } from "@/config/projectFlair";

/**
 * The drift shapes, drawn from scratch on a 2D context.
 *
 * Shared by the page-wide field (DriftField) and the in-row field (RowFlair) so
 * a shape exists ONCE. They were separate, which is why the row could only ever
 * draw pizza — the music shapes lived in the other file.
 *
 * Every function draws centred on the current origin at the current alpha; the
 * caller owns translate, rotate and globalAlpha.
 *
 * `colors` is positional, and each kind reads it differently:
 *   slice       [cheese, crust, sauce, pepperoni]
 *   tomato      [body, shade, leaf]
 *   pepper      [flesh, seed]
 *   note        [ink]
 *   headphones  [ink]
 *   cap         [board, tassel, crown]
 *   pokeball    [top, bottom, band]
 *   spark       [ink]
 * Every position falls back, so a short array in config degrades rather than
 * putting `undefined` into fillStyle, where it would silently draw nothing.
 */

const TAU = Math.PI * 2;

/**
 * A slice, tip at the origin. The crust is an ARC across the wide end — that
 * one curve is what makes a triangle read as a slice of something round rather
 * than as a triangle.
 */
function slice(
  ctx: CanvasRenderingContext2D,
  L: number,
  alpha: number,
  c: string[],
) {
  const halfW = L * 0.42;
  const [cheese = "#f4cf7f", crust = "#d9a25a", sauce = "#c8402c", pepperoni = "#a32d1c"] = c;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-halfW, L * 0.82);
  ctx.quadraticCurveTo(0, L * 1.02, halfW, L * 0.82);
  ctx.closePath();
  ctx.fillStyle = cheese;
  ctx.fill();

  ctx.globalAlpha = alpha * 0.42;
  ctx.beginPath();
  ctx.moveTo(0, L * 0.16);
  ctx.lineTo(-halfW * 0.74, L * 0.76);
  ctx.quadraticCurveTo(0, L * 0.9, halfW * 0.74, L * 0.76);
  ctx.closePath();
  ctx.fillStyle = sauce;
  ctx.fill();
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  ctx.moveTo(-halfW, L * 0.82);
  ctx.quadraticCurveTo(0, L * 1.02, halfW, L * 0.82);
  ctx.quadraticCurveTo(0, L * 1.24, -halfW, L * 0.82);
  ctx.closePath();
  ctx.fillStyle = crust;
  ctx.fill();

  ctx.fillStyle = pepperoni;
  ctx.beginPath();
  ctx.arc(-L * 0.13, L * 0.52, L * 0.1, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(L * 0.16, L * 0.68, L * 0.085, 0, TAU);
  ctx.fill();
}

/** A tomato: a squat body, a crescent of shade, and a five-point calyx. */
function tomato(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const r = L * 0.42;
  const [body = "#d8402c", shade = "#a82a1c", leaf = "#5f9e46"] = c;

  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.92, 0, 0, TAU);
  ctx.fillStyle = body;
  ctx.fill();

  const a0 = ctx.globalAlpha;
  ctx.globalAlpha = a0 * 0.32;
  ctx.beginPath();
  ctx.ellipse(r * 0.18, r * 0.16, r * 0.78, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.globalAlpha = a0;

  ctx.fillStyle = leaf;
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.82);
    ctx.lineTo(Math.cos(a) * r * 0.52, -r * 0.82 + Math.sin(a) * r * 0.34);
    ctx.lineTo(Math.cos(a + 0.34) * r * 0.3, -r * 0.68);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillRect(-L * 0.035, -r * 1.06, L * 0.07, r * 0.26);
}

/**
 * A ring of bell pepper: a thick STROKED lobed path, not two filled circles.
 * The canvas has no background to punch a hole through, so stroking is the only
 * way to get a ring whose middle is genuinely see-through.
 */
function pepper(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const r = L * 0.36;
  const [flesh = "#4e9b3f", seed = "#eef0d2"] = c;

  ctx.strokeStyle = flesh;
  ctx.lineWidth = L * 0.15;
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * TAU;
    const lobe = 1 + Math.sin(t * 3) * 0.12;
    const x = Math.cos(t) * r * lobe;
    const y = Math.sin(t) * r * lobe;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = seed;
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i - 1) * 0.7;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * r * 0.34, Math.sin(a) * r * 0.34, L * 0.045, L * 0.032, a, 0, TAU);
    ctx.fill();
  }
}

/**
 * A beamed quaver: two heads, two stems, one beam. TWO notes rather than one —
 * a single note reads as a tadpole at these sizes, and the beam is what makes
 * the pair unmistakably music.
 */
function note(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const ink = c[0] ?? "#ffffff";
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;

  const headR = L * 0.17;
  const stem = L * 0.62;
  const gap = L * 0.46;

  for (const dx of [0, gap]) {
    ctx.save();
    ctx.translate(dx, 0);
    // The head leans left, the way an engraved note sits.
    ctx.beginPath();
    ctx.ellipse(0, 0, headR * 1.24, headR, -0.42, 0, TAU);
    ctx.fill();
    ctx.lineWidth = L * 0.07;
    ctx.beginPath();
    ctx.moveTo(headR * 1.05, -headR * 0.28);
    ctx.lineTo(headR * 1.05, -stem);
    ctx.stroke();
    ctx.restore();
  }

  ctx.lineWidth = L * 0.13;
  ctx.beginPath();
  ctx.moveTo(headR * 1.05, -stem);
  ctx.lineTo(gap + headR * 1.05, -stem + L * 0.1);
  ctx.stroke();
}

/**
 * Headphones: a band arc with an earcup hanging off each END of it.
 *
 * The earcups sit on the arc's actual endpoints — (cos θ, sin θ)·r for the
 * start and stop angles. Put them at a guessed offset instead and the shape
 * reads as a bare letter C with two dots near it.
 */
function headphones(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const ink = c[0] ?? "#ffffff";
  const r = L * 0.38;
  const a0 = Math.PI * 1.06;
  const a1 = Math.PI * 1.94;

  ctx.strokeStyle = ink;
  ctx.lineWidth = L * 0.12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, r, a0, a1);
  ctx.stroke();

  ctx.fillStyle = ink;
  const ew = L * 0.2;
  const eh = L * 0.34;
  for (const a of [a0, a1]) {
    const ex = Math.cos(a) * r;
    const ey = Math.sin(a) * r;
    ctx.beginPath();
    ctx.roundRect(ex - ew / 2, ey, ew, eh, ew * 0.45);
    ctx.fill();
  }
}

/**
 * A graduation cap, seen from slightly above.
 *
 * The board is a RHOMBUS, not a square: a flat square viewed at an angle is a
 * diamond, and that foreshortening is the whole reason a mortarboard is
 * recognisable in silhouette. Drawn as a square it reads as a floating tile.
 *
 * Built in the order they sit in space — crown first, board over it, then the
 * tassel on top — so the cord visibly hangs off the near corner rather than
 * disappearing under the board.
 */
function cap(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const [board = "#cfe0ff", tassel = "#7fb2ff", crown = "#9dc2f2"] = c;
  const w = L * 0.5;
  const h = L * 0.27;
  // Where the cord leaves the board, and where the bundle hangs.
  const tx = w * 0.78;
  const ty = h * 0.14;
  const drop = ty + L * 0.3;

  // The crown, mostly hidden under the board — just enough to give it depth.
  ctx.fillStyle = crown;
  ctx.beginPath();
  ctx.moveTo(-w * 0.44, h * 0.16);
  ctx.lineTo(w * 0.44, h * 0.16);
  ctx.lineTo(w * 0.32, h * 0.98);
  ctx.quadraticCurveTo(0, h * 1.26, -w * 0.32, h * 0.98);
  ctx.closePath();
  ctx.fill();

  // The board.
  ctx.fillStyle = board;
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(w, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(-w, 0);
  ctx.closePath();
  ctx.fill();

  // The cord: centre button, out to the corner, then straight down.
  ctx.strokeStyle = tassel;
  ctx.lineWidth = Math.max(L * 0.04, 0.8);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(tx, ty);
  ctx.lineTo(tx, drop);
  ctx.stroke();

  ctx.fillStyle = tassel;
  // The bundle on the end.
  ctx.beginPath();
  ctx.ellipse(tx, drop + L * 0.09, L * 0.068, L * 0.11, 0, 0, TAU);
  ctx.fill();
  // The button the cord is anchored to.
  ctx.beginPath();
  ctx.arc(0, 0, L * 0.052, 0, TAU);
  ctx.fill();
}

/**
 * A capture sphere: a filled circle split across the middle, with a band and a
 * button on the seam.
 *
 * ── WHY THE BUTTON IS DRAWN IN THE BAND COLOUR ─────────────────────────────
 * At the sizes these drift by, a white button ringed in dark reads as a hole
 * punched through the shape. Drawing the ring alone, in the same colour as the
 * band, keeps the silhouette solid — which is the only part of this that
 * survives at 14px anyway.
 *
 * `top` and `bottom` are separate rather than one colour plus a tint, so a
 * config can put the yellow half up or the red half up without touching this.
 */
function pokeball(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const [top = "#c8102e", bottom = "#f2ebe6", band = "#1a0e0e"] = c;
  const r = L * 0.5;

  // Upper half.
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI, 0);
  ctx.fill();

  // Lower half.
  ctx.fillStyle = bottom;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI);
  ctx.fill();

  ctx.strokeStyle = band;
  // The seam. Full width, so the two halves read as one object.
  ctx.lineWidth = Math.max(1, L * 0.11);
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.stroke();

  // The button, as a ring rather than a filled disc. See the note above.
  ctx.lineWidth = Math.max(1, L * 0.075);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.28, 0, TAU);
  ctx.stroke();
}

/**
 * A four-pointed spark, drawn as two crossed tapers.
 *
 * The counterpart to the spheres: a field of nothing but Pokéballs reads as a
 * pattern, and these break it up without adding a second recognisable object.
 */
function spark(ctx: CanvasRenderingContext2D, L: number, c: string[]) {
  const ink = c[0] ?? "#f7da3b";
  const r = L * 0.5;
  // The waist. Small numbers give long thin points; this is a star, not a plus.
  const w = L * 0.09;

  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(w, -w, r, 0);
  ctx.quadraticCurveTo(w, w, 0, r);
  ctx.quadraticCurveTo(-w, w, -r, 0);
  ctx.quadraticCurveTo(-w, -w, 0, -r);
  ctx.fill();
}

/** Draws one drift shape, centred on the current origin. */
export function drawShape(
  ctx: CanvasRenderingContext2D,
  kind: DriftKind,
  size: number,
  alpha: number,
  colors: string[],
) {
  if (kind === "slice") slice(ctx, size, alpha, colors);
  else if (kind === "tomato") tomato(ctx, size, colors);
  else if (kind === "pepper") pepper(ctx, size, colors);
  else if (kind === "note") note(ctx, size, colors);
  else if (kind === "cap") cap(ctx, size, colors);
  else if (kind === "pokeball") pokeball(ctx, size, colors);
  else if (kind === "spark") spark(ctx, size, colors);
  else headphones(ctx, size, colors);
}
