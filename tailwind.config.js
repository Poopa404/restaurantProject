/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html","./js/*.js"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      "sweed-gray": "#151515",
      "sweed-dark": "#000000",
      "sweed-green": "#A7D3AA",
      "sweed-white": "#EAEAEA",
    },
    extend: {},
  },
  plugins: [],
}
