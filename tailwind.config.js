/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
      },
      colors: {
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'text-main': 'rgb(var(--text-rgb) / <alpha-value>)',
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
