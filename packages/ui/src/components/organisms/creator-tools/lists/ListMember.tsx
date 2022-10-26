import { ListMemberDto } from "@passes/api-client"
import Link from "next/link"
import { FC, useState } from "react"

import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { CheckVerified } from "src/icons/CheckVerified"

type ListMemberProps = {
  fanInfo: ListMemberDto
  onRemoveFan: (userId: string) => Promise<void>
  removable: boolean
}

export const ListMember: FC<ListMemberProps> = ({
  fanInfo,
  onRemoveFan,
  removable
}) => {
  const { displayName, userId, username } = fanInfo
  const [removed, setRemoved] = useState<boolean>(false)
  return (
    <>
      {!removed && (
        <div className="flex items-center justify-between py-3">
          <Link href={`/${username}`}>
            <a>
              <div className="flex items-center">
                <div className="relative">
                  {/* <span className="absolute right-[2px] top-[2px] z-20 h-3 w-3 rounded-full bg-passes-green-100" /> */}
                  <div className="absolute right-[-5px] top-[0px] z-20 h-[18px] w-[18px] overflow-hidden rounded-full">
                    <CheckVerified height={18} width={18} />
                  </div>
                  <ProfileThumbnail userId={fanInfo.userId} />
                </div>
                <span className="ml-3 text-base font-medium leading-6 text-white">
                  {displayName} @{username}
                </span>
              </div>
            </a>
          </Link>
          {removable && (
            <span
              className="duration-400 hover:text-passes-red-100 ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all"
              onClick={async () => {
                await onRemoveFan(userId)
                setRemoved(true)
              }}
            >
              Remove
            </span>
          )}
        </div>
      )}
    </>
  )
}
