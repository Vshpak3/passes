import DeleteIcon from "public/icons/x.svg"
import { FC } from "react"

interface TagProps {
  title: string
  onClick: () => void
}

export const Tag: FC<TagProps> = ({ title, onClick }) => (
  <div className="flex shrink-0 animate-fade-in-down items-center gap-[10px] rounded-[56px] border border-passes-dark-200 bg-[#100C11] py-[10px] px-[18px]">
    <span>{title}</span>
    <button onClick={onClick} type="button">
      <DeleteIcon />
    </button>
  </div>
)
