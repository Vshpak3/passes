import DeleteIcon from "public/icons/x.svg"
import { FC } from "react"

interface SelectedPassProps {
  title: string
  onClick?: () => void
}

export const SelectedPass: FC<SelectedPassProps> = ({ title, onClick }) => (
  <div className="flex shrink-0 animate-fade-in-down items-center gap-[10px] whitespace-pre-wrap rounded-[56px] border border-passes-dark-200 bg-[#100C11] py-[10px] px-[18px]">
    <span>{title}</span>
    {!!onClick && (
      <button onClick={onClick} type="button">
        <DeleteIcon />
      </button>
    )}
  </div>
)
