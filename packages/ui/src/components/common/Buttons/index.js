import HeaderChatIcon from "public/icons/header-chat-icon.svg"
import ChatIcon from "public/icons/profile-chat-icon.svg"
import DollarIcon from "public/icons/profile-dollar-icon.svg"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import React from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const FollowButton = ({ onClick, value, name }) => (
  <button
    value={value}
    onClick={onClick}
    className={classNames(
      value
        ? "border border-white bg-transparent"
        : "border border-transparent bg-black shadow-lg",
      "sm:py:-[0px] flex w-[144px] items-center justify-center rounded-2xl py-3 text-sm font-semibold text-white sm:w-[101px] sm:text-xs md:w-[127px] md:py-[11px] md:text-base lg:w-[183px] lg:py-[19px] lg:text-lg 2xl:w-[223px] 2xl:py-[25px] 2xl:text-2xl"
    )}
  >
    {name}
  </button>
)

export const WhiteButton = ({ name }) => (
  <button className="w-[144px] rounded-2xl border border-transparent bg-white py-3 text-sm font-semibold text-black sm:w-52 md:py-[22px]  md:text-lg">
    {name}
  </button>
)

export const PassesPurpleButton = ({ name, icon }) => (
  <button className="flex w-full items-center justify-center rounded-full border border-solid border-[#BF7AF0] bg-[#BF7AF0] py-[10px] text-base font-semibold text-white shadow-sm lg:hidden">
    {icon && <UnlockLockIcon className="mr-[14px] flex h-6 w-6" />}
    {name}
  </button>
)

export const PassesPinkButton = ({ name, onClick = {} }) => (
  <button
    className="flex w-full items-center justify-center rounded-full border border-solid border-[#C943A8] bg-[#C943A8] py-[10px] text-base font-semibold text-white"
    onClick={onClick}
  >
    {name}
  </button>
)
export const GradientButton = ({ name }) => (
  <button className="flex w-full items-center justify-center rounded  bg-gradient-to-r from-[#598BF4] to-[#B53BEC] py-[10px] text-base font-semibold text-white">
    {name}
  </button>
)

export const CoverButton = ({ name, onClick = {} }) => (
  <button
    className="flex w-full items-center justify-center rounded-[56px] border-none bg-[#FFFEFF]/10 py-[10px] text-base font-semibold text-white shadow-sm hover:bg-[#bf7af0]/10 "
    onClick={onClick}
  >
    {{
      Chat: <ChatIcon className="mr-[6px]" />,
      Tip: <DollarIcon className="mr-[6px]" />
    }[name] || null}
    {name}
  </button>
)

export const PostUnlockButton = ({ name, icon, onClick, value }) => (
  <button
    className="flex w-full items-center justify-center gap-[10px] rounded-[50px] border-none bg-[#9C4DC1] py-[10px] text-base font-medium text-white shadow-sm"
    value={value}
    onClick={onClick}
  >
    {icon && <UnlockLockIcon className="flex h-6 w-6" />}
    {name}
  </button>
)

export const HeaderChatButton = ({ name }) => (
  <button className="flex h-[49px] w-full min-w-[105px] items-center justify-center gap-[10px] rounded-md border border-transparent bg-[#1b141d]/50 text-base font-semibold text-white ">
    <HeaderChatIcon className="" />
    {name}
  </button>
)
