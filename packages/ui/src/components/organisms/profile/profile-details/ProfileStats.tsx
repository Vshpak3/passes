import { FC } from "react"
import { compactNumberFormatter } from "src/helpers/formatters"

interface ProfileStatItemMobileProps {
  stat: any
  label: any
}

const ProfileStatItemMobile: FC<ProfileStatItemMobileProps> = ({
  stat,
  label
}) => (
  <div className="grid grid-rows-2">
    <span className="text-[14px] font-medium text-passes-white-100">
      {stat ?? "-"}
    </span>
    <span className="text-[12px] font-normal text-passes-white-100/60">
      {label ?? "-"}
    </span>
  </div>
)

interface ProfileStatsMobileProps {
  numPosts: number
  likes: number
}

export const ProfileStatsMobile: FC<ProfileStatsMobileProps> = ({
  numPosts,
  likes
}) => (
  <div className="align-center grid grid-cols-3 items-center text-center">
    <ProfileStatItemMobile stat={numPosts} label="POSTS" />
    <div className="mx-[30px] h-[38px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemMobile stat={compactNumberFormatter(likes)} label="LIKES" />
  </div>
)
