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
        scoutGreen: {
          50: '#f6f9f0',
          100: '#e6efd9',
          200: '#d0dfb9',
          300: '#b4cf94',
          400: '#99bc74',
          500: '#81a85a', // Muted Scout Green
          600: '#658645',
          700: '#526b3a',
          800: '#425632',
          900: '#36462b',
        },
        scoutRed: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#faccce',
          300: '#f5a9ac',
          400: '#ee7f83',
          500: '#e55b60', // Soft Red (Pastel Hasduk)
          600: '#d13f44',
          700: '#af2e33',
          800: '#91282c',
          900: '#792528',
        },
        // Enhanced scout colors (Softer/Pastel)
        scoutBrown: {
          50: '#faf7f5',
          100: '#f0ebe6',
          200: '#e2d6ce',
          300: '#d1bcb0',
          400: '#be9f90',
          500: '#a68271', // Soft Earth Brown
          600: '#8d6a59',
          700: '#735548',
          800: '#5e463d',
          900: '#4d3b34',
          950: '#2b211d',
        },
        scoutKhaki: {
          50: '#fcfbf8',
          100: '#f6f1e6',
          200: '#ede0c7',
          300: '#e3cfa8',
          400: '#d9bf8c',
          500: '#cfaf75', // Soft Khaki
          600: '#ba955d',
          700: '#967648',
          800: '#7c603e',
          900: '#654f36',
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
