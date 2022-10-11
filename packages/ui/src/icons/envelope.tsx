import { SVGProps } from "react"

export interface EnvelopeProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  variant?: "gradient" | "solid"
}

// Adapted from: https://icons.modulz.app
export const Envelope = ({
  width = 15,
  height = 15,
  variant,
  ...restOfProps
}: EnvelopeProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    {variant === "gradient" ? (
      <>
        <linearGradient
          id="a"
          gradientUnits="userSpaceOnUse"
          x1={-0.356406}
          x2={10.7904}
          y1={1.7381}
          y2={16.2467}
        >
          <stop offset={0} stopColor="#d6409f" />
          <stop offset={0.510417} stopColor="#ab4aba" />
          <stop offset={1} stopColor="#8e4ec6" />
        </linearGradient>
        <path
          clipRule="evenodd"
          d="M1 2a1 1 0 00-1 1v9a1 1 0 001 1h13a1 1 0 001-1V3a1 1 0 00-1-1zm0 1h13v.925a.448.448 0 00-.241.07L7.5 7.967 1.241 3.995A.448.448 0 001 3.925zm0 1.908V12h13V4.908L7.741 8.88a.45.45 0 01-.482 0z"
          fill="url(#a)"
          fillRule="evenodd"
        />
      </>
    ) : (
      <path
        d="M1 2a1 1 0 00-1 1v9a1 1 0 001 1h13a1 1 0 001-1V3a1 1 0 00-1-1H1zm0 1h13v.925a.448.448 0 00-.241.07L7.5 7.967 1.241 3.995A.448.448 0 001 3.925V3zm0 1.908V12h13V4.908L7.741 8.88a.45.45 0 01-.482 0L1 4.908z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    )}
  </svg>
)
