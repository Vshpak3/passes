import { UserDisplayInfoDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"

type ProfileWidgetProps = {
  user: Pick<UserDisplayInfoDto, "userId" | "username" | "displayName">
  isCreator?: boolean
  linked?: boolean
}

export const ProfileWidget: FC<ProfileWidgetProps> = ({
  user,
  isCreator = true,
  linked = true
}) => {
  const { userId, username, displayName } = user
  const component = (
    <div className="flex w-full items-center gap-[10px]">
      <ProfileImage key={userId} type="thumbnail" userId={userId} />
      <NameDisplay
        displayName={displayName}
        displayNameClassName="font-medium"
        horizontal={false}
        isCreator={isCreator}
        username={username}
      />
    </div>
  )

  return linked ? (
    <Link className="w-full" href={`/${username}`}>
      {component}
    </Link>
  ) : (
    component
  )
}
