import { MessageDto, MessagesApi } from "@passes/api-client"
import classNames from "classnames"
import React, { useEffect } from "react"
import { SentStatus } from "src/components/messages/assets/SentStatus"
import { TippedMessage } from "src/components/molecules/direct-messages/completed-tipped-message"

import { Avatar, Content } from "./index"

interface Props {
  isOwnMessage?: boolean
  message?: MessageDto
  lastMessage: boolean
  channelId: string
}
export const ChannelMessage = ({
  message,
  isOwnMessage = false,
  lastMessage = false,
  channelId
}: Props) => {
  const messageContent = message ? message.contents : []
  const onReadLastMessage = async () => {
    const api = new MessagesApi()
    await api.readMessages({
      channelId
    })
  }
  useEffect(() => {
    if (!lastMessage && !isOwnMessage) {
      return
    } else {
      onReadLastMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, isOwnMessage])

  return (
    <div
      className={classNames(
        "m-4 flex max-w-[70%] rounded",
        isOwnMessage && "flex-row-reverse self-end"
      )}
    >
      {!isOwnMessage && (
        <div className="flex flex-shrink-0 items-end">
          <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
        </div>
      )}

      {message && message?.tipAmount !== undefined && message?.tipAmount > 0 ? (
        <div className="mx-4 flex flex-col items-start">
          <TippedMessage tipAmount={message?.tipAmount} />
          <SentStatus />
        </div>
      ) : (
        <div className="mx-4 flex flex-col items-end">
          <div className="rounded border border-[#363037] bg-[#1E1820] py-3 px-4">
            <span className="break-all">{message?.text}</span>
            {messageContent.length > 0 && <Content />}
          </div>
          {isOwnMessage && message?.pending && (
            <span className="text-md mt-2 text-gray-500">Pending...</span>
          )}
        </div>
      )}
    </div>
  )
}
