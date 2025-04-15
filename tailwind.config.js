/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your custom color palette
        primary: "#609084",
        secondary: "#BAD8B6",
        thirdly: "#E1EACD",
        light: "#EBEFD6",
        red: "#CC0000",
        green: "#00A010",
        superlight: "#F6F9F4",
        "text-gray": "#808080",
        "background-gray": "#F5F6F9",
        stroke: "#ccc",

        blue: {
          50: "#E1EACD",
          500: "#609084",
        },
        gray: {
          50: "#F6F9F4",
          200: "#ccc",
          400: "#808080",
          500: "#808080",
          700: "#609084",
          800: "#609084",
          900: "#609084",
        },
        green: {
          500: "#00A010",
          600: "#00A010",
        },
        red: {
          600: "#CC0000",
        },
      },
    },
  },
  plugins: [],
};