/**
 * ── AMBIENT BACKDROPS ──────────────────────────────────────────────────────
 * The living background behind a section page: three depth layers that move at
 * different speeds as you scroll, plus a drift of particles suited to whatever
 * that island is.
 *
 * ── THE THREE LAYERS ───────────────────────────────────────────────────────
 * Depth comes from the layers disagreeing about how far they have travelled:
 *
 *   far    the atmosphere — a broad wash of colour. Barely moves.
 *   mid    haze and smoke. Moves noticeably.
 *   near   the particles. Moves most, and has motion of its own on top.
 *
 * The numbers are fractions of the scroll distance, so `far: 0.1` means that
 * layer travels a tenth as far as the text does. Raise them together for more
 * depth; the RATIOS between them are what the eye reads, not the values.
 *
 * ── ADDING AN ISLAND'S AMBIENT ─────────────────────────────────────────────
 * Give it an entry in AMBIENT keyed by its island id (see config/islands.ts).
 * `kind` picks the particle behaviour — "embers" rise and flicker, "snow" and
 * "leaves" fall, "dust" hangs and drifts, "mist" barely moves. Only "embers" is
 * built today; the other four are listed below with the palette they should
 * use, and each falls back to no particles until its behaviour is written.
 *
 * Keep the atmosphere pale. The pages are warm off-white and the text sits
 * straight on top of them — this is a background, and the moment it competes
 * with the words it has failed, however good it looks on its own.
 */

export type AmbientKind = "embers" | "snow" | "leaves" | "dust" | "mist" | "none";

