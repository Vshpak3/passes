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
      shouldCloseOnClickOutside={true}
    >
      <div className="flex flex-row justify-center">
        <img
          src={ContentService.profileImagePath(profileUserId)}
          className="min-w-[500px] max-w-[500px] object-cover drop-shadow-profile-photo"
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = "/img/profile/default-profile-img.svg"
          }}
        />
      </div>
    </Modal>
  )
}
