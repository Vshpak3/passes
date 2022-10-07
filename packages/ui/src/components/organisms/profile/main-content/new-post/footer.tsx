import { FC } from "react"

interface FooterProps {
  disableForm?: boolean
}

export const Footer: FC<FooterProps> = ({ disableForm }) => {
  return (
    <div className="flex w-full items-center justify-end gap-[10px] p-0 pt-6">
      <span>
        <button
          type="submit"
          disabled={disableForm}
          className="flex w-full items-center justify-center rounded-[50px] bg-passes-pink-100 px-[30px] py-[10px] text-base font-bold text-[#ffffff]/90"
        >
          Post
        </button>
      </span>
    </div>
  )
}
