import { SVGProps } from "react"

interface CheckVerifiedProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

// Adapted from: https://help.twitter.com/en/managing-your-account/about-twitter-verified-accounts
export const CheckVerified = ({
  width = 15,
  height = 15,
  ...restOfProps
}: CheckVerifiedProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <linearGradient
      id="a"
      gradientUnits="userSpaceOnUse"
      x1={1}
      x2={23}
      y1={1}
      y2={22}
    >
      <stop offset={0} stopColor="#d6409f" />
      <stop offset={0.510417} stopColor="#ab4aba" />
      <stop offset={1} stopColor="#8e4ec6" />
    </linearGradient>
    <rect fill="#fff" height={12} rx={6} width={12} x={6} y={6} />
    <path
      d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25a3.606 3.606 0 00-1.336-.25c-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5a.749.749 0 01-1.041.208l-.115-.094-2.415-2.415a.749.749 0 111.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 011.25.833z"
      fill="url(#a)"
    />
  </svg>
)
