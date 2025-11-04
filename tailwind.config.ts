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
        // Enhanced scout colors
        scoutBrown: {
          50: '#f5f3ef',
          100: '#e8e3d8',
          200: '#d4c4b0',
          300: '#c0a68a',
          400: '#a88968',
          500: '#8b7355',
          600: '#6d5b44',
          700: '#5c4033',
          800: '#3d2817',
          900: '#2b1810',
        },
        scoutKhaki: {
          50: '#faf9f5',
          100: '#f5f1e8',
          200: '#ebe4d4',
          300: '#dfd4ba',
          400: '#cfc0a0',
          500: '#b8a788',
          600: '#9d8d6f',
          700: '#7d6f55',
          800: '#5f5340',
          900: '#3f3829',
        },
      },
      animation: {
        'slide-up': 'slideInUp 0.6s ease-out',
        'slide-down': 'slideInDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 20px rgba(251, 191, 36, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
