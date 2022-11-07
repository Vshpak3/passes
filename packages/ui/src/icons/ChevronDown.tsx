import classNames from "classnames"
import React, { FC } from "react"

type ChevronDownProps = {
  className?: string
}

export const ChevronDown: FC<ChevronDownProps> = ({ className }) => (
  <svg
    className={classNames("bi bi-chevron-down", className)}
    fill="currentColor"
    height="10"
    viewBox="0 0 16 16"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      fillRule="evenodd"
    />
  </svg>
)
