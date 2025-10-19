/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',  // Verde muy claro
          100: '#dcfce7', // Verde claro
          200: '#bbf7d0', // Lima claro
          300: '#86efac', // Lima
          400: '#4ade80', // Verde brillante
          500: '#22c55e', // Verde
          600: '#16a34a', // Verde medio
          700: '#15803d', // Verde oscuro
          800: '#166534', // Verde muy oscuro
          900: '#14532d', // Verde casi negro
        },
      },
    },
  },
  plugins: [],
}

