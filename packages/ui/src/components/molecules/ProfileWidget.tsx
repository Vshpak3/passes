import { ListMemberDto, UserDisplayInfoDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"

import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
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
      <a>
        <div className="flex items-center">
          <div className="relative">
            <ProfileThumbnail key={user.userId} userId={user.userId} />
          </div>
          <div className="flex flex-col">
            <span className="ml-3 flex flex-row items-center text-lg font-medium leading-6 text-white">
              {user.displayName}
              {isCreator && (
                <span className="ml-2">
                  <CheckVerified height={18} width={18} />
                </span>
              )}
            </span>
            <span className="ml-3 text-xs font-medium leading-6 text-gray-400">
              @{user.username}
            </span>
          </div>
        </div>
      </a>
    </Link>
  )
}
