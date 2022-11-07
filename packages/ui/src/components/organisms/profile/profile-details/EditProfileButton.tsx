import { Dispatch, FC, SetStateAction } from "react"

import { Button } from "src/components/atoms/Button"

interface EditProfileButtonProps {
  setEditProfile: Dispatch<SetStateAction<boolean>>
}

export const EditProfileButton: FC<EditProfileButtonProps> = ({
  setEditProfile
}) => (
  <Button
    className="hidden px-4 md:block"
    onClick={() => setEditProfile(true)}
    variant="pink-outline"
  >
    Edit profile
  </Button>
)
