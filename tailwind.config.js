/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#609084",
        secondary: "#BAD8B6",
        thirdly: "#E1EACD",
        light: "#EBEFD6",
        red: "#CC0000",
        green: "#00A010",
        superlight: "#F6F9F4",
      },
    },
  },
  plugins: [],
};
