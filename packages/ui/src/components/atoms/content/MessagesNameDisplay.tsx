import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { Text } from "src/components/atoms/Text"

interface MessagesNameDisplayProps {
  username: string
  displayName: string
  linked?: boolean
  displayNameClassName?: string
}

export const MessagesNameDisplay: FC<MessagesNameDisplayProps> = ({
  username,
  displayName,
  linked = false,
  displayNameClassName = "text-base"
}) => {
  const text = (
    <div className="flex w-full flex-row items-center justify-around truncate">
      <span className={classNames("w-full", displayNameClassName)}>
        {displayName}
      </span>
      <Text className="ml-2 w-full text-gray-500 lg:block" fontSize={14}>
        {" @" + username}
      </Text>
    </div>
  )
  return linked ? (
    <Link href={`${window.location.origin}/${username}`}>
      <span className="flex items-center text-xl">{text}</span>
    </Link>
  ) : (
    text
  )
}
