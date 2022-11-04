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
    className="relative h-[116px] w-[116px] cursor-pointer select-none overflow-hidden rounded-full border-2 border-black bg-gray-900 drop-shadow-profile-photo md:col-span-1 md:flex md:h-[138px] md:w-[138px] md:translate-y-[-75px] md:items-center md:justify-center"
    onClick={onClick}
  >
    <img
      alt=""
      className="object-cover drop-shadow-profile-photo"
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = "/img/profile/default-profile-img.svg"
      }}
      src={override ? override : ContentService.profileThumbnailPath(userId)}
    />
  </div>
)
