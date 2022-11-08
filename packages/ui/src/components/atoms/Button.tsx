// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/no-unused-prop-types */
import classNames from "classnames"
import clsx from "clsx"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { FC, PropsWithChildren } from "react"

import { Text } from "./Text"

export enum ButtonTypeEnum {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset"
}
interface ButtonProps {
  bigger?: boolean
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
  innerClassName?: string
  fontSize?: number
  href?: string
  onClick?: () => void
  tag?: keyof JSX.IntrinsicElements
  variant?: string | "tab"
  active?: boolean
  type?: ButtonTypeEnum
  disabledClass?: string
}

interface GenericButtonProps {
  name: string
  onClick?: () => void
  value?: string
  type?: ButtonTypeEnum
  className?: string
  isDisabled?: boolean
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  bigger = false,
  children,
  className = "",
  icon,
  innerClassName = "",
  fontSize,
  href,
  onClick,
  tag = "a",
  variant,
  disabled,
  type,
  disabledClass,
  ...restOfProps
}) => {
  let variantClassName
  let variantInnerClassName
  switch (variant) {
    case "primary":
      variantClassName =
        "bg-mauve-mauve12 text-white transition-all active:bg-mauve-mauve1 active:text-mauve-mauve12 border border-transparent active:border-mauve-mauve11 dark:bg-mauveDark-mauve12 dark:text-black dark:active:bg-black dark:active:text-mauveDark-mauve12 dark:border-mauveDark-mauve11"
      break
    case "gradient":
      variantClassName =
        "text-white bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
      break
    case "vertical-gradient":
      variantClassName =
        "text-white bg-gradient-to-b from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
      break
    case "inner-gradient":
      variantClassName =
        "bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9 active:bg-gradient-to-r active:from-black active:via-black active:to-black dark:active:from-white dark:active:via-white dark:active:to-white inline-block rounded-lg group cursor-pointer w-full !px-px !py-px hover:from-black hover:to-black hover:via-black dark:hover:to-white dark:hover:via-white dark:hover:from-white"
      variantInnerClassName =
        "text-base px-6 py-4 leading-4 font-medium tracking-wide inline-block whitespace-nowrap transition-color duration-200 w-full flex justify-center bg-mauve-mauve1 dark:bg-black rounded-lg group-hover:bg-black dark:group-hover:bg-white group-active:bg-mauve-mauve1 dark:group-active:bg-black"
      break
    case "inner-gradient-2":
      variantClassName =
        "bg-[linear-gradient(to_right_bottom,#F2BD6C_100%,#BD499B_100%,#A359D5_100%)]"
      variantInnerClassName =
        "text-base px-6 py-4 leading-4 font-medium tracking-wide inline-block whitespace-nowrap transition-color duration-200 w-full flex justify-center bg-mauve-mauve1 dark:bg-black rounded-lg group-hover:bg-black dark:group-hover:bg-white group-active:bg-mauve-mauve1 dark:group-active:bg-black"
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
    case "white":
      variantClassName =
        "bg-mauveDark-mauve12 text-black max-h-[49px] border border-mauveDark-mauve10 hover:bg-transparent hover:border-white hover:text-white"
      break
    case "white-outline":
      variantClassName = "text-white max-h-[49px] border border-white "
      break
    case "pink-outline":
      variantClassName =
        "text-passes-primary-color max-h-[49px] border border-passes-primary-color"
      break
    case "link-blue":
      variantClassName =
        "text-blue-blue10 transition-colors hover:text-[hsl(208,_100%,_52%)] active:text-[hsl(208,_100%,_45%)] p-1"
      break
    case "link-purple":
      variantClassName =
        "text-pink-pink10 transition-colors hover:text-[#C943A8] active:text-[#C943A8] p-1"
      break
    case "gray":
      variantClassName =
        "text-white dark:text-white bg-white/[0.15] py-1.5 px-6 rounded-[56px]"
      break
    default:
      variantClassName = ""
      variantInnerClassName = ""
  }

  const Tag = tag

  return (
    <Tag
      className={
        "relative inline-flex select-none appearance-none items-center justify-center truncate rounded-lg px-4 py-3 no-underline transition-colors disabled:opacity-75 xs:px-3 xs:py-2" +
        (bigger ? " !px-4 !py-3" : " ") +
        (variantClassName && ` ${variantClassName}`) +
        (className && ` ${className} `) +
        (disabled &&
          `${disabledClass ?? " cursor-auto border-[#3333]/80 bg-[#3333]/80"}`)
      }
      data-focus-ring=""
      disabled={disabled}
      href={href}
      onClick={onClick}
      role={tag === "a" ? "button" : undefined}
      tabIndex={tag === "a" ? 0 : undefined}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type={type}
      {...restOfProps}
    >
      <Text
        className={
          "flex items-center space-x-2" +
          (variantInnerClassName && ` ${variantInnerClassName}`) +
          innerClassName
        }
        fontSize={fontSize || 14}
        style={{ lineHeight: 1 }}
      >
        {icon}
        {children}
      </Text>
    </Tag>
  )
}

export const PassesPinkButton: FC<GenericButtonProps> = ({
  type,
  name,
  onClick,
  className = "",
  isDisabled = false
}) => {
  return (
    <button
      className={classNames(
        isDisabled
          ? "flex w-full items-center justify-center rounded-lg border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white opacity-[0.40]"
          : "flex w-full items-center justify-center rounded-lg border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white",
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {name}
    </button>
  )
}

export const ContentUnlockButton: FC<GenericButtonProps> = ({
  name,
  onClick,
  value,
  className = "",
  isDisabled
}) => (
  <button
    className={classNames(
      className,
      "flex w-full items-center justify-center gap-[10px] rounded-[5px] border-none bg-[#B52A6F] py-[9px] text-base font-medium text-white shadow-sm"
    )}
    disabled={!!isDisabled}
    onClick={onClick}
    value={value}
  >
    <UnlockLockIcon className="flex h-6 w-6" />
    {name}
  </button>
)

export const RoundedIconButton: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  className = ""
}) => (
  <button
    className={classNames(
      "flex h-[60px] w-[60px] cursor-pointer select-none items-center justify-center rounded-lg bg-white p-4",
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
)

export const TabButton: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  active,
  className
}) => (
  <button
    className={clsx(
      className,
      "rounded-[56px] bg-[#191919] !py-[10px] !px-[30px] font-bold text-white",
      { ["bg-[#EDEDED] !text-[#000]"]: active }
    )}
    onClick={onClick}
  >
    {children}
  </button>
)
