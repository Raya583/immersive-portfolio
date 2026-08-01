import type { Vec3 } from "@/types/three";

/**
 * "Flatten into a map." Once the islands have materialised, the camera lifts
 * on its own into a bird's-eye framing so the 3D world reads as a map: name
 * labels float above each island and a dotted trail links them in JOURNEY
 * order. Orbit stays enabled afterwards — the top-down framing is simply the
 * resting state the viewer explores from.
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
   * ── ZOOM / HEIGHT KNOB ───────────────────────────────────────────────────
   * The bird's-eye resting framing. `position[1]` is the zoom: raise it to pull
   * back, lower it to move in. `position[2]` is the small forward offset that
   * keeps the camera off the straight-down singularity (and gives the islands a
   * touch of dimension); keep it around a fifth of the height.
   *
   * Currently ~55 units from the target, which at the 45° fov in config/scene.ts
   * shows ~46 world units of height. The islands span 38 x 30 (see SPREAD_X /
   * SPREAD_Z in config/islands.ts) plus labels, so everything sits in frame with
   * room around it. Widen the spread → raise the height by the same ratio.
   *
   * Tuned for a landscape viewport; a very narrow window will crop the sides.
   */
  camera: {
    position: [0, 54, 12] as Vec3,
    target: [0, 0, 0] as Vec3,
  },

  /**
   * Orbit clamps swapped in when the flight starts. maxDistance must stay above
   * the resting distance (≈55) or the viewer gets shoved inward on arrival, and
   * minPolar has to sit below the map framing's own polar angle (≈0.22 rad) or
   * OrbitControls would clamp the camera straight back out of the top-down pose.
   */
  orbit: {
    minDistance: 18,
    maxDistance: 90,
    minPolar: 0.08,
    maxPolar: 1.2,
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
