import { SVGProps } from "react"

export interface CaretProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

// Adapted from: https://icons.modulz.app
export const Caret = ({
  width = 15,
  height = 15,
  ...restOfProps
}: CaretProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M1 0.999999L7 7L13 1"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
