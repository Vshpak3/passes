import { FC } from "react"

interface ProfileStatItemProps {
  stat: string | undefined | null
  label: string
}

export const ProfileStatItem: FC<ProfileStatItemProps> = ({ stat, label }) => (
  <div className="flex items-center justify-center">
    <span className="mr-[6px] text-base font-medium text-white">
      {stat ?? 0}
    </span>
    <span className="text-sm font-normal text-white">{label}</span>
  </div>
)
