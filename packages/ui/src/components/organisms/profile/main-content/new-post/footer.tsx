import { useContext } from "react"
import { MainContext } from "src/context/MainContext"

export const Footer = () => {
  const { postTime } = useContext(MainContext)

  return (
    <div className="flex w-full items-center justify-end gap-[10px] p-0 pt-6">
      <span>
        <button className="flex w-full items-center justify-center rounded-[50px] bg-passes-pink-100 px-[30px] py-[10px] text-base font-bold text-[#ffffff]/90">
          {postTime ? "Schedule Post" : "Post"}
        </button>
      </span>
    </div>
  )
}
