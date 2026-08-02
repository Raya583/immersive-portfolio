import type { Metadata, Viewport } from "next";
import { profile } from "@/content/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: `${profile.title}. ${profile.tagline} An atlas of selected work, honours and how to make contact.`,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: `${profile.title}. ${profile.tagline}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050d1e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/*
          Cinzel for the engraved map lettering, EB Garamond for reading. From
          the CDN rather than next/font so the build never needs the network;
          if it fails, the Georgia fallbacks in --font-* keep the same feel.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        />
      </head>
      <body className="min-h-dvh bg-navy-deep font-body text-parchment antialiased">
        {/* Deep ocean wash behind everything — the sea the atlas floats on. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #16305c 0%, #0a1730 45%, #050d1e 100%)",
          }}
        />
        {children}
      </body>
    </html>
  );
}
