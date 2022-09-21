// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const radixColors = require("@radix-ui/colors")

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "pass-gradient": "url('/img/gradient_pass.png')"
      },
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
          "dark-500": "#191919",
          "dark-700": "#100C11",
          "gray-100": "#A09FA6",
          "gray-200": "#0E0A0F",
          "gray-300": "#322F33",
          "gray-400": "#767676",
          "green-100": "#7AF086",
          green: "#71CB6F",
          red: "#ED6B66"
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
    require("daisyui"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
    function ({ addVariant }) {
      addVariant("child", "& :first-child")
      addVariant("child-hover", "& :first-child:hover")
    }
  ]
}
