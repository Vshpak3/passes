const defaultTheme = require("tailwindcss/defaultTheme")
const radixColors = require("@radix-ui/colors")
const forms = require("@tailwindcss/forms")

module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/containers/**/*.{js,ts,jsx,tsx}",
    "./src/icons/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: radixColors,
      fontFamily: {
        "sans-system": defaultTheme.fontFamily.sans,
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        em: ["Playfair Display", "serif"]
      },
      screens: {
        xxs: "360px",
        xs: "475px"
      }
    }
  },
  plugins: [forms]
}
