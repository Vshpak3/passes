import NextLink from "next/link"
import PropTypes from "prop-types"
import { forwardRef } from "react"
import { useEffect, useState } from "react"

const A = forwardRef(
  (
    {
      children,
      className = "",
      external = true,
      href,
      variant,
      ...restOfProps
    },
    ref
  ) => (
    <a
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer"
      })}
      ref={ref}
      href={href}
      className={
        (variant === "blue"
          ? "text-blue-blue9 no-underline transition-colors hover:underline hover:decoration-blue-blue9 dark:text-blueDark-blue9 dark:hover:decoration-blueDark-blue9"
          : variant === "underline"
          ? "text-black decoration-mauve-mauve11 decoration-2 transition hover:underline hover:underline-offset-1 dark:text-white dark:decoration-mauveDark-mauve11"
          : "text-mauve-mauve11 no-underline transition-colors hover:text-mauve-mauve12 dark:text-mauveDark-mauve11 dark:hover:text-mauveDark-mauve12") +
        (className && ` ${className}`)
      }
      {...restOfProps}
    >
      {children}
    </a>
  )
)

A.displayName = "A"
A.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  external: PropTypes.bool,
  href: PropTypes.string,
  variant: PropTypes.string
}

const Link = ({ children, className = "", href, variant }) => {
  const [isExternalURL, setIsExternalURL] = useState(true)

  useEffect(() => {
    const checkIsExternalURL = (url) => {
      const tmp = document.createElement("a")
      tmp.href = url
      return tmp.host !== window.location.host
    }

    !checkIsExternalURL(href) && setIsExternalURL(false)
  }, [href])

  return (
    <>
      {isExternalURL ? (
        <A className={className} href={href} variant={variant} tabIndex={0}>
          {children}
        </A>
      ) : (
        <NextLink href={href} passHref>
          <A
            className={className}
            external={false}
            variant={variant}
            tabIndex={0}
          >
            {children}
          </A>
        </NextLink>
      )}
    </>
  )
}

Link.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  variant: PropTypes.string
}

export default Link
