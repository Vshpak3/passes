import { FC } from "react"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { useFollow } from "src/hooks/profile/useFollow"

interface FollowButtonProps {
  creatorId?: string
  followVariant?: string
  unfollowVariant?: string
  className?: string
  unfollowText?: string
}

export const FollowButton: FC<FollowButtonProps> = ({
  creatorId,
  followVariant = "pink",
  unfollowVariant = "pink-outline",
  className,
  unfollowText = "Unfollow"
}) => {
  const { follow, unfollow, isFollowing } = useFollow(creatorId)
  return (
    <Button
      className={className}
      onClick={isFollowing ? unfollow : follow}
      type={ButtonTypeEnum.SUBMIT}
      variant={isFollowing ? unfollowVariant : followVariant}
    >
      {isFollowing ? unfollowText : "Follow"}
    </Button>
  )
}
