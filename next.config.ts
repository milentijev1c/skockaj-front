import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/pravila-privatnosti",
        destination: "/politika-privatnosti",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
