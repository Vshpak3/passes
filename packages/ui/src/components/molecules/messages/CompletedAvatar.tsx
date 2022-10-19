import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import React, { FC } from "react"
import { NameDisplay } from "src/components/atoms/NameDisplay"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"

interface Props {
  senderId: string
  otherUserDisplayName: string | undefined
  otherUserUsername: string
  user: any
}

export const CompletedAvatar: FC<Props> = ({
  senderId,
  otherUserDisplayName,
  otherUserUsername,
  user
}) => {
  const senderName =
    user.userId === senderId ? user.displayName : otherUserDisplayName
  const senderUsername =
    user.userId === senderId ? user.username : otherUserUsername
  return (
    <div className="flex w-full items-start pr-[10px]">
      <div className="flex items-center pb-[5px]">
        <ProfileThumbnail userId={senderId} />
      </div>

      <div className="flex flex-col items-start pl-3">
        <NameDisplay displayName={senderName} username={senderUsername} />
      </div>
      <div className="flex items-center gap-1 pl-1 pt-1">
        <VerifiedIcon />
        <span className="text-[9.4px] font-medium leading-[11px] text-[#ffff]/50">
          Verified
        </span>
      </div>
    </div>
  )
}
