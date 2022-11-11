import classNames from "classnames"
import { FC, useEffect, useState } from "react"

import { useGlobalCache } from "src/contexts/GlobalCache"
import { ContentService } from "src/helpers/content"

type ProfileImageType = "image" | "thumbnail"
interface ProfileImageProps {
  userId: string
  onClick?: () => void
  override?: string
  type: ProfileImageType
}

export const ProfileImage: FC<ProfileImageProps> = ({
  userId,
  onClick,
  override,
  type
}) => {
  const { profileImages } = useGlobalCache()
  const [loaded, setLoaded] = useState<boolean>(profileImages.has(userId))
  useEffect(() => {
    setLoaded(profileImages.has(userId))
  }, [userId])
  return (
    <div
      className={classNames(
        type === "thumbnail" &&
          "h-[50px] w-[50px] shrink-0 select-none overflow-hidden rounded-full bg-gray-900",
        type === "image" &&
          "relative h-[80px] w-[80px] cursor-pointer select-none overflow-hidden rounded-full bg-gray-900 drop-shadow-profile-photo md:col-span-1 md:h-[138px] md:w-[138px] md:border-2 md:border-black"
      )}
      onClick={onClick}
    >
      <img
        alt=""
        className="h-full w-full object-cover object-center"
        src="/img/profile/default-profile-img.svg"
        style={loaded || override ? { display: "none" } : {}}
      />
      <img
        alt=""
        className="h-full w-full object-cover object-center"
        onLoad={() => {
          profileImages.add(userId)
          setLoaded(true)
        }}
        src={override ? override : ContentService.profileThumbnailPath(userId)}
      />
    </div>
  )
}
