import type React from "react";
import type { Metadata } from "next";
import { DM_Sans as DMSans } from "next/font/google";
import GoogleMapsScript from "@/components/google-maps-script";
import Providers from "./providers";
import "./globals.css";

const dmSans = DMSans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title:
    "Order Quality Nigerian Food Online | Beans, Dodo, Semo, Fura Delivery | BetaDay",
  description:
    "Enjoy real Naija flavors delivered fast! Order from local chefs & restaurants offering fresh Amala, Eba, Pounded Yam, Jollof Rice, Dodo, Suya, and more. Same-day delivery of home-style Nigerian meals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Favicon Links */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body
        className={`${dmSans.variable} antialiased bg-white`}
        suppressHydrationWarning
      >
        <GoogleMapsScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
