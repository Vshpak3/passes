// Adapted from: https://icons.modulz.app

import PropTypes from "prop-types"

const Home = ({ width = 15, height = 15, ...restOfProps }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M7.08.222a.6.6 0 01.84 0l6.75 6.64a.6.6 0 01-.84.856L13 6.902V12.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5V6.902l-.83.816a.6.6 0 11-.84-.856L7.08.222zm.42 1.27L12 5.918V12h-2V8.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V12H3V5.918l4.5-4.426zM7 12h2V9H7v3z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

Home.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
}

export default Home
