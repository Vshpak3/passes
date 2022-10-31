import { FC } from "react"

interface ProfileStatItemProps {
  stat: string | undefined | null
  label: string
}

export const ProfileStatItemDesktop: FC<ProfileStatItemProps> = ({
  stat,
  label
}) => (
  <div className="flex items-center justify-center">
    <span className="mr-[6px] text-base font-medium text-passes-white-100">
      {stat ?? 0}
    </span>
    <span className="text-sm font-normal text-passes-white-100/70">
      {label}
    </span>
  </div>
)

export const ProfileStatItemMobile: FC<ProfileStatItemProps> = ({
  stat,
  label
}) => (
  <div className="grid grid-rows-2">
    <span className="text-[14px] font-medium text-passes-white-100">
      {stat ?? 0}
    </span>
    <span className="text-[12px] font-normal text-passes-white-100/60">
      {label}
    </span>
  </div>
)
