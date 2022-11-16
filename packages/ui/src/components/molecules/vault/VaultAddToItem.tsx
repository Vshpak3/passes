import AddToIcon from "public/icons/plus-square.svg"
import { FC } from "react"

interface VaultAddToItemProps {
  label: string
  onClick: () => void
}

export const VaultAddToItem: FC<VaultAddToItemProps> = ({ label, onClick }) => (
  <div
    className="flex w-full cursor-pointer items-center rounded p-2 text-base text-[#FFFF] ring-0 hover:bg-[#9C4DC1] focus:shadow-none focus:ring-offset-0"
    onClick={onClick}
  >
    <AddToIcon />
    <div className="ml-3">{label}</div>
  </div>
)
