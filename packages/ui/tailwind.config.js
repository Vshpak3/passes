// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const radixColors = require("@radix-ui/colors")

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    screens: {
      xxs: "360px",
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
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
          "primary-color": "#FF51A8", // rename to primary
          "secondary-color": "#9C4DC1", // rename to secondary
          "tertiary-color": "#F65D02", // rename to tertiary
          "dark-gray": "#999999",
          gray: "#2C2E36",
          black: "#12070E",
          "blue-100": "#598BF4", // rename to info
          "purple-100": "#B53BEC",
          "purple-200": "#1A131C",
          "pink-100": "#B52A6F",
          "dark-100": "#28282C",
          "dark-200": "#2C282D",
          "dark-700": "#100C11",
          "gray-100": "#A09FA6",
          "gray-200": "#0E0A0F",
          "gray-300": "#322F33",
          "gray-400": "#767676",
          "gray-200": "#767676",
          "gray-600": "#3E3E44",
          "gray-700": "#34343A",
          "gray-800": "#979797",
          "gray-900": "#D0D5DD",
          success: "#71CB6F"
        }
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
        },
        slidein: {
          from: {
            "margin-left": "-20%"
          },
          to: {
            "margin-left": "100%"
          }
        }
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "slide-in": "2s linear infinite running slidein"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
    require("tailwind-scrollbar-hide"),
    function ({ addVariant }) {
      addVariant("child", "& :first-child")
      addVariant("child-hover", "& :first-child:hover")
    }
  ]
}
