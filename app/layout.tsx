import type React from "react";
import type { Metadata } from "next";
import { DM_Sans as DMSans } from "next/font/google";
import GoogleMapsScript from "@/components/google-maps-script";
import Providers from "./providers";
import ClientLayout from "./ClientLayout"; // Import the new Client Component
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
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
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A2E20" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BetaDay" />
        <meta
          name="description"
          content="Enjoy real Naija flavors delivered fast! Order from local chefs & restaurants."
        />
        <link rel="icon" type="image/svg+xml" href="/icons/betaday-icon.svg" />
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="16x16"
          href="/icons/betaday-icon.svg"
        />
        <link rel="apple-touch-icon" sizes="192x192" href="/192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/512x512.png" />
      </head>
      <body
        className={`${dmSans.variable} antialiased bg-white`}
        suppressHydrationWarning
      >
        <GoogleMapsScript />
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
