/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Jost"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        gnostic: ['"Cinzel Decorative"', 'serif'],
        space: ['"Space Grotesk"', 'sans-serif']
      },
      colors: {
        magick: {
          100: 'hsl(var(--hue) 100% 90%)',
          200: 'hsl(var(--hue) 100% 80%)',
          300: 'hsl(var(--hue) 100% 70%)',
          400: 'hsl(var(--hue) 100% 60%)',
          500: 'hsl(var(--hue) 90% 50%)',
          600: 'hsl(var(--hue) 90% 40%)',
          700: 'hsl(var(--hue) 90% 30%)',
          800: 'hsl(var(--hue) 80% 20%)',
          900: 'hsl(var(--hue) 80% 15%)',
        }
      }
    }
  },
  plugins: [],
}
