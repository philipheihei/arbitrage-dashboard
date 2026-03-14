/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polymarket: '#4F46E5',
        predictfun: '#F59E0B',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang TC"', '"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
