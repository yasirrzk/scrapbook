/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoBase: '#FAF6F0',      // Warm linen / ivory parchment
        neoCard: '#FFFEFC',      // Soft warm milk white
        neoDark: '#221F1B',      // Deep espresso graphite ink
        neoYellow: '#EAC875',    // Warm honey / vintage ochre
        neoPink: '#D87D88',      // Dusty romantic rose / muted blush
        neoPurple: '#9C8EB9',    // Soft dusty wisteria / lavender mauve
        neoGreen: '#8EA48B',     // Muted botanical sage
        neoBlue: '#799BA8',      // French vintage slate blue
        neoOrange: '#D48366',    // Warm terracotta / apricot
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #221F1B',
        'neo': '4px 4px 0px 0px #221F1B',
        'neo-lg': '6px 6px 0px 0px #221F1B',
        'neo-xl': '8px 8px 0px 0px #221F1B',
        'neo-active': '1px 1px 0px 0px #221F1B',
        'neo-hover': '5px 5px 0px 0px #221F1B',
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
