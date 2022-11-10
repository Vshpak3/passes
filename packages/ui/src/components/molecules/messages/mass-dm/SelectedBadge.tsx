import DeleteIcon from "public/icons/badge-delete-icon.svg"
import ListIcon from "public/icons/messages-list-icon.svg"
import PassIcon from "public/icons/messages-pass-icon.svg"
import { FC } from "react"

import { formatText } from "src/helpers/formatters"

interface SelectedBadgeProps {
  type: string
  name: string
  removeProp: (id: string) => void
  id: string
}

export const SelectedBadge: FC<SelectedBadgeProps> = ({
  type,
  name,
  removeProp,
  id
}) => {
  return (
    <div className="flex items-start gap-[10px] rounded-md border border-[#2C282D] p-[10px]">
      {type === "pass" ? <PassIcon /> : <ListIcon />}
      <span className="whitespace-pre-wrap text-[16px] font-medium leading-[24px] text-white">
        {formatText(name)}
      </span>
      <DeleteIcon onClick={() => removeProp(id)} />
    </div>
  )
}
