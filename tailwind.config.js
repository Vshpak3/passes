module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    borderColor: {
      'blue-solitude': '#F4F5F6',
    },
    backgroundColor: {
      primary: '#0A0029',
      white: '#fff',
      transparent: 'transparent',
    },
    extend: {
      colors: {
        blue: {
          prussian: '#0A0029',
        },
      },
      maxWidth: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
