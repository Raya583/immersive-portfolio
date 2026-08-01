/**
 * ── MAP BACKDROP ───────────────────────────────────────────────────────────
 * The two still images the map view is built on: a cherry-blossom sunset that
 * fills the viewport, and the Korean temple floating in front of it.
 *
 * Both are DOM layers sitting BEHIND the R3F canvas, which is rendered with a
 * transparent clear so they show through. That is what makes them absolutely
 * static: they are not in the 3D scene at all, so nothing can rotate, revolve
 * or parallax them, and orbiting the camera moves only the islands in front.
 * Neither takes pointer events, so the islands stay clickable.
 *
 * ── LAYER ORDER, back to front ─────────────────────────────────────────────
 *   0   .backdrop-sky      map-bg.png, full-bleed cover
 *   1   .backdrop-temple   temple.png, centred landmark
 *   2   .canvas-layer      the 3D scene — islands, dotted paths, name labels
 *   20  .sakura            falling petals
 *   30+ narration, scroll curtain, landing pages
 * These z-indexes live in the matching rules in app/globals.css.
 */
export const BACKDROP_CONFIG = {
  background: {
    src: "/images/map-bg.png",
    /**
     * ── BACKGROUND CROP ────────────────────────────────────────────────────
     * The image is 16:9 and is drawn `cover`, so anything narrower or taller
     * than 16:9 crops rather than letterboxes. This is the crop anchor:
     * "50% 50%" keeps the sun and horizon centred and trims the sides evenly.
     * Try "50% 40%" to favour the sky, or "50% 65%" to favour the cloud sea.
     */
    position: "50% 50%",
  },

  temple: {
    /**
     * ── TEMPLE ON/OFF ──────────────────────────────────────────────────────
     * Currently OFF: the map runs on the background image alone. Flip this to
     * true to bring the temple back — everything below it, and the layer and
     * styling in globals.css, is still in place, and the image is still at
     * public/images/temple.png.
     */
    enabled: false,

    src: "/images/temple.png",
    /**
     * ── TEMPLE SIZE ────────────────────────────────────────────────────────
     * Width as a percentage of the viewport width; the image keeps its own
     * 3:2 proportions, so height follows. `maxWidthRem` stops it becoming
     * absurd on ultra-wide monitors.
     */
    widthVw: 60,
    maxWidthRem: 64,
    /**
     * ── TEMPLE POSITION ────────────────────────────────────────────────────
     * Centre point as a percentage of the viewport. x 50 is dead centre;
     * raise y to push it down the frame. 65 sits it low enough that the
     * islands float above and around it rather than colliding with its roof —
     * push it back up toward 55 for a more dominant centrepiece, at the cost
     * of the islands reading against a busy surface.
     */
    centerX: 50,
    centerY: 65,
    /** A touch under 1 so it settles into the haze rather than sitting on top. */
    opacity: 0.96,
  },

  /**
   * Story step at which the backdrop is revealed. Step 3 is the beat where the
   * sky burst is holding at full screen, so the images fade up hidden BEHIND
   * it and are already in place when it clears — no pop.
   */
  revealAtStep: 3,
  fadeMs: 1800,
} as const;
