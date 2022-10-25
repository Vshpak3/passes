import Link from "next/link"
import { FC } from "react"

import { Text } from "src/components/atoms/Text"

interface NameDisplayProps {
  username: string
  displayName: string
  linked?: boolean
}

export const NameDisplay: FC<NameDisplayProps> = ({
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
      <a className="flex items-center">{text}</a>
    </Link>
  ) : (
    text
  )
}
