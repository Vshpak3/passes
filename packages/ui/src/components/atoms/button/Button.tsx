import classNames from "classnames"
import { FC, PropsWithChildren } from "react"

import { Text } from "src/components/atoms/Text"

export enum ButtonTypeEnum {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset"
}

type ButtonVariant =
  | "black"
  | "gradient"
  | "gray"
  | "pink-outline"
  | "pink"
  | "primary"
  | "purple-light"
  | "purple"

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
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  icon,
  fontSize = 14,
  onClick,
  variant,
  disabled,
  type,
  disabledClass,
  ...restOfProps
}) => {
  let variantClassName = ""
  switch (variant) {
    case "primary":
      variantClassName =
        "bg-mauve-mauve12 text-white transition-all active:bg-mauve-mauve1 active:text-mauve-mauve12 border border-transparent active:border-mauve-mauve11 dark:bg-mauveDark-mauve12 dark:text-black dark:active:bg-black dark:active:text-mauveDark-mauve12 dark:border-mauveDark-mauve11"
      break
    case "gradient":
      variantClassName =
        "text-white bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
      break
    case "pink":
      variantClassName =
        "flex w-full items-center justify-center rounded-lg border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white"
      break
    case "purple":
      variantClassName =
        "text-white dark:text-white border-passes-primary-color bg-passes-primary-color dark:bg-purpleDark-purple3 dark:hover:bg-purpleDark-purple4 dark:border-purpleDark-purple6 border-purple-purple6 border"
      break
    case "purple-light":
      variantClassName =
        "text-white dark:text-white border-passes-primary-color bg-passes-primary-color dark:bg-passes-primary-color dark:border-passes-primary-color border"
      break
    case "pink-outline":
      variantClassName =
        "text-passes-primary-color max-h-[49px] border border-passes-primary-color"
      break
    case "gray":
      variantClassName =
        "text-white dark:text-white bg-white/[0.15] py-1.5 px-6 rounded-[56px]"
      break
    case "black":
      variantClassName =
        "text-white dark:text-white bg-black rounded px-6 py-2 border border-[#3A444C]/30 font-bold"
      break
  }

  return (
    <button
      className={classNames(
        "relative inline-flex select-none appearance-none items-center justify-center truncate rounded-lg px-4 py-3 no-underline transition-colors disabled:opacity-75 xs:px-3 xs:py-2",
        variantClassName,
        className,
        disabled && "cursor-auto border-[#3333]/80 bg-[#3333]/80",
        disabled && disabledClass
      )}
      data-focus-ring=""
      disabled={disabled}
      onClick={onClick}
      role="button"
      tabIndex={0}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type={type}
      {...restOfProps}
    >
      <Text
        className="flex items-center space-x-2"
        fontSize={fontSize}
        style={{ lineHeight: 1 }}
      >
        {icon}
        {children}
      </Text>
    </button>
  )
}
