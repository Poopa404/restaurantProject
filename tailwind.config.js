/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./html/*.html",
            "./js/*.js",
            "./views/*.ejs"],
  theme: {
    fontFamily: {
      "sweed-display": ["Montserrat", "sans-serif"],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      "sweed-gray": "#151515",
      "sweed-dark": "#101010",
      "sweed-color": "#A7D3AA",
      "sweed-color-light": "#AAF898",
      "sweed-red": "#d46a6a",
      "sweed-white": "#EAEAEA",
      "white" : "#ffffff",
    },
    extend: {},
  },
  plugins: [],
}
