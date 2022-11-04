import { FC, SVGProps } from "react"

interface CaretProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  stroke?: string
}

// Adapted from: https://icons.modulz.app
export const Caret: FC<CaretProps> = ({
  width = 15,
  height = 15,
  stroke = "white",
  ...restOfProps
}) => (
  <svg
    fill="none"
    height={height}
    viewBox="0 0 15 15"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M1 0.999999L7 7L13 1"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)
