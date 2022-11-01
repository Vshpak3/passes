import { FC, memo, useState } from "react"

import { ContentService } from "src/helpers/content"
import { ProfileImageProps } from "./ProfileImage"

type ProfileThumbnailProps = ProfileImageProps

const ProfileThumbnailUnmemo: FC<ProfileThumbnailProps> = ({ userId }) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  return (
    <div className="h-[42px] w-[42px] flex-shrink-0 select-none overflow-hidden rounded-full bg-gray-900">
      <img
        className="h-full w-full object-cover object-center"
        src={"/img/profile/default-profile-img.svg"}
        alt="user profile thumbnail"
        style={loaded ? { display: "none" } : {}}
      />
      <img
        className="h-full w-full object-cover object-center"
        src={ContentService.profileThumbnailPath(userId)}
        alt="user profile thumbnail"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export const ProfileThumbnail = memo(ProfileThumbnailUnmemo)
