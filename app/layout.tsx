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
  title: "Next.js Starter Template | Modern Web Development",
  description:
    "Professional Next.js starter template with cutting-edge features for modern web development. Includes TypeScript, Tailwind CSS, and optimized SEO configuration.",
  keywords: [
    "Next.js",
    "React",
    "Web Development",
    "Starter Template",
    "TypeScript",
    "Tailwind CSS",
    "SEO Optimization",
    "Modern Web",
    "Frontend Development",
    "JavaScript Framework",
    "SSR",
    "Static Site Generation",
    "Web Performance",
    "Responsive Design",
    "Developer Tools",
    "Code Quality",
    "Web Application",
    "UI/UX",
    "Component Library",
    "Server Components",
    "Frontend Architecture",
    "Web Optimization",
    "Tech Stack",
    "Boilerplate",
    "Enterprise-grade",
    "Open Source",
    "Web Standards",
    "Accessibility",
  ],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name",
  applicationName: "Next.js Starter",
  category: "Technology",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Next.js Starter Template | Modern Web Development",
    description:
      "Professional Next.js starter template with cutting-edge features for modern web development.",
    url: "https://yourwebsite.com",
    siteName: "Next.js Starter",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Starter Template | Modern Web Development",
    description:
      "Professional Next.js starter template with cutting-edge features for modern web development.",
    creator: "@yourtwitterhandle",
    images: ["/twitter-image.jpg"],
  },
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
