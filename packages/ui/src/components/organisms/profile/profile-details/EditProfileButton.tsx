import { Dispatch, FC, SetStateAction } from "react"

import { Button } from "src/components/atoms/Button"

interface EditProfileButtonProps {
  setEditProfile: Dispatch<SetStateAction<boolean>>
}

export const EditProfileButton: FC<EditProfileButtonProps> = ({
  setEditProfile
}) => (
  <Button
    className="block w-[80%] px-4"
    onClick={() => setEditProfile(true)}
    variant="pink-outline"
  >
    Edit profile
  </Button>
)
