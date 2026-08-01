import type { Vec3 } from "@/types/three";

/**
 * The map view. Once the islands have materialised the camera settles, on its
 * own, into a SIDE / THREE-QUARTER resting angle looking across the world:
 * name labels float above each island, a dotted trail links them in JOURNEY
 * order, and the whole constellation revolves slowly about the centre. Orbit
 * stays enabled — the resting angle is just where the viewer starts from.
 */
export const MAP_CONFIG = {
  /** Story step that arms the flatten (the island-reveal step). */
  triggerAtStep: 4,
  /** Seconds after the trigger to let the islands finish rising in. */
  delaySeconds: 3.4,
  /**
   * Total seconds the flight is steered for. Once it elapses the camera is
   * handed back to the viewer for good and is never fought again.
   */
  flightSeconds: 4.0,
  /** easeAlpha time constant for the flight. Lower = snappier arrival. */
  easeSeconds: 1.6,

  /**
   * ── RESTING VIEW KNOB ────────────────────────────────────────────────────
   * Where the camera settles once the reveal finishes. This is a SIDE /
   * THREE-QUARTER angle — looking across the islands from slightly above and
   * off to one side, with plenty of sky above them — rather than the top-down
   * plan view it used to hold.
   *
   *   position[0] swings the camera around the map (the three-quarter offset)
   *   position[1] is how high it sits; lower = flatter, more horizon
   *   position[2] is how far back it stands
   *   target[1] lifts the look-at, which drops the islands in frame and lets
   *             more sky in above them
   *
   * ~58 units out at about 71° off vertical. If you raise position[1] toward
   * the distance you will drift back to a plan view — and note the resting
   * angle has to stay inside the orbit clamps below, or OrbitControls will
   * pull the camera straight back out of it on the next update.
   */
  camera: {
    position: [26, 21, 48] as Vec3,
    target: [0, 2, 0] as Vec3,
  },

  /**
   * ── REVOLVE ──────────────────────────────────────────────────────────────
   * The whole constellation — islands, labels and the dotted trail together —
   * turns slowly about the map's centre, like an orrery. Deliberately glacial:
   * it should be something you notice only if you sit and watch.
   *
   * Raise secondsPerRevolution to slow it down. Individual island spin is
   * separate: ISLAND_SPIN_SPEED in config/islands.ts.
   */
  revolve: {
    /** Seconds for one full turn of the constellation. */
    secondsPerRevolution: 320,
    /** 1 = counter-clockwise seen from above, -1 = clockwise. */
    direction: 1,
  },

  /**
   * Orbit clamps swapped in when the flight starts. maxDistance must stay above
   * the resting distance (≈58) or the viewer gets shoved inward on arrival, and
   * the resting polar angle (≈1.24 rad) has to sit between minPolar and
   * maxPolar or OrbitControls clamps the camera straight back out of it.
   */
  orbit: {
    minDistance: 18,
    maxDistance: 90,
    /** Still lets the viewer swing up to a plan view if they want one. */
    minPolar: 0.08,
    /** Must stay ABOVE the resting angle (~1.24 rad) or the camera gets
        clamped out of the three-quarter view the moment it arrives. */
    maxPolar: 1.45,
  },

  /**
   * ── PROJECT FLY-IN ───────────────────────────────────────────────────────
   * Clicking an island flies the camera here, and the scroll unrolls once it
   * lands. `offset` is ADDED to the island's own position, so one relative
   * framing works for all five; when a particular island wants its own angle,
   * give it a `focusOffset` in config/islands.ts and that wins.
   *
   * The offset's length is the viewing distance (currently ~16 units, which
   * frames an 8-unit island with room around it). Push it out if the scroll
   * overlay crowds the island behind it.
   */
  focus: {
    offset: [0, 6, 15] as Vec3,
    /** Look this far above the island's origin — its middle, not its base. */
    targetHeight: 1.5,
    /** Seconds the fly-IN is steered for; the scroll opens when it elapses. */
    flightSeconds: 1.7,
    /** Seconds the flight back OUT to the map takes. */
    returnSeconds: 1.5,
    /** easeAlpha time constant for both. Lower = snappier. */
    easeSeconds: 0.7,
  },

  /** Floating island name labels. */
  labels: {
    /** Map progress (0→1) at which labels start fading up. */
    fadeStart: 0.45,
    /** easeAlpha time constant for the fade. */
    fadeSeconds: 1.2,
  },

  /** The dotted journey trail. */
  path: {
    /** Height the trail is drawn at — just under the islands. */
    y: -2,
    color: "#f4ecff",
    lineWidth: 2.2,
    // Dashes scale with the map: the legs are 22-30 units long now, so keep the
    // dash/gap big enough to read from 55 units up.
    dashSize: 0.9,
    gapSize: 0.9,
    /** Resting opacity once fully faded in. */
    opacity: 0.55,
    /** Samples per journey leg when smoothing the trail into a curve. */
    curveSegments: 24,
    /**
     * Catmull-Rom tension — lower is straighter, higher is loopier. Kept low
     * because the journey turns a near-right-angle at each corner island and a
     * loose curve would overshoot past them.
     */
    curveTension: 0.2,
    fadeStart: 0.3,
    fadeSeconds: 1.6,
  },
} as const;
