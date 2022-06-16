// Adapted from: https://icons.modulz.app

import PropTypes from "prop-types"

const IdCard = ({ width = 15, height = 15, ...restOfProps }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M14 11V4H1v7h13zm1-7v7a1 1 0 01-1 1H1a1 1 0 01-1-1V4a1 1 0 011-1h13a1 1 0 011 1zM2 5.25A.25.25 0 012.25 5h3.5a.25.25 0 01.25.25v4.5a.25.25 0 01-.25.25h-3.5A.25.25 0 012 9.75v-4.5zM7.5 7a.5.5 0 000 1h3a.5.5 0 000-1h-3zM7 9.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM7.5 5a.5.5 0 000 1h4a.5.5 0 000-1h-4z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

IdCard.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
}

export default IdCard
