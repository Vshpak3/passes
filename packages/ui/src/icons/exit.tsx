// Adapted from: https://help.twitter.com/en/managing-your-account/about-twitter-verified-accounts

export const Exit = ({
  width = 15,
  height = 15,
  ...restOfProps
}: {
  height?: number
  width?: number
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M3 1a1 1 0 00-1 1v11a1 1 0 001 1h7.5a.5.5 0 000-1H3V2h7.5a.5.5 0 000-1H3zm9.604 3.896a.5.5 0 00-.708.708L13.293 7H6.5a.5.5 0 000 1h6.793l-1.397 1.396a.5.5 0 00.708.708l2.25-2.25a.5.5 0 000-.708l-2.25-2.25z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)
