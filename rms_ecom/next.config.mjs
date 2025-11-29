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
    remotePatterns: (() => {
      const patterns = [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/media/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/media/**',
        },
      ];
      
      // Allow any backend domain from environment variable
      if (process.env.NEXT_PUBLIC_API_URL) {
        try {
          const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
          patterns.push({
            protocol: apiUrl.protocol.replace(':', ''),
            hostname: apiUrl.hostname,
            port: apiUrl.port || undefined,
            pathname: '/media/**',
          });
        } catch (e) {
          // Invalid URL, skip
        }
      }
      
      return patterns;
    })(),
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
