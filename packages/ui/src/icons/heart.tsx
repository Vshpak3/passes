import { SVGProps } from "react"

export interface HeartProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  variant?: "filled" | "solid"
}

// Adapted from: https://icons.modulz.app
const Heart = ({
  height = 15,
  width = 15,
  variant,
  ...restOfProps
}: HeartProps) => (
  <svg
    className="pushable click-target-helper"
    height={height}
    width={width}
    viewBox="0 0 15 15"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    {variant === "filled" ? (
      <path
        d="M1.352 4.905a3.547 3.547 0 013.541-3.553c1.365 0 1.968.571 2.607 1.583.64-1.012 1.242-1.583 2.607-1.583a3.547 3.547 0 013.54 3.553c0 1.835-1.046 3.6-2.246 5.064-1.137 1.387-2.48 2.582-3.395 3.397l-.173.155a.5.5 0 01-.666 0l-.173-.155c-.916-.815-2.258-2.01-3.395-3.397C2.4 8.505 1.352 6.74 1.352 4.905z"
        className="text-red-red9"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    ) : (
      <path
        d="M4.893 2.352a2.547 2.547 0 00-2.54 2.553c0 1.477.857 3.012 2.02 4.43 1.021 1.246 2.222 2.335 3.127 3.143.905-.808 2.106-1.897 3.127-3.143 1.163-1.418 2.02-2.953 2.02-4.43a2.547 2.547 0 00-2.54-2.553c-.836 0-1.288.291-1.567.606-.261.295-.394.628-.515.932l-.063.156a.5.5 0 01-.924 0l-.063-.156c-.121-.304-.254-.637-.515-.932-.279-.315-.73-.606-1.567-.606zm-3.54 2.553a3.547 3.547 0 013.54-3.553c1.115 0 1.842.408 2.316.943.112.126.208.259.291.39.083-.131.18-.264.291-.39.474-.535 1.2-.943 2.316-.943a3.547 3.547 0 013.54 3.553c0 1.835-1.046 3.6-2.246 5.064-1.137 1.387-2.48 2.582-3.395 3.397l-.173.155a.5.5 0 01-.666 0l-.173-.155c-.916-.815-2.258-2.01-3.395-3.397C2.4 8.505 1.352 6.74 1.352 4.905z"
        className="text-mauve-mauve11 dark:text-mauveDark-mauve11"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    )}
  </svg>
)

export default Heart
