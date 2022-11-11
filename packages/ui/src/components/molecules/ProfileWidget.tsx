import { ListMemberDto, UserDisplayInfoDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"

type ProfileWidgetProps = {
  user: UserDisplayInfoDto | ListMemberDto
  isCreator?: boolean
  linked?: boolean
}

export const ProfileWidget: FC<ProfileWidgetProps> = ({
  user,
  isCreator = true,
  linked = true
}) => {
  const component = (
    <div className="flex w-full items-center gap-[10px]">
      <ProfileImage key={user.userId} type="thumbnail" userId={user.userId} />
      <NameDisplay
        displayName={user.displayName}
        displayNameClassName="font-medium"
        horizontal={false}
        isCreator={isCreator}
        username={user.username}
      />
    </div>
  )

  return linked ? (
    <Link className="w-full" href={`/${user.username}`}>
      {component}
    </Link>
  ) : (
    component
  )
}
