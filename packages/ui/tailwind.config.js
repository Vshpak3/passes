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
        "sidebar-shadow": "0px 0px 2px rgba(255, 255, 255, 0.8)",
        "profile-photo": "0px 4px 4px rgba(0, 0, 0, 0.25)"
      },
      colors: {
        ...radixColors,
        passes: {
          "primary-color": "#9C4DC1",
          "secondary-color": "#BF7AF0",
          "blue-100": "#598BF4",
          "blue-200": "#b3bee799",
          "purple-100": "#B53BEC",
          "pink-100": "#C943A8",
          "dark-100": "#28282C",
          "dark-200": "#2C282D",
          "gray-100": "#A09FA6",
          "white-100": "#ffffff"
        }
      },
      fontFamily: {
        "sans-system": defaultTheme.fontFamily.sans,
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        em: ["Playfair Display", "serif"]
      },
      screens: {
        xxs: "360px",
        xs: "475px",
        "sidebar-collapse": "1240px"
      },
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out"
      }
    }
  },
  plugins: [
    forms,
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp")
  ]
}
