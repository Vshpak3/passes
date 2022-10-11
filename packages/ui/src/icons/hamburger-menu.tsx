import { SVGProps } from "react"

export interface HamburgerProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

// Adapted from: https://icons.modulz.app
export const HamburgerMenu = ({
  width = 15,
  height = 15,
  ...restOfProps
}: HamburgerProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M1.5 3a.5.5 0 000 1h12a.5.5 0 000-1h-12zM1 7.5a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)
