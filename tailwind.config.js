/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#081609",
        background: "#f1faf2",
        primary: "#59BE4C",
        secondary: "#8adc90",
        accent: "#70d878",
      },
    },
  },
  plugins: [],
};
