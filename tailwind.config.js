/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        label: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'text-main': 'rgb(var(--text-rgb) / <alpha-value>)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 8px rgb(var(--brand-rgb) / 0.3)' },
          '100%': { boxShadow: '0 0 28px rgb(var(--brand-rgb) / 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
