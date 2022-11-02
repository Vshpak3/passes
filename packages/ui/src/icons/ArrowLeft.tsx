import React from "react"

type ArrowLeftProps = {
  className: string
  width: string
  height: string
}

export const ArrowLeft: React.FC<ArrowLeftProps> = ({
  className,
  width,
  height
}: ArrowLeftProps) => {
  return (
    <svg
      className={className}
      fill="none"
      height={height}
      viewBox="0 0 16 16"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 8H1M1 8L8 15M1 8L8 1"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
