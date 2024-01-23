/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "primary": "#1E1F22",
      "accentColor1": "#2B2D31",
      "accentColor2": "#5865f2",
      "white": "#FFF",
      "black": "#000"
      
    },
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/src/assets/background.svg')",
      },
    },
  },
  plugins: [],
};