export interface AmbientSpec {
  kind: AmbientKind;
  /**
   * The far layer: two washes and a glow. On the Forge the glow sits low and
   * warm, as though the light were coming up out of a hearth below the page.
   */
  atmosphere: {
    /** Broad tint over the whole page. */
    wash: string;
    /** Where the light comes from, as a CSS gradient position. */
    glowAt: string;
    /** The light itself. */
    glow: string;
    /** Second, cooler pool of light for depth. */
    counterGlow: string;
  };
  /** The mid layer: slow, very soft shapes. Three of them. */
  haze: {
    color: string;
    opacity: number;
    blurPx: number;
    /** Seconds for one full drift cycle. Long — these should barely register. */
    driftS: number;
  };
  /**
   * ── THE SCENE ────────────────────────────────────────────────────────────
   * The animated world drawn on canvas behind the content. Optional — an
   * island with no `scene` gets atmosphere and particles only.
   *
   * THE FORGE sits on the city island, so its scene is the city: a skyline on
   * the horizon, ships working the water in front of it, birds over the top,
   * and weather crossing all of it. Everything is on its own parallax depth.
   */
  scene?: {
    /** Sky, top to horizon. Three stops, so it can carry a golden hour. */
    sky: [string, string, string];
    /** Where the horizon sits, as a fraction of the viewport height. */
    horizon: number;
    /** The sun, low and warm. */
    sun: {
      at: [number, number];
      radius: number;
      color: string;
      glow: string;
      intensity: number;
    };
    /**
     * The sea below the horizon. Four things happen on it: a graded body of
     * water, a specular path under the light, the city's lamplight smeared
     * down onto it, and a scatter of glitter — plus swell lines through all of
     * it and mist along the waterline.
     */
    sea: {
      /** Three stops rather than two, so the water has depth in it. */
      near: string;
      mid: string;
      far: string;
      /** The specular path under the low sun. */
      shimmerBands: number;
      shimmerColor: string;
      shimmerOpacity: number;
      shimmerSpeed: number;
      /** The city's lamplight, smeared down the water beneath it. */
      reflection: {
        color: string;
        /** Width as a fraction of the viewport. */
        width: number;
        opacity: number;
        /** How far it wavers sideways, px, and how fast. */
        waver: number;
        waverSpeed: number;
      };
      /** Points of light on the surface. */
      glitter: {
        count: number;
        mobileCount: number;
        size: [number, number];
        opacity: [number, number];
        twinkle: [number, number];
        color: string;
      };
      /**
       * The swell. Each band is a filled shape whose TOP EDGE is a curve, so
       * the water is layers of rolling water rather than lines drawn on a flat
       * pool. Stacked, translucent, and packed toward the horizon.
       */
      waves: {
        count: number;
        mobileCount: number;
        /** Tint of a band. Accumulates downward, deepening the near water. */
        color: string;
        opacity: number;
        /** The lit edge along each crest. */
        foam: string;
        foamOpacity: number;
        /** Crest height in px at the NEAR edge; shrinks toward the horizon. */
        amplitude: number;
        /** Distance between crests in px at the near edge. */
        wavelength: number;
        /** Cycles/sec. Low — this is a calm sea. */
        speed: number;
        /**
         * How hard amplitude and wavelength fall off toward the horizon.
         * Higher = more foreshortening, so the sea recedes harder.
         */
        perspective: number;
      };
      /** Mist along the waterline, softening the horizon. */
      mist: {
        color: string;
        opacity: number;
        /** Height as a fraction of the viewport's smaller side. */
        height: number;
      };
    };
    /** The skyline, drawn from the island artwork. */
    city: {
      /** Artwork used for the silhouette. */
      src: string;
      /** Width as a fraction of the viewport. */
      width: number;
      /** How far its base sits below the horizon, as a fraction of height. */
      sink: number;
      /** How dark the silhouette is pushed, 0-1. */
      darken: number;
      /** Overall visibility. */
      opacity: number;
      /** Colour washed over it, to sit it in the air. */
      tint: string;
      /** How far it drifts sideways over time, px, and how slowly. */
      drift: number;
      driftSpeed: number;
    };
    /** Stars, in the upper sky only. */
    stars: {
      count: number;
      mobileCount: number;
      size: [number, number];
      opacity: [number, number];
      /** Twinkle rate, cycles/sec. */
      twinkle: [number, number];
      color: string;
      /** Band of sky they occupy, as fractions of the horizon height. */
      band: [number, number];
    };
    /** A warm halo behind the city, so it reads as lit from within. */
    cityGlow: {
      color: string;
      /** Radius as a fraction of the viewport's smaller side. */
      radius: number;
      intensity: number;
    };
    /** Vessels working the water in front of the city. */
    ships: {
      /** Sprites to draw from. */
      srcs: string[];
      count: number;
      mobileCount: number;
      /** Width range as a fraction of the viewport. */
      size: [number, number];
      /** px/sec. Negative values sail left. */
      speed: [number, number];
      /** Band of sea they occupy, as fractions of height BELOW the horizon. */
      band: [number, number];
      opacity: [number, number];
      /** Bob height in px and period in seconds. */
      bob: number;
      bobS: [number, number];
    };
    /** Flocks crossing the sky. */
    birds: {
      /** How many flocks are aloft at once. */
      flocks: number;
      mobileFlocks: number;
      /** Birds per flock. */
      perFlock: [number, number];
      /** Wingspan px. */
      size: [number, number];
      speed: [number, number];
      /** Band of sky they use, as fractions of the horizon height. */
      band: [number, number];
      color: string;
      opacity: number;
      /** Wingbeats per second. */
      flap: [number, number];
    };
    /** Weather. */
    clouds: {
      count: number;
      mobileCount: number;
      /** Width as a fraction of the viewport. */
      size: [number, number];
      speed: [number, number];
      band: [number, number];
      color: string;
      opacity: [number, number];
    };
  };

  /**
   * ── EMBER TIERS ──────────────────────────────────────────────────────────
   * Depth in the drift itself. Each tier gets its own size, speed, brightness
   * and parallax multiplier, so big soft embers loiter near the eye while fine
   * sparks race past far away.
   *
   * `soft` draws the ember as a glow with no hard middle — which is what a
   * defocused foreground particle looks like, and far cheaper than actually
   * blurring the canvas.
   */
  emberTiers?: {
    name: string;
    count: number;
    mobileCount: number;
    size: [number, number];
    speed: [number, number];
    sway: [number, number];
    swaySpeed: [number, number];
    opacity: [number, number];
    glow: number;
    soft: boolean;
    /** Multiplier on the near-layer parallax. Bigger = closer to the eye. */
    depth: number;
    flicker: [number, number];
  }[];

  particles: {
    /** Desktop count. Phones use `mobileCount`. */
    count: number;
    mobileCount: number;
    /** Radius range, px. */
    size: [number, number];
    /** Vertical travel, px/sec. Positive rises for "embers", falls otherwise. */
    speed: [number, number];
    /** How far one sways sideways, px, and how fast. */
    sway: [number, number];
    swaySpeed: [number, number];
    opacity: [number, number];
    /** Drawn in order; each particle picks one. */
    colors: string[];
    /** Halo radius as a multiple of the particle's own. 0 = no glow. */
    glow: number;
    /** Flicker rate range, cycles/sec. 0 disables. */
    flicker: [number, number];
  };
}

