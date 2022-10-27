import { ListMemberDto, UserDisplayInfoDto } from "@passes/api-client"
import React, { FC } from "react"

import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { CheckVerified } from "src/icons/CheckVerified"

type ProfileWidgetProps = {
  user: UserDisplayInfoDto | ListMemberDto
}

export const ProfileWidget: FC<ProfileWidgetProps> = ({
  user
}: ProfileWidgetProps) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <ProfileThumbnail userId={user.userId} />
      </div>
      <div className="flex flex-col">
        <span className="ml-3 flex flex-row items-center text-lg font-medium leading-6 text-white">
          {user.displayName}
          <span className="ml-2">
            <CheckVerified height={18} width={18} />
          </span>
        </span>
        <span className="ml-3 text-xs font-medium leading-6 text-gray-400">
          @{user.username}
        </span>
      </div>
    </div>
  )
}
