/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-mode="dark"]'],
  content: ["./src/**/*.{html,js,jsx,md,mdx,ts,tsx}"],
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    extend: {}
  },
  plugins: []
};
