import { ListMemberDto } from "@passes/api-client"
import { FC, useState } from "react"

import { ProfileWidget } from "src/components/molecules/ProfileWidget"

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
  const [removed, setRemoved] = useState<boolean>(false)

  return (
    <>
      {!removed && (
        <div className="flex items-center justify-between py-3">
          <ProfileWidget user={fanInfo} />
          {removable && (
            <span
              className="duration-400 hover:text-passes-red-100 ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all"
              onClick={async () => {
                await onRemoveFan(fanInfo.userId)
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
