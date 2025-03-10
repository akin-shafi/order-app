/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, //  or 'class' if you want to toggle dark mode manually
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        FF6600: "#FF6600",
        FF8F00: "#FF8F00",
        FFA726: "#FFA726",
        FFF5E6: "#FFF5E6",
        FFE0B2: "#FFE0B2",
        FFCC80: "#FFCC80",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
