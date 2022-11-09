import classNames from "classnames"
import { Dispatch, FC, SetStateAction } from "react"

import { Button } from "src/components/atoms/button/Button"

interface EditProfileButtonProps {
  setEditProfile: Dispatch<SetStateAction<boolean>>
}

export const EditProfileButton: FC<EditProfileButtonProps> = ({
  setEditProfile
}) => (
  <Button
    className={classNames(
      "block !rounded-md px-4",
      "h-[25px] w-[88px] md:h-[36px] md:w-[98px]"
    )}
    onClick={() => setEditProfile(true)}
    variant="pink-outline"
  >
    Edit profile
  </Button>
)
