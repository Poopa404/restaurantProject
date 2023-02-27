/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html","./js/*.js"],
  theme: {
    fontFamily: {
      "sweed-display": ["Montserrat", "sans-serif"],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      "sweed-gray": "#151515",
      "sweed-gray-light" : "#444444",
      "sweed-dark": "#000000",
      "sweed-color": "#A7D3AA",
      "sweed-color-light": "#A7D3C0",
      "sweed-white": "#EAEAEA",
    },
    extend: {},
  },
  plugins: [],
}
