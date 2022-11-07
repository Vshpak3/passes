import React, { FC } from "react"

type ChevronRightProps = {
  className: string
  width: string
  height: string
}

export const ChevronRight: FC<ChevronRightProps> = ({
  className,
  width,
  height
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height={height}
      viewBox="0 0 16 22"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M1 1.18c.635-.426 1.634-.403 2.23.05l11.843 9c.57.433.57 1.107 0 1.54l-11.842 9c-.597.453-1.596.476-2.232.05-.636-.424-.668-1.136-.072-1.59L11.757 11 .927 2.77C.331 2.315.363 1.603 1 1.18Z"
        fill="#fff"
        fillOpacity=".8"
        fillRule="evenodd"
      />
    </svg>
  )
}
