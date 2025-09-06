import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // CORS headers for REST API client
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['supabase.co'],
  },

  // Environment variables for Supabase and API
  env: {
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },

  // Static export settings if needed
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // Compression and performance
  compress: true,

  // TypeScript settings
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint settings
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Redirects for API routes
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/api/docs',
        permanent: false,
      },
    ];
  },

  // Rewrites for SPA behavior
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
