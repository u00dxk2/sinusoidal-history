import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces — variable serif with optical-size and "soft" axes.
// Used for editorial headlines + the State-of-the-cycles masthead.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const SITE_URL = "https://sinusoidal-history.skylarkcreations.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sinusoidal History",
    template: "%s · Sinusoidal History",
  },
  description:
    "Seven historical cycle theories on one shared time axis. A comparison tool — not prophecy.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sinusoidal History",
    description:
      "Seven historical cycle theories on one shared time axis. A comparison tool — not prophecy.",
    url: SITE_URL,
    siteName: "Sinusoidal History",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "State of the cycles snapshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinusoidal History",
    description:
      "Seven historical cycle theories on one shared time axis. A comparison tool — not prophecy.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
