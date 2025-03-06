import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.com", // Allows any .com domain (e.g., goldencrustbakery.com)
        port: "", // Optional, leave empty unless specific port needed
        pathname: "/**", // Allows any path
      },
      {
        protocol: "https",
        hostname: "*.org", // Add other TLDs if needed
        port: "",
        pathname: "/**",
      },
    ],
  },
};


export default nextConfig;

