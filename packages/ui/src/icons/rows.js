// Adapted from: https://icons.modulz.app

import PropTypes from "prop-types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Rows = ({ width = 15, height = 15, variant, ...restOfProps }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M14 12.85H1v1.3h13v-1.3zm0-4H1v1.3h13v-1.3zm-13-4h13v1.3H1v-1.3zm13-4H1v1.3h13V.85z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

Rows.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  variant: PropTypes.string.isRequired
}

export default Rows
