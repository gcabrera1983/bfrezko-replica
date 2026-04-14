/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
    // Next.js 15: formato de imagen por defecto
    formats: ['image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 15: configuración experimental si es necesario
  experimental: {
    // Desactivar características experimentales problemáticas
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
