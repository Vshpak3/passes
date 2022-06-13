import clsx from 'clsx'
import type { CSSProperties, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Text } from './text'

interface ButtonProps {
  bigger?: boolean
  children: ReactNode
  className?: string
  innerClassName?: string
  fontSize?: number
  href?: string
  onClick?: (e: React.MouseEvent) => void
  style?: CSSProperties
  tag?: keyof JSX.IntrinsicElements
  variant?: string
}

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      bigger = false,
      children,
      className,
      innerClassName,
      fontSize,
      href,
      onClick,
      style = {},
      tag = 'a',
      variant,
      ...restOfProps
    },
    ref,
  ) => {
    let variantClassName
    switch (variant) {
      case 'primary':
        variantClassName =
          'bg-mauve-mauve12 text-white transition-all active:bg-mauve-mauve1 active:text-mauve-mauve12 active:outline active:outline-mauve-mauve11 dark:bg-mauveDark-mauve12 dark:text-black dark:active:bg-black dark:active:text-mauveDark-mauve12 dark:outline-mauveDark-mauve11'
        break
      case 'gradient':
        variantClassName =
          'text-white bg-gradient-to-r from-pink-pink9 via-purple-purple-9 to-plum-plum9 dark:from-pinkDark-pink9 dark:via-purpleDark-purple-9 dark:to-plumDark-plum9 shadow-md transition-all hover:shadow-sm shadow-purple-purple9/30 hover:bg-purple-purple9/90'
        break
      case 'purple':
        variantClassName =
          'text-black dark:text-white bg-purple-purple3 hover:bg-purple-purple4 dark:bg-purpleDark-purple3 dark:hover:bg-purpleDark-purple4 dark:border-purpleDark-purple6 border-purple-purple6 border'
        break
      case 'white':
        variantClassName =
          'bg-mauveDark-mauve12 text-black border border-mauveDark-mauve10 hover:bg-transparent hover:border-white hover:text-white'
        break
      case 'link-blue':
        variantClassName =
          'text-blue-blue10 transition-colors hover:text-[hsl(208,_100%,_52%)] active:text-[hsl(208,_100%,_45%)] p-1'
        break
      default:
        variantClassName = ''
    }

    const Tag = tag

    return React.createElement(
      Tag,
      {
        ref,
        className: clsx(
          'relative inline-flex select-none appearance-none items-center justify-center truncate rounded-full px-4 py-3 no-underline transition-colors xs:px-3 xs:py-2',
          bigger ? ' !px-4 !py-3' : '',
          variantClassName,
          className,
        ),
        onClick,
        href,
        style,
        role: tag === 'a' ? 'button' : undefined,
        tabIndex: tag === 'a' ? 0 : undefined,
        'data-focus-ring': '',
        ...restOfProps,
      },
      <>
        <Text
          style={{ lineHeight: 1 }}
          className={`flex items-center space-x-2 xs:hidden ${innerClassName}`}
          fontSize={fontSize ?? 16}
        >
          {children}
        </Text>
        <Text
          style={{ lineHeight: 1 }}
          className={`hidden items-center space-x-2 xs:flex ${innerClassName}`}
          fontSize={fontSize ?? 14}
        >
          {children}
        </Text>
      </>,
    )
  },
)

Button.displayName = 'Button'
