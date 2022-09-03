import clsx from "clsx"
import HeaderChatIcon from "public/icons/header-chat-icon.svg"
import DollarIcon from "public/icons/profile-dollar-icon.svg"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"

import { classNames } from "../../helpers"
import Text from "./Text"

export enum ButtonTypeEnum {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset"
}
interface IButton {
  bigger?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
  innerClassName?: string
  fontSize?: number
  href?: string
  onClick?: () => void
  style?: React.CSSProperties
  tag?: keyof JSX.IntrinsicElements
  variant: string | "tab"
  active?: boolean
  type?: ButtonTypeEnum
}

interface IGenericButton {
  name: string
  onClick?: () => void
  value?: string
  type?: ButtonTypeEnum
  className?: string
}

export const Button = ({
  bigger = false,
  children,
  className = "",
  icon,
  innerClassName = "",
  fontSize,
  href,
  onClick,
  style = {},
  tag = "a",
  variant,
  disabled,
  type,
  ...restOfProps
}: IButton) => {
  let variantClassName
  let variantInnerClassName
  switch (variant) {
    case "primary":
      variantClassName =
        "bg-mauve-mauve12 text-white transition-all active:bg-mauve-mauve1 active:text-mauve-mauve12 border border-transparent active:border-mauve-mauve11 dark:bg-mauveDark-mauve12 dark:text-black dark:active:bg-black dark:active:text-mauveDark-mauve12 dark:border-mauveDark-mauve11"
      break
    case "gradient":
      variantClassName =
        "text-white bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purpleDark-purple-9 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
      break
    case "vertical-gradient":
      variantClassName =
        "text-white bg-gradient-to-b from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purpleDark-purple-9 dark:to-plumDark-plum9 shadow-md transition-all active:shadow-sm shadow-purple-purple9/30 active:bg-purple-purple9/90"
      break
    case "inner-gradient":
      variantClassName =
        "bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 dark:from-pinkDark-pink9 dark:via-purpleDark-purple-9 dark:to-plumDark-plum9 active:bg-gradient-to-r active:from-black active:via-black active:to-black dark:active:from-white dark:active:via-white dark:active:to-white inline-block rounded-full group cursor-pointer w-full !px-px !py-px hover:from-black hover:to-black hover:via-black dark:hover:to-white dark:hover:via-white dark:hover:from-white"
      variantInnerClassName =
        "text-base px-6 py-4 leading-4 font-medium tracking-wide inline-block whitespace-nowrap transition-color duration-200 w-full flex justify-center bg-mauve-mauve1 dark:bg-black rounded-full group-hover:bg-black dark:group-hover:bg-white group-active:bg-mauve-mauve1 dark:group-active:bg-black"
      break
    case "pink":
      variantClassName =
        "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white"
      break
    case "purple":
      variantClassName =
        "text-white dark:text-white border-passes-secondary-color bg-passes-secondary-color dark:bg-purpleDark-purple3 dark:hover:bg-purpleDark-purple4 dark:border-purpleDark-purple6 border-purple-purple6 border"
      break
    case "white":
      variantClassName =
        "bg-mauveDark-mauve12 text-black max-h-[49px] border border-mauveDark-mauve10 hover:bg-transparent hover:border-white hover:text-white"
      break
    case "white-outline":
      variantClassName = "text-white max-h-[49px] border border-white "
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
      // ref={ref}
      href={href}
      style={style}
      className={
        "relative inline-flex select-none appearance-none items-center justify-center truncate rounded-full px-4 py-3 no-underline transition-colors xs:px-3 xs:py-2" +
        (bigger ? " !px-4 !py-3" : " ") +
        (variantClassName && ` ${variantClassName}`) +
        (className && ` ${className}`) +
        (disabled && " border-[#3333]/80 bg-[#3333]/80 ")
      }
      role={tag === "a" ? "button" : undefined}
      tabIndex={tag === "a" ? 0 : undefined}
      data-focus-ring=""
      disabled={disabled}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type={type}
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
        {icon}
        {children}
      </Text>
      <Text
        style={{ lineHeight: 1 }}
        className={
          "hidden items-center gap-2 space-x-2 xs:flex " +
          (variantInnerClassName && ` ${variantInnerClassName}`) +
          innerClassName
        }
        fontSize={fontSize || 14}
      >
        {icon}
        {children}
      </Text>
    </Tag>
  )
}

export const PassesPurpleButton = ({ name }: IGenericButton) => (
  <button className="flex w-full items-center justify-center rounded-full border border-solid border-passes-secondary-color bg-passes-secondary-color py-[10px] text-base font-semibold text-white shadow-sm lg:hidden">
    <UnlockLockIcon className="mr-[14px] flex h-6 w-6" />
    {name}
  </button>
)

export const PassesPinkButton = ({
  type,
  name,
  onClick,
  className = ""
}: IGenericButton) => {
  return (
    <button
      className={classNames(
        "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white",
        className
      )}
      onClick={onClick}
      type={type}
    >
      {name}
    </button>
  )
}

export const CoverButton = ({ name, onClick }: IGenericButton) => (
  <button
    className="flex w-full items-center justify-center rounded-full border border-solid border-none bg-[#FFFEFF]/10 py-[10px] text-base font-semibold text-white shadow-sm hover:bg-passes-secondary-color/10"
    onClick={onClick}
  >
    {{
      Tip: <DollarIcon className="mr-[6px]" />
    }[name] || null}
    {name}
  </button>
)

export const PostUnlockButton = ({
  name,
  onClick,
  value,
  className = ""
}: IGenericButton) => (
  <button
    className={classNames(
      className,
      "flex w-full items-center justify-center gap-[10px] rounded-[50px] border-none bg-[#9C4DC1] py-[10px] text-base font-medium text-white shadow-sm"
    )}
    value={value}
    onClick={onClick}
  >
    <UnlockLockIcon className="flex h-6 w-6" />
    {name}
  </button>
)

export const HeaderChatButton = ({ name }: IGenericButton) => (
  <button className="flex h-[49px] w-full min-w-[105px] items-center justify-center gap-[10px] rounded-md border border-transparent bg-[#1b141d]/50 text-base font-semibold text-white ">
    <HeaderChatIcon className="" />
    {name}
  </button>
)

export const RoundedIconButton = ({
  children,
  onClick,
  className = ""
}: IButton) => (
  <button
    className={classNames(
      "flex h-[60px] w-[60px] cursor-pointer select-none items-center justify-center rounded-full bg-white p-4",
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
)

export const TabButton = ({
  children,
  onClick,
  active,
  className
}: IButton) => (
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
