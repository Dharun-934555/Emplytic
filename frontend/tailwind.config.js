/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf7',
          100: '#f9f7f0',
          200: '#f3efe2',
          300: '#e7e0cc',
          400: '#d5c7a6',
        },
        gold: {
          50: '#fffbe6',
          100: '#fff3b0',
          200: '#ffe670',
          300: '#ffd433',
          400: '#ffc107',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
        },
        charcoal: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          800: '#1e2024',
          900: '#141518',
          950: '#0c0d0e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 12px -2px rgba(0, 0, 0, 0.025)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'gold-glow': '0 0 25px -5px rgba(217, 119, 6, 0.3)',
      }
    },
  },
  plugins: [],
}
