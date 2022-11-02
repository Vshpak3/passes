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
    <>
      <span>{displayName}</span>
      <Text fontSize={11} className="ml-2 text-gray-500">
        {" @" + username}
      </Text>
    </>
  )
  return linked ? (
    <Link href={`${window.location.origin}/${username}`}>
      <a className="flex items-center text-xl">{text}</a>
    </Link>
  ) : (
    text
  )
}
