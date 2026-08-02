import type { Config } from "tailwindcss";

/**
 * Atlas palette: aged parchment and gold leaf over a deep-navy sea. Every
 * surface is either paper, ink, or the ocean the map floats on.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1730",
          deep: "#050d1e",
          sea: "#0e2244",
          mist: "#1b355f",
        },
        parchment: {
          DEFAULT: "#f0e0bf",
          light: "#f7ecd4",
          mid: "#e4cfa3",
          deep: "#cdb281",
        },
        gold: {
          DEFAULT: "#d4af37",
          light: "#f2dd94",
          deep: "#9c7a22",
        },
        ink: {
          DEFAULT: "#3a2a15",
          soft: "#5e4726",
          faint: "#8a7150",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
      keyframes: {
        "cue-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.9" },
        },
        "hotspot-dash": {
          to: { strokeDashoffset: "-32" },
        },
      },
      animation: {
        "cue-pulse": "cue-pulse 2.2s ease-in-out infinite",
        "hotspot-dash": "hotspot-dash 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
