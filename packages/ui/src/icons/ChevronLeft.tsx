import React from "react"

type ChevronLeftProps = {
  className: string
  width: string
  height: string
}

export const ChevronLeft: React.FC<ChevronLeftProps> = ({
  className,
  width,
  height
}: ChevronLeftProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 16 22"
      fill="none"
      height={height}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 1.18c-.635-.426-1.634-.403-2.23.05l-11.843 9c-.57.433-.57 1.107 0 1.54l11.842 9c.597.453 1.596.476 2.232.05.636-.424.668-1.136.072-1.59L4.243 11l10.83-8.23c.596-.454.564-1.166-.072-1.59Z"
        fill="#fff"
        fillOpacity=".8"
      />
    </svg>
  )
}
