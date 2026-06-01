import type { NextConfig } from "next";

const PRODUCT_BACKEND = process.env.PRODUCT_BACKEND_URL ?? "http://localhost:8081";
const ORDER_BACKEND = process.env.ORDER_BACKEND_URL ?? "http://localhost:8082";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/proxy/product/:path*", destination: `${PRODUCT_BACKEND}/:path*` },
      { source: "/proxy/order/:path*", destination: `${ORDER_BACKEND}/:path*` },
    ];
  },
};

export default nextConfig;
