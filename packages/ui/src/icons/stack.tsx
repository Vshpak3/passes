import { SVGProps } from "react"

export interface StackProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

// Adapted from: https://icons.modulz.app
export const Stack = ({
  width = 15,
  height = 15,
  ...restOfProps
}: StackProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M2 3.5a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-6zm0 7.415A1.5 1.5 0 011 9.5v-6A1.5 1.5 0 012.5 2h10A1.5 1.5 0 0114 3.5v6a1.5 1.5 0 01-1 1.415v.585a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 012 11.5v-.585zM12 11v.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V11h9z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)
