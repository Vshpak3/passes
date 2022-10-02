import { ListMemberDto } from "@passes/api-client"
import React, { FC } from "react"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import CheckVerified from "src/icons/check-verified"

type ListItemProps = {
  fanInfo: ListMemberDto
  onRemoveFan: (
    event: React.MouseEvent<HTMLSpanElement>,
    user_id: string
  ) => void
  removable: boolean
}

const ListItem: FC<ListItemProps> = ({ fanInfo, onRemoveFan, removable }) => {
  const { displayName, userId } = fanInfo
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center">
        <div className="relative">
          {/* <span className="absolute right-[2px] top-[2px] z-20 h-3 w-3 rounded-full bg-passes-green-100" /> */}
          <div className="absolute right-[-5px] top-[0px] z-20 h-[18px] w-[18px] overflow-hidden rounded-full">
            <CheckVerified height={18} width={18} />
          </div>
          <img
            alt="Name"
            className="h-[50px] w-[50px] rounded-full"
            src="https://cdn1.vectorstock.com/i/1000x1000/32/10/young-man-avatar-character-vector-14213210.jpg"
          />
        </div>
        <span className="ml-3 text-base font-medium leading-6 text-white">
          {displayName}
        </span>
      </div>
      <ConditionRendering condition={removable}>
        <span
          className="duration-400 hover:text-passes-red-100 ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all"
          onClick={(event: React.MouseEvent<HTMLSpanElement>) =>
            onRemoveFan(event, userId)
          }
        >
          Remove
        </span>
      </ConditionRendering>
    </div>
  )
}

export default ListItem
