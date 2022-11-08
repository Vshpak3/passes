import { FC } from "react"

import { compactNumberFormatter } from "src/helpers/formatters"
import { ProfileStatItem } from "./ProfileStatsItem"

interface ProfileStatsProps {
  numPosts?: number
  likes?: number
}

export const ProfileStats: FC<ProfileStatsProps> = ({ numPosts, likes }) => (
  <div className="flex items-center">
    <ProfileStatItem label="POSTS" stat={numPosts?.toString()} />
    <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItem label="LIKES" stat={compactNumberFormatter(likes || 0)} />
  </div>
)
