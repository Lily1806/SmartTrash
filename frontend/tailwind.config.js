/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        waste: {
          organic:   "#4CAF50",
          plastic:   "#2196F3",
          paper:     "#FF9800",
          metal:     "#9E9E9E",
          glass:     "#00BCD4",
          hazardous: "#F44336",
        }
      }
    }
  },
  plugins: []
}
