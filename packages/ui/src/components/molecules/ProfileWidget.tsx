import { ListMemberDto, UserDisplayInfoDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"

import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { CheckVerified } from "src/icons/CheckVerified"

type ProfileWidgetProps = {
  user: UserDisplayInfoDto | ListMemberDto
  isCreator?: boolean
}

export const ProfileWidget: FC<ProfileWidgetProps> = ({
  user,
  isCreator = true
}) => {
  return (
    <Link href={`/${user.username}`}>
      <div className="flex items-center">
        <ProfileImage key={user.userId} type="thumbnail" userId={user.userId} />
        <div className="ml-3 flex flex-col">
          <span className="flex flex-row items-center text-sm font-medium leading-6 text-white lg:text-lg">
            {user.displayName}
            {isCreator && (
              <span className="ml-2 min-h-[18px] min-w-[18px]">
                <CheckVerified height={18} width={18} />
              </span>
            )}
          </span>
          <span className="text-xs font-medium leading-6 text-gray-400">
            @{user.username}
          </span>
        </div>
      </div>
    </Link>
  )
}
