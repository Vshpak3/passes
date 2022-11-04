import Link from "next/link"
import { FC } from "react"

import { Text } from "src/components/atoms/Text"

interface MessagesNameDisplayProps {
  username: string
  displayName: string
  linked?: boolean
}

export const MessagesNameDisplay: FC<MessagesNameDisplayProps> = ({
  username,
  displayName,
  linked = false
}) => {
  const text = (
    <div className="flex flex-row items-center truncate">
      <span>{displayName}</span>
      <Text className="ml-2 text-gray-500 lg:block" fontSize={11}>
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
