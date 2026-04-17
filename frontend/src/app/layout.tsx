import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

// Distinctive display serif + tight modern sans. Avoids the Inter default.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});
const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GeoHealth Compass — Nationwide Smart Hospital Discovery",
  description:
    "Find nearby hospitals, compare options, and see regional healthcare access insights across Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh relative">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
