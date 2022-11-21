import classNames from "classnames"
import { Dispatch, FC, SetStateAction } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"

interface EditProfileButtonProps {
  setEditProfile: Dispatch<SetStateAction<boolean>>
}

export const EditProfileButton: FC<EditProfileButtonProps> = ({
  setEditProfile
}) => (
  <Button
    className={classNames(
      "block !rounded-md",
      "h-[25px] w-[88px] !px-0 md:h-[36px] md:w-[98px]"
    )}
    onClick={() => setEditProfile(true)}
    variant={ButtonVariant.PINK_OUTLINE}
  >
    Edit profile
  </Button>
)
