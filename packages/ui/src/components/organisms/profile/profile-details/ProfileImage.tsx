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

  const imagePath = (userId: string) => {
    if (type === "image") {
      return ContentService.profileImagePath(userId)
    } else if (type === "thumbnail") {
      return ContentService.profileThumbnailPath(userId)
    }
  }

  useEffect(() => {
    setLoaded(profileImages.has(userId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    <div
      className={classNames({
        "h-[50px] w-[50px] shrink-0 select-none overflow-hidden rounded-full bg-gray-900":
          type === "thumbnail",
        "relative h-[80px] w-[80px] cursor-pointer select-none overflow-hidden rounded-full bg-gray-900 drop-shadow-profile-photo md:col-span-1 md:h-[138px] md:w-[138px] md:border-2 md:border-black":
          type === "image"
      })}
      onClick={onClick}
    >
      <img
        alt=""
        className="h-full w-full object-cover object-center"
        src="/img/profile/default-profile-image.svg"
        style={loaded || override ? { display: "none" } : {}}
      />
      <img
        alt=""
        className="h-full w-full object-cover object-center"
        onLoad={() => {
          profileImages.add(userId)
          setLoaded(true)
        }}
        src={override ? override : imagePath(userId)}
      />
    </div>
  )
}
