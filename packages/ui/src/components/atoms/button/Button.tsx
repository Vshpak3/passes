import classNames from "classnames"
import { FC, PropsWithChildren } from "react"

import { Text } from "src/components/atoms/Text"

export enum ButtonTypeEnum {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset"
}

export enum ButtonVariant {
  BLACK,
  GRADIENT,
  NONE,
  PINK,
  PINK_OUTLINE,
  PRIMARY
}

interface ButtonProps {
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
  fontSize?: number
  onClick?: () => void
  variant?: ButtonVariant
  active?: boolean
  type?: ButtonTypeEnum
  disabledClass?: string
  big?: boolean
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  icon,
  fontSize = 14,
  onClick,
  variant = ButtonVariant.PINK,
  disabled,
  type = ButtonTypeEnum.BUTTON,
  disabledClass,
  big = false,
  ...restOfProps
}) => {
  let variantClassName = ""
  switch (variant) {
    case ButtonVariant.PRIMARY:
      variantClassName =
        "bg-mauve-mauve12 text-white transition-all active:bg-mauve-mauve1 active:text-mauve-mauve12 border border-transparent active:border-mauve-mauve11 dark:bg-mauveDark-mauve12 dark:text-black dark:active:bg-black dark:active:text-mauveDark-mauve12 dark:border-mauveDark-mauve11"
      break
    case ButtonVariant.GRADIENT:
      variantClassName =
        "text-white bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
      break
    case ButtonVariant.PINK:
      variantClassName =
        "items-center justify-center rounded-lg border border-solid border-passes-pink-100 bg-passes-pink-100 py-2 px-5 text-base font-[500] text-white"
      break
    case ButtonVariant.PINK_OUTLINE:
      variantClassName =
        "text-passes-primary-color max-h-[49px] border border-passes-primary-color py-[10px]"
      break
    case ButtonVariant.BLACK:
      variantClassName =
        "text-white dark:text-white bg-black rounded px-6 py-2 border border-[#3A444C]/30 font-[500]"
      break
    case ButtonVariant.NONE:
      variantClassName = ""
      break
  }
  if (big) {
    fontSize = Math.max(16, fontSize)
  }

  return (
    <button
      className={classNames(
        "relative inline-flex select-none appearance-none items-center justify-center truncate rounded-lg no-underline transition-colors focus:!outline-0 disabled:opacity-75",
        variantClassName,
        className,
        disabled && "cursor-auto border-[#3333]/80 bg-[#3333]/80",
        disabled && disabledClass,
        big && "py-4 px-8"
      )}
      data-focus-ring=""
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...restOfProps}
    >
      <Text
        className="flex items-center space-x-2"
        fontSize={fontSize}
        style={{ lineHeight: 1 }}
      >
        {Boolean(icon) && <span className="mr-2">{icon}</span>}
        {/* {icon} */}
        {children}
      </Text>
    </button>
  )
}
