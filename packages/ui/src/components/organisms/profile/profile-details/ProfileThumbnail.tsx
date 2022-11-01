import { FC, memo } from "react"

import { ContentService } from "src/helpers/content"
import { ProfileImageProps } from "./ProfileImage"

type ProfileThumbnailProps = ProfileImageProps

const ProfileThumbnailUnmemo: FC<ProfileThumbnailProps> = ({ userId }) => (
  <div className="h-[42px] w-[42px] flex-shrink-0 select-none overflow-hidden rounded-full bg-gray-900">
    <img
      className="h-full w-full object-cover object-center"
      src={ContentService.profileThumbnailPath(userId)}
      alt="user profile thumbnail"
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = "/img/profile/default-profile-img.svg"
      }}
    />
  </div>
)

export const ProfileThumbnail = memo(ProfileThumbnailUnmemo)
