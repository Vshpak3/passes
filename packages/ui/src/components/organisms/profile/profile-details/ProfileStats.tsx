import { FC } from "react"

import { compactNumberFormatter } from "src/helpers/formatters"
import { ProfileStatItem } from "./ProfileStatsItem"

interface ProfileStatsProps {
  numPosts?: number
  likes?: number
}

export const ProfileStats: FC<ProfileStatsProps> = ({ numPosts, likes }) => (
  <div className="flex items-center">
    {numPosts !== undefined && (
      <ProfileStatItem label="POSTS" stat={compactNumberFormatter(numPosts)} />
    )}
    {numPosts !== undefined && likes !== undefined}
    <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
    {likes !== undefined && (
      <ProfileStatItem label="LIKES" stat={compactNumberFormatter(likes)} />
    )}
  </div>
)
