import { FC } from "react"

import { ContentService } from "src/helpers/content"

export interface ProfileImageProps {
  userId: string
  onClick?: () => void
  override?: string
}

export const ProfileImage: FC<ProfileImageProps> = ({
  userId,
  onClick,
  override
}) => (
  <div
    className="relative h-[80px] w-[80px] cursor-pointer select-none overflow-hidden rounded-full bg-gray-900 drop-shadow-profile-photo md:col-span-1 md:h-[138px] md:w-[138px] md:border-2 md:border-black"
    onClick={onClick}
  >
    <img
      alt="Profile"
      className="object-cover drop-shadow-profile-photo"
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = "/img/profile/default-profile-img.svg"
      }}
      src={override ? override : ContentService.profileThumbnailPath(userId)}
    />
  </div>
)
