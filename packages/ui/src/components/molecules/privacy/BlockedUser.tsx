import { FollowApi, ListMemberDto } from "@passes/api-client"
import React, { FC, useState } from "react"

import { Button } from "src/components/atoms/Button"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"

interface BlockedUserProps {
  blockedUser: ListMemberDto
}

const api = new FollowApi()

export const BlockedUser: FC<BlockedUserProps> = ({ blockedUser }) => {
  const [blocked, setBlocked] = useState<boolean>(true)
  return (
    <div className="flex items-center justify-between">
      <ProfileWidget user={blockedUser} />

      <Button
        className="w-auto !px-6"
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
        variant="pink"
      >
        <span>{blocked ? "Unblock" : "Block"}</span>
      </Button>
    </div>
  )
}
