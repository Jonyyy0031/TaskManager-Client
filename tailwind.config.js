/* eslint-disable no-undef */
const colors = require("tailwindcss/colors");
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({  
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bbPrimary: "#007bff",
        bbPrimaryTwo: "#28a745",
        bbWhite: "#F2F3F4",
        ...colors,
      },
    },
  },
  plugins: [],
})  ;