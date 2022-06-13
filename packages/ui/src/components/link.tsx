import clsx from 'clsx'
import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'

export const A = forwardRef<
  HTMLAnchorElement,
  {
    children: ReactNode
    className?: string
    external?: boolean
    href?: string
    variant?: string
    tabIndex: number
  }
>(
  (
    { children, className, external = true, href, variant, ...restOfProps },
    ref,
  ) => (
    <a
      {...(external && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      ref={ref}
      href={href}
      className={clsx(
        variant === 'blue'
          ? 'text-blue-blue9 no-underline transition-colors hover:underline hover:decoration-blue-blue9 dark:text-blueDark-blue9 dark:hover:decoration-blueDark-blue9'
          : 'text-mauve-mauve11 no-underline transition-colors hover:text-mauve-mauve12 dark:text-mauveDark-mauve11 dark:hover:text-mauveDark-mauve12',
        className,
      )}
      {...restOfProps}
    >
      {children}
    </a>
  ),
)

A.displayName = 'A'

export const Link = ({
  children,
  className = '',
  href,
  variant,
}: {
  children: ReactNode
  className?: string
  href: string
  variant?: string
}) => {
  const [isExternalURL, setIsExternalURL] = useState(true)

  useEffect(() => {
    const checkIsExternalURL = (url: string) => {
      const tmp = document.createElement('a')
      tmp.href = url
      return tmp.host !== window.location.host
    }

    if (!checkIsExternalURL(href)) {
      setIsExternalURL(false)
    }
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
