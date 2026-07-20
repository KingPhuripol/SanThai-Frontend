/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/library", destination: "/marketplace", permanent: false },
      { source: "/library/:path*", destination: "/marketplace", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "shqgmstbrwkxycyellgn.supabase.co" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "backend-two-tau-19.vercel.app" },
      { protocol: "https", hostname: "backend-570xoumhb-kingphuripols-projects.vercel.app" },
    ],
  },
};

export default nextConfig;
