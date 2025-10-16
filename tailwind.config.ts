import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        khaki: '#EAE0C8',
        darkBrown: '#4E342E',
        mediumBrown: '#5D4037',
        lightBrown: '#8D6E63',
        beige: '#f5ead6',
        scoutGreen: '#4CAF50',
      },
    },
  },
  plugins: [],
};
export default config;
