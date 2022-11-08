import { FC } from "react"

import { Button } from "src/components/atoms/button/Button"
import { useFollow } from "src/hooks/profile/useFollow"

interface FollowButtonProps {
  creatorId?: string
  className?: string
  unfollowText?: string
}

export const FollowButton: FC<FollowButtonProps> = ({
  creatorId,
  className,
  unfollowText = "Unfollow"
}) => {
  const { follow, unfollow, isFollowing } = useFollow(creatorId)
  return (
    <Button
      className={className}
      onClick={isFollowing ? unfollow : follow}
      variant={isFollowing ? "pink-outline" : "pink"}
    >
      {isFollowing ? unfollowText : "Follow"}
    </Button>
  )
}
