import { SVGProps } from "react"

export interface MoneyProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

// Adapted from: https://icons.modulz.app
export const Money = ({
  width = 15,
  height = 15,
  ...restOfProps
}: MoneyProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <g clipRule="evenodd" fill="currentColor" fillRule="evenodd">
      <path d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm-1.5 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      <path d="M0 5v14a2 2 0 002 2h20a2 2 0 002-2V5a2 2 0 00-2-2H2a2 2 0 00-2 2zm5.599 14.5H18.4a3 3 0 014.099-4.099V8.6A3 3 0 0118.401 4.5H5.6A3 3 0 011.5 8.599V15.4A3 3 0 015.599 19.5zM3 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm18 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0-15a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM4.5 6a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
    </g>
  </svg>
)
