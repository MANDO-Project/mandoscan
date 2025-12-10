/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'mando-tool',
    // output: 'export', // Commented out - app needs server-side features (API routes)
    images: {
        unoptimized: true,
    },

    // Explicitly expose environment variables for Amplify deployment
    // env: {
    //     NEXT_PUBLIC_SCAN_API_BASE_URL: process.env.NEXT_PUBLIC_SCAN_API_BASE_URL,
    // },

    webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
