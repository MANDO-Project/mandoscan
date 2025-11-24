/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'mando-tool',
    // output: 'export', // Commented out - app needs server-side features (API routes)
    images: {
        unoptimized: true,
    },

    webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
