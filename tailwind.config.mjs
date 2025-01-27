/** @type {import('tailwindcss').Config} */

const {heroui} = require("@heroui/react");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   'hero-pattern': "url('/top_backg.svg')"
      // },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [heroui()],
};
