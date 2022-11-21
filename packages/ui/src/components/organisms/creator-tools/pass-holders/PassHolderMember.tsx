import { PassHolderDto } from "@passes/api-client"
import { FC, memo } from "react"

import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { formatCurrency, getFormattedDate } from "src/helpers/formatters"

type PassHolderMemberProps = {
  passHolder: PassHolderDto
}

const PassHolderMemberUnmemo: FC<PassHolderMemberProps> = ({ passHolder }) => {
  const { holderDisplayName, holderUsername, holderId, spent, expiresAt } =
    passHolder
  const now = new Date()
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-row gap-[50px]">
        {!!holderId && !!holderUsername && !!holderDisplayName ? (
          <ProfileWidget
            user={{
              userId: holderId,
              username: holderUsername,
              displayName: holderDisplayName
            }}
          />
        ) : (
          <>No holder found</>
        )}
        {!!spent && <span>Spent {formatCurrency(spent)}</span>}
        {!!expiresAt &&
          (expiresAt < now ? (
            <span className="text-red-500">
              Expired: {getFormattedDate(expiresAt)}
            </span>
          ) : (
            <span>Expires: {getFormattedDate(expiresAt)}</span>
          ))}
      </div>
    </div>
  )
}

export const PassHolderMember = memo(PassHolderMemberUnmemo)
