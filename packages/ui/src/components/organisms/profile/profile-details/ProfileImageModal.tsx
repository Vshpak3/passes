import { Dispatch, FC, SetStateAction, useRef } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { ContentService } from "src/helpers/content"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

interface ProfileImageModalProps {
  profileUserId: string
  isProfilePicModalOpen: boolean
  setIsProfilePicModalOpen: Dispatch<SetStateAction<boolean>>
}

export const ProfileImageModal: FC<ProfileImageModalProps> = ({
  profileUserId,
  isProfilePicModalOpen,
  setIsProfilePicModalOpen
}) => {
  const containerEl = useRef(null)
  useOnClickOutside(containerEl, () => {
    setIsProfilePicModalOpen(false)
  })
  return (
    <Dialog
      onClose={() => setIsProfilePicModalOpen(false)}
      open={isProfilePicModalOpen}
      withCloseButton
    >
      <div className="flex flex-row justify-center" ref={containerEl}>
        <img
          alt=""
          className="w-[300px] object-cover drop-shadow-profile-photo md:min-w-[500px] md:max-w-[500px]"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = "/img/profile/default-profile-image.svg"
          }}
          src={ContentService.profileImagePath(profileUserId)}
        />
      </div>
    </Dialog>
  )
}
