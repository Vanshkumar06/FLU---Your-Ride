/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind ko batao ki kahan kahan classes use hongi
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      // FLU ka custom color theme add kar rahe hain
      colors: {
        'flu-yellow': '#F2C464',
        'flu-green': '#34C759',
        'flu-blue': '#3498DB',
      },
      // Custom fonts add kar rahe hain
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}