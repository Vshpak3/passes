import { useContext } from "react"

import { MainContext } from "../../../../../context/MainContext"

export const Footer = ({ onlyText }) => {
  const { postTime } = useContext(MainContext)

  return (
    <div className="flex w-full items-center justify-end gap-[10px] p-0 pt-6">
      {!onlyText && (
        <span>
          <button className="flex w-full items-center justify-center rounded-[56px] bg-[#FFFEFF]/10 px-[18px] py-[10px] text-base font-bold text-[#ffffff]/90 ">
            Save Draft
          </button>
        </span>
      )}
      <span>
        <button className="flex w-full items-center justify-center rounded-[50px] bg-passes-pink-100 px-[30px] py-[10px] text-base font-bold text-[#ffffff]/90">
          {postTime ? "Schedule Post" : "Post"}
        </button>
      </span>
    </div>
  )
}
