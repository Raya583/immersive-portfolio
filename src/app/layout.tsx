import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  DM_Sans,
  Playfair_Display,
  Karla,
  Space_Grotesk,
  Outfit,
  Crimson_Text,
  Inter,
  Port_Lligat_Sans,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/*
 * ── PROJECT FACES ──────────────────────────────────────────────────────────
 * Loaded here, at module scope, because that is the only place `next/font`
 * can run — it hashes and self-hosts the files at build time, so there is no
 * request to Google at runtime and no flash of unstyled text.
 *
 * They are exposed as CSS variables rather than applied to anything. Which
 * project uses which face is decided in config/projectThemes.ts, so a new
 * project theme is a config entry and never a change here — unless it wants a
 * face that is not yet loaded, in which case add it below too.
 *
 * Fraunces: a soft, high-contrast serif with a little wobble to it. DM Sans:
 * a clean geometric companion for body copy.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

/**
 * Crustfolio's own pair, taken from the project itself: the site sets "Every
 * Slice Tells a Story" in a high-contrast display serif, so the case study uses
 * one too — Playfair Display, with Karla underneath it for body copy.
 *
 * Loaded here for the same reason as the others: this is the only place
 * `next/font` can run. Which project uses them is decided in
 * config/projectThemes.ts.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

/**
 * COGMU's pair: Space Grotesk is a contemporary grotesque with just enough
 * quirk to read as a music product rather than a bank, and Outfit is a clean
 * geometric for body copy. Chosen for the Gen-Z audience the project names.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

/**
 * Crustfolio's display face. COGMU has no entry here on purpose: it uses the
 * SYSTEM stack (SF Pro on Apple hardware), which is not a webfont and must not
 * be loaded — the whole point is that it is already on the device.
 */
const crimson = Crimson_Text({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
});

/** FUTURX's face, and DEXOVO's body copy: neutral and highly legible, which is
 *  what a platform people have to trust should sound like. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * DEXOVO's display face, taken from the project itself — the app sets its
 * headings and every number in it.
 *
 * Single weight, because that is all the family HAS. Port Lligat Sans ships
 * regular only, so a theme asking for 700 here would get a browser-synthesised
 * fake bold, which smears a face whose whole character is its even stroke.
 * DEXOVO's theme therefore sets `headingWeight: "400"` rather than the 600-700
 * the other projects use.
 */
const portLligat = Port_Lligat_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-port-lligat",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${playfair.variable} ${karla.variable} ${spaceGrotesk.variable} ${outfit.variable} ${crimson.variable} ${inter.variable} ${portLligat.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
