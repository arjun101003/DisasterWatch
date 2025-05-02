/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add this to prevent SSR for pages that use Leaflet
  experimental: {
    serverComponentsExternalPackages: ['leaflet']
  }
}

export default nextConfig
