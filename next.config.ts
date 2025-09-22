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
};

export default nextConfig;
