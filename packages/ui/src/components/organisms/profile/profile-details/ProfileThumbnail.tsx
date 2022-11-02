import { FC, useState } from "react"

import { useGlobalCache } from "src/contexts/GlobalCache"
import { ContentService } from "src/helpers/content"
import { ProfileImageProps } from "./ProfileImage"

type ProfileThumbnailProps = ProfileImageProps

export const ProfileThumbnail: FC<ProfileThumbnailProps> = ({ userId }) => {
  const { profileImages } = useGlobalCache()
  const [loaded, setLoaded] = useState<boolean>(profileImages.has(userId))
  return (
    <div className="h-[42px] w-[42px] flex-shrink-0 select-none overflow-hidden rounded-full bg-gray-900">
      <img
        alt="user profile thumbnail"
        className="h-full w-full object-cover object-center"
        src="/img/profile/default-profile-img.svg"
        style={loaded ? { display: "none" } : {}}
      />
      <img
        alt="user profile thumbnail"
        className="h-full w-full object-cover object-center"
        onLoad={() => {
          profileImages.add(userId)
          setLoaded(true)
        }}
        src={ContentService.profileThumbnailPath(userId)}
      />
    </div>
  )
}
