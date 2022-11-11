import { ListMemberDto, UserDisplayInfoDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"

type ProfileWidgetProps = {
  user: UserDisplayInfoDto | ListMemberDto
  isCreator?: boolean
}

export const ProfileWidget: FC<ProfileWidgetProps> = ({
  user,
  isCreator = true
}) => {
  return (
    <Link className="w-full" href={`/${user.username}`}>
      <div className="flex w-full items-center">
        <ProfileImage key={user.userId} type="thumbnail" userId={user.userId} />
        <NameDisplay
          displayName={user.displayName}
          displayNameClassName="font-medium"
          horizontal={false}
          isCreator={isCreator}
          username={user.username}
        />
      </div>
    </Link>
  )
}
