/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: {
        DEFAULT: '#0A1B52',
        input: {
          bg: {
            DEFAULT: "#FAF0E9",
            disabled: "#c9c5c1"
          }

        }
      },
      accent: {
        2: "#F0406D",
      },
      success: "#068E33",
      failure: "#ff3333",
      ...colors
    }
  },
  plugins: [],
}
