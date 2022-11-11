import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { Text } from "src/components/atoms/Text"
import { CheckVerified } from "src/icons/CheckVerified"

interface NameDisplayProps {
  username: string
  displayName: string
  linked?: boolean
  displayNameClassName?: string
  isCreator: boolean
  horizontal?: boolean
  linkedClassName?: string
}

export const NameDisplay: FC<NameDisplayProps> = ({
  username,
  displayName,
  linked = false,
  displayNameClassName = "text-base",
  isCreator,
  horizontal = true,
  linkedClassName = "w-full"
}) => {
  const text = horizontal ? (
    <div className="flex w-full flex-row justify-around truncate">
      <span
        className={classNames(
          "w-full shrink-[1] truncate",
          displayNameClassName
        )}
      >
        {displayName}
      </span>
      <Text
        className="ml-2 w-full shrink-[1] truncate text-gray-500 lg:block"
        fontSize={14}
      >
        {" @" + username}
      </Text>
      {isCreator && (
        <span className="ml-2 min-h-[18px] min-w-[18px]">
          <CheckVerified height={18} width={18} />
        </span>
      )}
    </div>
  ) : (
    <div className="flex w-full flex-col items-center justify-around truncate">
      <div
        className={classNames(
          "flex w-full flex-row truncate",
          displayNameClassName
        )}
      >
        <div className="truncate">{displayName}</div>
        {isCreator && (
          <span className="ml-2 flex min-h-[18px] min-w-[18px] flex-col justify-center pb-[10px]">
            <CheckVerified height={18} width={18} />
          </span>
        )}
      </div>
      <Text className="ml-2 w-full text-gray-500 lg:block" fontSize={14}>
        {" @" + username}
      </Text>
    </div>
  )
  return linked ? (
    <Link
      className={linkedClassName}
      href={`${window.location.origin}/${username}`}
    >
      <span className="flex items-center text-xl">{text}</span>
    </Link>
  ) : (
    text
  )
}
