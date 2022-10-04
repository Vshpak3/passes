// Adapted from: https://icons.modulz.app

import { FC } from "react"

interface WalletIconProps {
  width?: number
  height?: number
}

const WalletIcon: FC<WalletIconProps> = ({
  width = 15,
  height = 15,
  ...restOfProps
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      fill="currentColor"
      d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
    />
  </svg>
)

export default WalletIcon
