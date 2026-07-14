import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ["var(--font-sarabun)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf8f0",     // Warm cream (marketplace bg)
          100: "#f4eed7",    // Lighter cream for cards
          200: "#e8dac0",    // Border light grey/cream
          300: "#b8981e",    // Gold accent
          400: "#d4af37",    // Main gold
          500: "#f5d98a",    // Light gold
          600: "#5c396d",    // Lighter purple
          700: "#442b53",    // Medium purple
          800: "#362244",    // Darker purple (cards)
          900: "#2B1B41",    // Main deep purple (hero bg)
          950: "#1d122d",    // Darkest purple
        },
        gold: {
          300: "#f5d98a",
          400: "#edc046",
          500: "#d4af37", // primary gold
          600: "#b8981e",
          700: "#8e7315",
        },
        silk: {
          50: "#fdf8f0",
          100: "#faefd8",
          200: "#f5dfa8",
          300: "#edc34e",
        },
        lotus: {
          300: "#f0a0b0",
          400: "#e5788a",
          500: "#c95a6e",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
