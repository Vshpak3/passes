import { FC } from "react"

import { compactNumberFormatter } from "src/helpers/formatters"
import {
  ProfileStatItemDesktop,
  ProfileStatItemMobile
} from "./ProfileStatsItem"

interface ProfileStatsProps {
  numPosts?: number
  likes?: number
}

export const ProfileStatsDesktop: FC<ProfileStatsProps> = ({
  numPosts,
  likes
}) => (
  <div className="flex items-center">
    <ProfileStatItemDesktop label="POSTS" stat={numPosts?.toString()} />
    <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemDesktop
      label="LIKES"
      stat={compactNumberFormatter(likes || 0)}
    />
  </div>
)

export const ProfileStatsMobile: FC<ProfileStatsProps> = ({
  numPosts,
  likes
}) => (
  <div className="align-center grid grid-cols-3 items-center text-center">
    <ProfileStatItemMobile label="POSTS" stat={numPosts?.toString()} />
    <div className="mx-[30px] h-[38px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemMobile
      label="LIKES"
      stat={compactNumberFormatter(likes || 0)}
    />
  </div>
)
