import NextLink from "next/link"
import { FC, forwardRef, PropsWithChildren, useEffect, useState } from "react"

type AProps = {
  children?: React.ReactNode
  className?: string
  external?: boolean
  href?: string
  variant?: string
}

const A = forwardRef<any, AProps>(
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

type LinkProps = {
  className?: string
  href: string
  variant?: string
}

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  children,
  className = "",
  href,
  variant
}) => {
  const [isExternalURL, setIsExternalURL] = useState(true)

  useEffect(() => {
    const checkIsExternalURL = (url: any) => {
      const tmp = document.createElement("a")
      tmp.href = url
      return tmp.host !== window.location.host
    }

    !checkIsExternalURL(href) && setIsExternalURL(false)
  }, [href])

  return (
    <>
      {isExternalURL ? (
        <A className={className} href={href} variant={variant}>
          {children}
        </A>
      ) : (
        <NextLink href={href} passHref>
          <A className={className} external={false} variant={variant}>
            {children}
          </A>
        </NextLink>
      )}
    </>
  )
}
