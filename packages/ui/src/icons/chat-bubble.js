// Adapted from: https://icons.modulz.app

import PropTypes from "prop-types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatBubble = ({ height = 15, width = 15, variant, ...restOfProps }) => (
  <svg
    className="pushable click-target-helper"
    height={height}
    width={width}
    viewBox="0 0 15 15"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M12.5 3h-10A1.5 1.5 0 001 4.5v5A1.5 1.5 0 002.5 11h5a.5.5 0 01.354.146L10 13.293V11.5a.5.5 0 01.5-.5h2A1.5 1.5 0 0014 9.5v-5A1.5 1.5 0 0012.5 3zm-10-1h10A2.5 2.5 0 0115 4.5v5a2.5 2.5 0 01-2.5 2.5H11v2.5a.5.5 0 01-.854.354L7.293 12H2.5A2.5 2.5 0 010 9.5v-5A2.5 2.5 0 012.5 2z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

ChatBubble.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  variant: PropTypes.string
}

export default ChatBubble
