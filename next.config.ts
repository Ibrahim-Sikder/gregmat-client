import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'gregmatapi.s3.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.gregmat.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
