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
        scoutGreen: {
          50: '#f6f9f0',
          100: '#e6efd9',
          200: '#d0dfb9',
          300: '#b4cf94',
          400: '#99bc74',
          500: '#81a85a',
          600: '#658645',
          700: '#526b3a',
          800: '#425632',
          900: '#36462b',
        },
        scoutBrown: {
          50: '#faf7f5',
          100: '#f0ebe6',
          200: '#e2d6ce',
          300: '#d1bcb0',
          400: '#be9f90',
          500: '#a68271',
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
          500: '#cfaf75',
          600: '#ba955d',
          700: '#967648',
          800: '#7c603e',
          900: '#654f36',
        },
      },
    },
  },
  plugins: [],
};
export default config;
