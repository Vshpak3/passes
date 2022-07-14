// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const radixColors = require("@radix-ui/colors")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const forms = require("@tailwindcss/forms")

module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,tsx,jsx}",
    "./**/*.{html,js,ts,tsx,jsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/containers/**/*.{js,ts,jsx,tsx}",
    "./src/icons/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      dropShadow: {
        "sidebar-shadow": "0px 0px 2px rgba(255, 255, 255, 0.8)"
      },
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
  plugins: [forms, require("daisyui")]
}
