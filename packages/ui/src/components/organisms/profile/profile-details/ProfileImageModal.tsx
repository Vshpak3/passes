import { Dispatch, FC, SetStateAction } from "react"

import { Modal } from "src/components/organisms/Modal"
import { ContentService } from "src/helpers/content"

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
  return (
    <Modal
      isOpen={isProfilePicModalOpen}
      setOpen={setIsProfilePicModalOpen}
      shouldCloseOnClickOutside
    >
      <div className="flex flex-row justify-center">
        <img
          alt=""
          className="min-w-[500px] max-w-[500px] object-cover drop-shadow-profile-photo"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = "/img/profile/default-profile-img.svg"
          }}
          src={ContentService.profileImagePath(profileUserId)}
        />
      </div>
    </Modal>
  )
}
