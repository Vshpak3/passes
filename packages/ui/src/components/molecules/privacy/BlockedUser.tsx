import { FollowApi, ListMemberDto } from "@passes/api-client"
import React, { useState } from "react"
import { Button } from "src/components/atoms/Button"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"

interface BlockedUserProps {
  blockedUser: ListMemberDto
}

const api = new FollowApi()
export const BlockedUser = ({ blockedUser }: BlockedUserProps) => {
  const [blocked, setBlocked] = useState<boolean>(true)
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2.5">
        <span className="h-12 w-12 overflow-hidden rounded-full border-2 border-passes-gray-600">
          <ProfileThumbnail userId={blockedUser.userId} />
        </span>
        <span className="text-base font-medium">@{blockedUser.username}</span>
      </div>

      <Button
        variant="pink"
        className="w-auto !px-6"
        tag="button"
        disabledClass="opacity-[0.5]"
        onClick={async () => {
          if (blocked) {
            setBlocked(false)
            await api.unblockFollower({ followerId: blockedUser.userId })
          } else {
            setBlocked(true)
            await api.blockFollower({ followerId: blockedUser.userId })
          }
        }}
      >
        <span>{blocked ? "Unblock" : "Block"}</span>
      </Button>
    </div>
  )
}
