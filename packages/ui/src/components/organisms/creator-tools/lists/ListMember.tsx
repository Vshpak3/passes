import { ListMemberDto } from "@passes/api-client"
import { FC, memo, useState } from "react"

import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { formatCurrency } from "src/helpers/formatters"

type ListMemberProps = {
  fanInfo: ListMemberDto
  onRemoveFan?: (userId: string) => Promise<void>
  removable: boolean
}

const ListMemberUnmemo: FC<ListMemberProps> = ({
  fanInfo,
  onRemoveFan,
  removable
}) => {
  const [removed, setRemoved] = useState<boolean>(false)
  const { spent, follow, userId } = fanInfo
  return (
    <>
      {!removed && (
        <div className="flex items-center justify-between py-3">
          <div className="flex flex-row gap-[50px]">
            <ProfileWidget user={fanInfo} />
            {!!spent && <span>Spent {formatCurrency(spent)}</span>}
            {!follow && <span className="text-red-500">Not a follower</span>}
          </div>
          {removable && (
            <span
              className="ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all"
              onClick={async () => {
                if (onRemoveFan) {
                  await onRemoveFan(userId)
                }
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

export const ListMember = memo(ListMemberUnmemo)
