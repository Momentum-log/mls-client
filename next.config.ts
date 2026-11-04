import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Company pages moved under a language segment; `/` is handled in proxy.ts.
  async redirects() {
    return [
      { source: "/about", destination: "/en/about", permanent: true },
      { source: "/contact", destination: "/en/contact", permanent: true },
    ];
  },
};

export default nextConfig;
