import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // or, for older Next.js versions:
    // domains: ["res.cloudinary.com"],
  },
  // Do not fail the production build on ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Do not fail the production build on TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
