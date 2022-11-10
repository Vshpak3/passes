import { UserApi } from "@passes/api-client"
import classNames from "classnames"
import Link from "next/link"
import { FC, useCallback, useEffect, useState } from "react"

import { Text } from "src/components/atoms/Text"
import { CheckVerified } from "src/icons/CheckVerified"

interface MessagesNameDisplayProps {
  username: string
  displayName: string
  linked?: boolean
  displayNameClassName?: string
  userId: string
}

const user = new UserApi()

export const MessagesNameDisplay: FC<MessagesNameDisplayProps> = ({
  username,
  displayName,
  linked = false,
  displayNameClassName = "text-base",
  userId
}) => {
  const [isCreator, setIsCreator] = useState(false)
  const checkVerified = useCallback(async () => {
    const data = await user.isCreator({
      userId: userId
    })
    setIsCreator(data.value)
  }, [userId])

  useEffect(() => {
    checkVerified()
  }, [checkVerified])
  const text = (
    <div className="flex w-full flex-row items-center justify-around truncate">
      <span className={classNames("w-full", displayNameClassName)}>
        {displayName}
      </span>
      <Text className="ml-2 w-full text-gray-500 lg:block" fontSize={14}>
        {" @" + username}
      </Text>
      {isCreator && (
        <span className="ml-2 min-h-[18px] min-w-[18px]">
          <CheckVerified height={18} width={18} />
        </span>
      )}
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
