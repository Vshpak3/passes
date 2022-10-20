import { FC } from "react"
import { Text } from "src/components/atoms/Text"

interface NameDisplayProps {
  username: string
  displayName: string
}

export const NameDisplay: FC<NameDisplayProps> = ({
  username,
  displayName
}) => {
  return (
    <>
      {displayName}
      <Text fontSize={11} className="text-gray-500">
        {" @" + username}
      </Text>
    </>
  )
}
