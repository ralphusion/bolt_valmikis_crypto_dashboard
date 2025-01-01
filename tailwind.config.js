/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#141413',
        light: '#FAFAF8',
        accent: '#8989DE',
        muted: '#828179',
        card: '#23241F',
        success: '#7EBF8E',
        danger: '#D2886F',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
