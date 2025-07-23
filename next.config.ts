import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Remove ignoreBuildErrors to catch TypeScript issues during build
    // ignoreBuildErrors: true,
  },
  eslint: {
    // Remove ignoreDuringBuilds to catch ESLint issues during build  
    // ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
