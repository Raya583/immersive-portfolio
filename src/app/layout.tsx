import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immersive Portfolio",
  description: "An immersive 3D portfolio.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/*
          Hylia Serif carries no Hangul, so the Korean woven through the
          narration needs a Korean serif alongside it. Loaded from the CDN
          rather than next/font so the build never depends on the network —
          if the stylesheet fails, the OS Korean serifs in the .font-hylia
          stack take over.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* The rule below targets pages/_document; this is the App Router
            root layout, so the stylesheet does apply to every page. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400&display=swap"
        />
      </head>
      <body className="h-full bg-canvas text-white antialiased">
        {children}
      </body>
    </html>
  );
}
