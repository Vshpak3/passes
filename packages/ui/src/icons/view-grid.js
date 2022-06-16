// Adapted from: https://icons.modulz.app

import PropTypes from "prop-types"

const ViewGrid = ({ width = 15, height = 15, ...restOfProps }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M7 2H1.5a.5.5 0 00-.5.5V7h6V2zm1 0v5h6V2.5a.5.5 0 00-.5-.5H8zM7 8H1v4.5a.5.5 0 00.5.5H7V8zm1 5V8h6v4.5a.5.5 0 01-.5.5H8zM1.5 1A1.5 1.5 0 000 2.5v10A1.5 1.5 0 001.5 14h12a1.5 1.5 0 001.5-1.5v-10A1.5 1.5 0 0013.5 1h-12z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

ViewGrid.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
}

export default ViewGrid
