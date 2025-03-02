import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Order Authentic Nigerian Food Online | Beans, Dodo, Semo, Fura Delivery | BetaDay",
  description:
    "Enjoy real Naija flavors delivered fast! Order from local chefs & restaurants offering fresh Amala, Eba, Pounded Yam, Jollof Rice, Dodo, Suya, and more. Same-day delivery of home-style Nigerian meals.",
  keywords: [
    "Nigerian food delivery",
    "order local cuisine online",
    "beans and dodo near me",
    "fresh semo delivery",
    "authentic fura",
    "Lagos food delivery",
    "Traditional home cooking",
    "Naija meals",
    "Yoruba food",
    "Hausa cuisine",
    "Igbo dishes",
    "swallow food delivery",
    "Amala delivery",
    "Eba and Egusi",
    "Pounded Yam with Ogbono",
    "Jollof Rice delivery",
    "Suya night delivery",
    "Akara breakfast",
    "Moi Moi",
    "Pepper Soup",
    "Nkwobi",
    "Buka food online",
    "local restaurants Lagos",
    "authentic Nigerian soups",
    "office lunch delivery Lagos",
    "party jollof catering",
    "fresh fish pepper soup",
    "plantain delivery",
    "agege bread fresh",
    "zobo drink delivery",
    "chin chin snacks",
  ],
  authors: [{ name: "BetaDay", url: "https://betaday.org" }],
  creator: "BetaDay Foods",
  applicationName: "BetaDay Naija Kitchen",
  category: "Nigerian Food Delivery",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Hot Nigerian Food Delivery - Same Day Swallow & Soup | BetaDay",
    description:
      "From Mama Put to your table! Order authentic Efo Riro, Ofada Stew, Fresh Fufu, and Nigerian party dishes with free delivery in Lagos & Abuja.",
    url: "https://betaday.ng",
    siteName: "BetaDay Nigerian Foods",
    images: [
      {
        url: "/og-naija-food.jpg",
        width: 1200,
        height: 630,
        alt: "BetaDay Nigerian Food Spread with Jollof Rice, Suya and Palm Wine",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naija Food Delivery - Get Hot Amala & Ewedu Now | BetaDay",
    description:
      "Craving home food? We deliver authentic Nigerian dishes from local kitchens - Iyan, Egusi, Boli, and fresh Akpu. Download app for ₦500 first order discount!",
    creator: "@BetaDayNaija",
    images: ["/twitter-naija-food.jpg"],
  },
  metadataBase: new URL("https://betaday.ng"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains if needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
