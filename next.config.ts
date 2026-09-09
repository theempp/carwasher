import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
