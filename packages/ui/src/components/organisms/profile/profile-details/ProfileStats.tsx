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
    <ProfileStatItemDesktop stat={numPosts?.toString()} label="POSTS" />
    <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemDesktop
      stat={compactNumberFormatter(likes || 0)}
      label="LIKES"
    />
  </div>
)

export const ProfileStatsMobile: FC<ProfileStatsProps> = ({
  numPosts,
  likes
}) => (
  <div className="align-center grid grid-cols-3 items-center text-center">
    <ProfileStatItemMobile stat={numPosts?.toString()} label="POSTS" />
    <div className="mx-[30px] h-[38px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemMobile
      stat={compactNumberFormatter(likes || 0)}
      label="LIKES"
    />
  </div>
)
