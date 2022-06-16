// Adapted from: https://icons.modulz.app

import PropTypes from "prop-types"

const Moment = ({ width = 15, height = 15, ...restOfProps }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <g fill="currentColor">
      <path d="M28 0l6.062 10.5H21.938zM47.799 8.201l-3.138 11.711-8.573-8.573zM56 28l-10.5 6.062V21.938zM47.799 47.799l-11.711-3.138 8.573-8.573zM28 56l-6.062-10.5h12.124zM8.201 47.799l3.138-11.711 8.573 8.573zM0 28l10.5-6.062v12.124zM8.201 8.201l11.711 3.138-8.573 8.573z" />
      <circle cx={28} cy={28} r={13} />
    </g>
  </svg>
)

Moment.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
}

export default Moment
