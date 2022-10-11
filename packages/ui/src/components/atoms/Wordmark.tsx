import classNames from "classnames"
import NextLink from "next/link"

export const Wordmark = ({
  className = "",
  height = 24,
  width = 124,
  whiteOnly = false
}) => (
  <NextLink href="/home">
    <a className={className}>
      <h1
        className={`w-[${width}px] h-[${height}px] font-display text-center text-2xl ${classNames(
          whiteOnly ? "text-white" : "text-black dark:text-white"
        )}`}
      ></h1>
    </a>
  </NextLink>
)
