import { UserDisplayInfoDto } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"

import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"

interface UserSearchResultProps extends UserDisplayInfoDto {
  active: boolean
  disabled: boolean
}

export const UserSearchResult: FC<UserSearchResultProps> = ({
  active,
  disabled,
  userId,
  displayName,
  username
}) => {
  return (
    <div
      className={classNames(
        "grid cursor-pointer grid-flow-col grid-rows-2 place-content-start gap-0 py-3 pr-4 text-[#ffffff]/90",
        disabled
          ? "cursor-not-allowed bg-[#1b141d]/100"
          : "hover:bg-[#1b141d]/90",
        { "bg-[#1b141d]/90": active }
      )}
    >
      <div className="col-span-1 row-span-2 flex w-[75px] items-center justify-center">
        <div className="col-span-1 row-span-2 flex w-[75px] items-center justify-center">
          <ProfileThumbnail userId={userId} />
        </div>
      </div>
      <div className="col-start-2 row-span-2 w-full content-start">
        {displayName && (
          <div className="text-[16px] font-medium">{displayName}</div>
        )}
        <div className="text-[12px] text-[#ffffff]/60">@{username}</div>
      </div>
    </div>
  )
}
