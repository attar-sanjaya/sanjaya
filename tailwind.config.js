/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-dark': 'rgba(15, 23, 42, 0.4)',
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(var(--brand-rgb) / 0.2)' },
          '100%': { boxShadow: '0 0 20px rgb(var(--brand-rgb) / 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
