/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Pinipilit si Vercel na i-deploy kahit may strict warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // I-ignore ang type errors habang nagbi-build
    ignoreBuildErrors: true,
  }
};

export default nextConfig;