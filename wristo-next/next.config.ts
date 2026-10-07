import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/watches/:id((?!^$|gender|brand|category|sort|price|movement).+)",
        destination: "/product/:id",
      },
      {
        source: "/catalog/:id",
        destination: "/product/:id",
      },
    ];
  },
};

export default nextConfig;
