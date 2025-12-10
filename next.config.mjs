/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'mando-tool',
    // output: 'export', // Commented out - app needs server-side features (API routes)
    images: {
        unoptimized: true,
    },

    // Explicitly expose environment variables for Amplify deployment
    // env: {
    //     SCAN_API_BASE_URL: process.env.SCAN_API_BASE_URL,
    // },
    // Server-side environment variables (without NEXT_PUBLIC_ prefix)
    // are automatically available in API routes and Server Components
    // when using Amplify Hosting with platform: WEB_COMPUTE

    webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
