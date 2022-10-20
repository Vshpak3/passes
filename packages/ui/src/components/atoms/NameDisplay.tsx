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
      {displayName}
      <Text fontSize={11} className="text-gray-500">
        {" @" + username}
      </Text>
    </>
  )
  return linked ? (
    <a href={`${window.location.origin}/${username}`}>{text}</a>
  ) : (
    text
  )
}
