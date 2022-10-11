// Adapted from: https://icons.modulz.app

import { SVGProps } from "react"

export interface CrossProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  alternate?: boolean
}

export const Cross = ({
  alternate = false,
  width = 15,
  height = 15,
  ...restOfProps
}: CrossProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    {alternate ? (
      <path
        d="M11.782 4.032a.575.575 0 10-.813-.814L7.5 6.687 4.032 3.218a.575.575 0 00-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 00.814.814L7.5 8.313l3.469 3.469a.575.575 0 00.813-.814L8.313 7.5l3.469-3.468z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    ) : (
      <path
        d="M12.854 2.854a.5.5 0 00-.708-.708L7.5 6.793 2.854 2.146a.5.5 0 10-.708.708L6.793 7.5l-4.647 4.646a.5.5 0 00.708.708L7.5 8.207l4.646 4.647a.5.5 0 00.708-.708L8.207 7.5l4.647-4.646z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    )}
  </svg>
)
