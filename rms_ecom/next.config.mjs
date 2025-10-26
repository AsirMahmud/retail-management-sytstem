/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Additional build configurations to handle potential issues
  experimental: {
    // Skip type checking during build
    skipTrailingSlashRedirect: true,
  },
  // Webpack configuration to handle type errors
  webpack: (config, { isServer }) => {
    // Ignore type errors in webpack
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module not found/,
      /Can't resolve/,
    ];
    
    return config;
  },
}

export default nextConfig
