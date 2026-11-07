/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoBase: '#FFFDF5',
        neoDark: '#121212',
        neoYellow: '#FFE600',
        neoPink: '#FF6584',
        neoPurple: '#A388EE',
        neoGreen: '#00E599',
        neoBlue: '#58C4DC',
        neoOrange: '#FF9F43',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #121212',
        'neo': '4px 4px 0px 0px #121212',
        'neo-lg': '6px 6px 0px 0px #121212',
        'neo-xl': '8px 8px 0px 0px #121212',
        'neo-active': '1px 1px 0px 0px #121212',
        'neo-hover': '5px 5px 0px 0px #121212',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
