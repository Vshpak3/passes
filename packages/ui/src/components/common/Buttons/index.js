import React from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const FollowButton = ({ onClick, value, name }) => (
  <button
    value={value}
    onClick={onClick}
    className={classNames(
      !value
        ? "border border-white bg-transparent"
        : "border border-transparent bg-black shadow-lg",
      "w-[144px] rounded-2xl py-3 text-sm font-semibold  text-white sm:w-52 sm:text-lg md:py-[22px]"
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
