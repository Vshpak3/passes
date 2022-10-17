import EditIcon from "public/icons/profile-edit-icon.svg"
import { Dispatch, FC, SetStateAction } from "react"
import { CoverButton } from "src/components/atoms/Button"

interface EditProfileActionProps {
  setEditProfile: Dispatch<SetStateAction<boolean>>
}

export const EditProfileAction: FC<EditProfileActionProps> = ({
  setEditProfile
}) => (
  <div className="absolute top-5 right-5 items-center justify-between md:top-10 md:right-0">
    <CoverButton
      className="hidden px-4 md:block"
      name="Edit profile"
      onClick={() => setEditProfile(true)}
    />
    <button className="block md:hidden" onClick={() => setEditProfile(true)}>
      <EditIcon />
    </button>
  </div>
)
