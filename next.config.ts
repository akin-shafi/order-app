/* eslint-disable import/no-anonymous-default-export */
// next.config.ts
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default async (phase: string): Promise<NextConfig> => {
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    const withPWA = (await import("@ducanh2912/next-pwa")).default({
      dest: "public",
      register: true,
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};