/** Shared defaults, so a new island only has to state what makes it different. */
const NO_PARTICLES: AmbientSpec["particles"] = {
  count: 0,
  mobileCount: 0,
  size: [1, 2],
  speed: [8, 20],
  sway: [10, 30],
  swaySpeed: [0.05, 0.15],
  opacity: [0.1, 0.3],
  colors: ["#000000"],
  glow: 0,
  flicker: [0, 0],
};

/**
 * ── DAY OR NIGHT ───────────────────────────────────────────────────────────
 * THE ONE LINE THAT SWITCHES THE FORGE'S SKY.
 *
 * Everything that has to change together — sky, sun, sea, stars, the city's
 * tint and glow, the cloud and bird colours, and the text treatment on the
 * page — lives in one preset each. Flip this and the whole scene moves as a
 * piece; there is no second place to remember.
 *
 * The page reads the same value through `data-sky` (see SectionOverlay), which
 * is what swaps the text from dark-on-bright to light-on-dark. Changing colours
 * without changing that would leave the copy unreadable.
 */
export const SKY: "day" | "night" = "day";

interface SkyPreset {
  sky: [string, string, string];
  sun: { at: [number, number]; radius: number; color: string; glow: string; intensity: number };
  sea: {
    near: string;
    mid: string;
    far: string;
    shimmerColor: string;
    shimmerOpacity: number;
    reflection: { color: string; opacity: number };
    glitter: { count: number; mobileCount: number; color: string; opacity: [number, number] };
    waves: { color: string; opacity: number; foam: string; foamOpacity: number };
    mist: { color: string; opacity: number };
  };
  stars: { count: number; mobileCount: number };
  cityGlow: { color: string; intensity: number };
  city: { darken: number; tint: string };
  clouds: { color: string; opacity: [number, number] };
  birds: { color: string; opacity: number };
  atmosphere: AmbientSpec["atmosphere"];
  haze: AmbientSpec["haze"];
}

const SKY_PRESETS: Record<"day" | "night", SkyPreset> = {
  /** A clear, airy afternoon over the harbour. */
  day: {
    sky: ["#5b9fd4", "#a9cde4", "#f2e2c0"],
    sun: {
      at: [0.74, 0.3],
      radius: 0.46,
      color: "rgba(255, 244, 214, 1)",
      glow: "rgba(255, 206, 140, 1)",
      intensity: 0.5,
    },
    sea: {
      near: "#0d3350",
      mid: "#1d5878",
      far: "#5c96b4",
      shimmerColor: "rgba(255, 250, 226, 1)",
      shimmerOpacity: 0.28,
      reflection: { color: "rgba(255, 242, 206, 1)", opacity: 0.16 },
      glitter: {
        count: 70,
        mobileCount: 26,
        color: "rgba(255, 255, 255, 1)",
        opacity: [0.14, 0.6],
      },
      waves: {
        color: "rgba(8, 44, 74, 1)",
        opacity: 0.075,
        foam: "rgba(240, 252, 255, 1)",
        foamOpacity: 0.42,
      },
      mist: { color: "rgba(226, 234, 240, 1)", opacity: 0.62 },
    },
    // No stars in daylight.
    stars: { count: 0, mobileCount: 0 },
    cityGlow: { color: "rgba(255, 226, 168, 1)", intensity: 0.18 },
    city: { darken: 0.05, tint: "rgba(150, 184, 214, 0.14)" },
    clouds: { color: "rgba(255, 255, 252, 1)", opacity: [0.34, 0.8] },
    birds: { color: "rgba(46, 56, 72, 1)", opacity: 0.55 },
    atmosphere: {
      wash: "rgba(226, 240, 250, 0.28)",
      glowAt: "74% 26%",
      glow: "rgba(255, 226, 160, 0.26)",
      counterGlow: "rgba(140, 186, 220, 0.24)",
    },
    haze: {
      color: "rgba(226, 234, 240, 0.5)",
      opacity: 0.34,
      blurPx: 78,
      driftS: 52,
    },
  },

  /** The same harbour at dusk. Kept so the switch is one word. */
  night: {
    sky: ["#0b1636", "#2a2350", "#7d4a52"],
    sun: {
      at: [0.7, 0.84],
      radius: 0.5,
      color: "rgba(255, 186, 112, 1)",
      glow: "rgba(228, 104, 70, 1)",
      intensity: 0.5,
    },
    sea: {
      near: "#04080f",
      mid: "#0a1a2e",
      far: "#1c3552",
      shimmerColor: "rgba(255, 186, 128, 1)",
      shimmerOpacity: 0.24,
      reflection: { color: "rgba(255, 172, 92, 1)", opacity: 0.3 },
      glitter: {
        count: 90,
        mobileCount: 34,
        color: "rgba(206, 224, 255, 1)",
        opacity: [0.15, 0.7],
      },
      waves: {
        color: "rgba(4, 14, 30, 1)",
        opacity: 0.08,
        foam: "rgba(190, 214, 255, 1)",
        foamOpacity: 0.2,
      },
      mist: { color: "rgba(122, 138, 178, 1)", opacity: 0.5 },
    },
    stars: { count: 130, mobileCount: 45 },
    cityGlow: { color: "rgba(255, 168, 78, 1)", intensity: 0.34 },
    city: { darken: 0.3, tint: "rgba(64, 62, 112, 0.34)" },
    clouds: { color: "rgba(226, 200, 206, 1)", opacity: [0.14, 0.4] },
    birds: { color: "rgba(24, 22, 40, 1)", opacity: 0.62 },
    atmosphere: {
      wash: "rgba(10, 14, 34, 0.42)",
      glowAt: "62% 88%",
      glow: "rgba(226, 118, 70, 0.28)",
      counterGlow: "rgba(52, 48, 104, 0.34)",
    },
    haze: {
      color: "rgba(70, 62, 116, 0.5)",
      opacity: 0.4,
      blurPx: 84,
      driftS: 38,
    },
  },
};

