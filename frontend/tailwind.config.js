/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
        height: "height",
      },
      boxShadow: {
        soft: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "inner-lg": "inset 0 4px 8px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
