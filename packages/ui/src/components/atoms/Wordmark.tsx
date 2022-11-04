import classNames from "classnames"
import NextLink from "next/link"
import { FC } from "react"

interface WordmarkProps {
  className?: string
  height: number
  width: number
  whiteOnly?: boolean
}

export const Wordmark: FC<WordmarkProps> = ({
  className = "",
  height = 24,
  width = 124,
  whiteOnly = false
}) => (
  <NextLink href="/home">
    <a className={className}>
      <h1
        className={classNames(
          `w-[${width}px] h-[${height}px] font-display text-center text-2xl`,
          whiteOnly ? "text-white" : "text-black dark:text-white"
        )}
      />
    </a>
  </NextLink>
)
