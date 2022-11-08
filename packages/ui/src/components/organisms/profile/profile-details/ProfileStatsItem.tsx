import { FC } from "react"

interface ProfileStatItemProps {
  stat: string | undefined | null
  label: string
}

export const ProfileStatItem: FC<ProfileStatItemProps> = ({ stat, label }) => (
  <div className="flex items-center justify-center">
    <span className="mr-[6px] text-base font-medium text-passes-white-100">
      {stat ?? 0}
    </span>
    <span className="text-sm font-normal text-passes-white-100/70">
      {label}
    </span>
  </div>
)
