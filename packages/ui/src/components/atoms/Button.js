import PropTypes from "prop-types"
import { forwardRef } from "react"

import Text from "./Text"

const Button = forwardRef(
  (
    {
      bigger = false,
      children,
      className = "",
      innerClassName = "",
      fontSize,
      href,
      onClick,
      style = {},
      tag = "a",
      variant,
      ...restOfProps
    },
    ref
  ) => {
    let variantClassName
    let variantInnerClassName
    switch (variant) {
      case "primary":
        variantClassName =
          "bg-mauve-mauve12 text-white transition-all active:bg-mauve-mauve1 active:text-mauve-mauve12 border border-transparent active:border-mauve-mauve11 dark:bg-mauveDark-mauve12 dark:text-black dark:active:bg-black dark:active:text-mauveDark-mauve12 dark:border-mauveDark-mauve11"
        break
      case "gradient":
        variantClassName =
          "text-white bg-gradient-to-r from-pink-pink9 via-purple-purple-9 to-plum-plum9 dark:from-pinkDark-pink9 dark:via-purpleDark-purple-9 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
        break
      case "inner-gradient":
        variantClassName =
          "bg-gradient-to-r from-pink-pink9 via-purple-purple-9 to-plum-plum9 dark:from-pinkDark-pink9 dark:via-purpleDark-purple-9 dark:to-plumDark-plum9 active:bg-gradient-to-r active:from-black active:via-black active:to-black dark:active:from-white dark:active:via-white dark:active:to-white inline-block rounded-full group cursor-pointer w-full !px-px !py-px hover:from-black hover:to-black hover:via-black dark:hover:to-white dark:hover:via-white dark:hover:from-white"
        variantInnerClassName =
          "text-base px-6 py-4 leading-4 font-medium tracking-wide inline-block whitespace-nowrap transition-color duration-200 w-full flex justify-center bg-mauve-mauve1 dark:bg-black rounded-full group-hover:bg-black dark:group-hover:bg-white group-active:bg-mauve-mauve1 dark:group-active:bg-black"
        break
      case "purple":
        variantClassName =
          "text-black dark:text-white bg-purple-purple3 hover:bg-purple-purple4 dark:bg-purpleDark-purple3 dark:hover:bg-purpleDark-purple4 dark:border-purpleDark-purple6 border-purple-purple6 border"
        break
      case "white":
        variantClassName =
          "bg-mauveDark-mauve12 text-black border border-mauveDark-mauve10 hover:bg-transparent hover:border-white hover:text-white"
        break
      case "link-blue":
        variantClassName =
          "text-blue-blue10 transition-colors hover:text-[hsl(208,_100%,_52%)] active:text-[hsl(208,_100%,_45%)] p-1"
        break
      default:
        variantClassName = ""
        variantInnerClassName = ""
    }

    const Tag = tag

    return (
      <Tag
        onClick={onClick}
        ref={ref}
        href={href}
        style={style}
        className={
          "relative inline-flex select-none appearance-none items-center justify-center truncate rounded-full px-4 py-3 no-underline transition-colors xs:px-3 xs:py-2" +
          (bigger ? " !px-4 !py-3" : "") +
          (variantClassName && ` ${variantClassName}`) +
          (className && ` ${className}`)
        }
        role={tag === "a" ? "button" : undefined}
        tabIndex={tag === "a" ? 0 : undefined}
        data-focus-ring=""
        {...restOfProps}
      >
        <Text
          style={{ lineHeight: 1 }}
          className={
            "flex items-center space-x-2 xs:hidden " +
            (variantInnerClassName && ` ${variantInnerClassName}`) +
            innerClassName
          }
          fontSize={fontSize || 16}
        >
          {children}
        </Text>
        <Text
          style={{ lineHeight: 1 }}
          className={
            "hidden items-center space-x-2 xs:flex " +
            (variantInnerClassName && ` ${variantInnerClassName}`) +
            innerClassName
          }
          fontSize={fontSize || 14}
        >
          {children}
        </Text>
      </Tag>
    )
  }
)

Button.displayName = "Button"
Button.propTypes = {
  bigger: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  fontSize: PropTypes.number,
  href: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  tag: PropTypes.string,
  variant: PropTypes.string
}

export default Button