const P = SKY_PRESETS[SKY];

export const AMBIENT: Record<string, AmbientSpec> = {
  /**
   * THE FORGE — a workshop with something hot in it. Embers lift off the page
   * bottom and wander upward, brightening and dimming as they go, over a low
   * warm glow and a slow crawl of smoke.
   */
  projects: {
    kind: "none",
    /*
     * The city island, seen from the water. Everything that separates day from
     * night is in SKY_PRESETS above — this entry only states what does NOT
     * change between them: where the horizon sits, how big the city is, how
     * many ships and birds there are, and how fast anything moves.
     */
    atmosphere: P.atmosphere,
    haze: P.haze,
    scene: {
      sky: P.sky,
      horizon: 0.84,
      sun: P.sun,
      sea: {
        near: P.sea.near,
        mid: P.sea.mid,
        far: P.sea.far,
        shimmerBands: 30,
        shimmerColor: P.sea.shimmerColor,
        shimmerOpacity: P.sea.shimmerOpacity,
        shimmerSpeed: 0.09,
        reflection: {
          color: P.sea.reflection.color,
          width: 0.3,
          opacity: P.sea.reflection.opacity,
          waver: 22,
          waverSpeed: 0.07,
        },
        glitter: {
          count: P.sea.glitter.count,
          mobileCount: P.sea.glitter.mobileCount,
          size: [0.6, 2.1],
          opacity: P.sea.glitter.opacity,
          twinkle: [0.4, 1.6],
          color: P.sea.glitter.color,
        },
        waves: {
          count: 26,
          mobileCount: 14,
          color: P.sea.waves.color,
          opacity: P.sea.waves.opacity,
          foam: P.sea.waves.foam,
          foamOpacity: P.sea.waves.foamOpacity,
          amplitude: 17,
          wavelength: 190,
          speed: 0.055,
          perspective: 1.9,
        },
        mist: {
          color: P.sea.mist.color,
          opacity: P.sea.mist.opacity,
          height: 0.11,
        },
      },
      stars: {
        count: P.stars.count,
        mobileCount: P.stars.mobileCount,
        size: [0.5, 1.6],
        opacity: [0.25, 0.9],
        twinkle: [0.3, 1.4],
        color: "rgba(232, 238, 255, 1)",
        band: [0.02, 0.62],
      },
      cityGlow: {
        color: P.cityGlow.color,
        radius: 0.62,
        intensity: P.cityGlow.intensity,
      },
      city: {
        src: "/images/islands/cityland.png",
        width: 1.02,
        sink: 0.3,
        darken: P.city.darken,
        opacity: 0.88,
        tint: P.city.tint,
        drift: 26,
        driftSpeed: 0.012,
      },
      ships: {
        srcs: [
          "/images/boats/boat-1.png",
          "/images/boats/boat-2.png",
          "/images/boats/boat-3.png",
          "/images/boats/boat-5.png",
        ],
        count: 5,
        mobileCount: 2,
        size: [0.03, 0.07],
        speed: [7, 21],
        band: [0.012, 0.1],
        opacity: [0.4, 0.85],
        bob: 3.5,
        bobS: [4.5, 8],
      },
      birds: {
        flocks: 3,
        mobileFlocks: 1,
        perFlock: [4, 9],
        size: [7, 15],
        speed: [26, 58],
        band: [0.1, 0.62],
        color: P.birds.color,
        opacity: P.birds.opacity,
        flap: [1.6, 3.4],
      },
      clouds: {
        count: 7,
        mobileCount: 3,
        size: [0.22, 0.58],
        speed: [4, 13],
        band: [0.02, 0.6],
        color: P.clouds.color,
        opacity: P.clouds.opacity,
      },
    },
    particles: NO_PARTICLES,
  },

  // ── TODO: the other four ──────────────────────────────────────────────────
  // Each has its atmosphere written and its intended `kind` set, so they
  // already tint their pages. Particles stay off until the behaviour for that
  // kind is implemented in AmbientBackdrop — see the switch in `spawn`.
  home: {
    kind: "mist",
    atmosphere: {
      wash: "rgba(226, 236, 240, 0.5)",
      glowAt: "50% 6%",
      glow: "rgba(150, 178, 196, 0.26)",
      counterGlow: "rgba(120, 140, 158, 0.14)",
    },
    haze: { color: "rgba(150, 172, 186, 0.5)", opacity: 0.34, blurPx: 72, driftS: 62 },
    particles: NO_PARTICLES,
  },
  about: {
    kind: "leaves",
    atmosphere: {
      wash: "rgba(228, 238, 216, 0.5)",
      glowAt: "28% 12%",
      glow: "rgba(138, 168, 96, 0.24)",
      counterGlow: "rgba(120, 148, 90, 0.14)",
    },
    haze: { color: "rgba(134, 158, 104, 0.5)", opacity: 0.26, blurPx: 58, driftS: 54 },
    particles: NO_PARTICLES,
  },
  skills: {
    kind: "dust",
    atmosphere: {
      wash: "rgba(245, 232, 206, 0.5)",
      glowAt: "72% 18%",
      glow: "rgba(214, 168, 96, 0.26)",
      counterGlow: "rgba(186, 146, 88, 0.14)",
    },
    haze: { color: "rgba(196, 164, 112, 0.5)", opacity: 0.28, blurPx: 54, driftS: 50 },
    particles: NO_PARTICLES,
  },
  /*
   * THE GATE, at dusk. Retuned from the pale snow wash it carried while the
   * page was a placeholder: the contact page is a DARK twilight now, and a
   * bright atmosphere over it left the copy floating on fog.
   *
   * Teal field, one warm glow low on the horizon — a lit doorway on a frozen
   * shore. The gold is what stops the island reading as bleak.
   */
  contact: {
    kind: "snow",
    atmosphere: {
      wash: "rgba(7, 30, 34, 0.62)",
      glowAt: "50% 88%",
      glow: "rgba(224, 169, 78, 0.2)",
      counterGlow: "rgba(24, 96, 104, 0.3)",
    },
    haze: { color: "rgba(18, 74, 80, 0.55)", opacity: 0.34, blurPx: 68, driftS: 58 },
    particles: NO_PARTICLES,
  },
};

/**
 * ── PARALLAX ───────────────────────────────────────────────────────────────
 *   far/mid/near  fraction of the page's scroll each layer travels. The gaps
 *                 between them are the depth cue.
 *   mouse         extra px of drift from the pointer, at the NEAR layer; the
 *                 others get proportionally less. 0 disables look-around.
 *   easing        how quickly the pointer drift catches up, per second.
 *   mobileScale   everything above is multiplied by this on phones, where the
 *                 viewport is small enough that big parallax reads as a wobble.
 *   reducedScale  and by this when the system asks for less motion. The page
 *                 keeps its atmosphere either way; only the movement changes.
 */
export const PARALLAX = {
  far: 0.16,
  mid: 0.42,
  near: 0.72,
  mouse: 34,
  easing: 2.4,
  mobileScale: 0.45,
  reducedScale: 0.15,
  mobileBreakpoint: 700,
} as const;

export const ambientFor = (id: string): AmbientSpec | null => AMBIENT[id] ?? null;
