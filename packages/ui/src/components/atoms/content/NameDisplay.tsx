import classNames from "classnames"
import Link from "next/link"
import CheckVerified from "public/icons/check-verified.svg"
import { FC } from "react"

import { Text } from "src/components/atoms/Text"

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
    <div className="flex w-full flex-row items-center justify-start gap-x-[4px] truncate">
      <span
        className={classNames(
          "w-full max-w-max truncate",
          displayNameClassName
        )}
      >
        {displayName}
      </span>
      <Text
        className=" w-full max-w-max truncate text-gray-500 lg:block"
        fontSize={14}
      >
        {" @" + username}
      </Text>
      {isCreator && (
        <span className="max-h-[18px] min-h-[18px] min-w-[18px] max-w-[18px]">
          <CheckVerified height={18} width={18} />
        </span>
      )}
    </div>
  ) : (
    <div className="flex w-full flex-col items-center justify-start truncate">
      <div
        className={classNames(
          "flex w-full flex-row truncate md:gap-x-[4px]",
          displayNameClassName
        )}
      >
        <div className="flex truncate md:mb-1">
          <div className="truncate">{displayName}</div>
          {isCreator && (
            <span className="ml-1 flex max-h-[18px] min-h-[18px] min-w-[18px] max-w-[18px] flex-col items-center justify-center">
              <CheckVerified />
            </span>
          )}
        </div>
      </div>
      <Text className="w-full text-gray-500 lg:block" fontSize={14}>
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
