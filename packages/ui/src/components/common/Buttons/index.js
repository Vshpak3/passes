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

export const CreateButton = ({ name }) => (
  <button className="flex items-center justify-center rounded-full border border-solid border-[#BF7AF0] bg-[#BF7AF0] py-3 px-12 text-sm font-semibold text-white shadow-sm">
    {name}
  </button>
)
