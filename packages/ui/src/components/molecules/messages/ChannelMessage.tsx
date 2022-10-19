import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import Locked from "public/icons/lock-locked.svg"
import React, { FC } from "react"
import { formatCurrency, formatText } from "src/helpers/formatters"

import { Avatar } from "./Avatar"
import { CompletedAvatar } from "./CompletedAvatar"
import { Content } from "./message/Content"

interface ChannelMessageProps {
  isOwnMessage?: boolean
  message: MessageDto
  contentAvatarDisplayName?: string
  contentAvatarUserName?: string
}
export const ChannelMessage: FC<ChannelMessageProps> = ({
  message,
  isOwnMessage = false,
  contentAvatarDisplayName,
  contentAvatarUserName
}: ChannelMessageProps) => {
  const messageBackground = isOwnMessage ? "bg-black" : "bg-[#1E1820]"
  const messageContent = message ? message.contents : []
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

      <div className="mx-4 flex flex-col items-end">
        <div
          className={`rounded border border-[#363037] ${messageBackground} py-3 px-4`}
        >
          {message?.tipAmount ? (
            <>
              {formatCurrency(message.tipAmount)}
              <br />
            </>
          ) : (
            <></>
          )}

          {!!messageContent.length && (
            <div className="flex w-full flex-col">
              <div className="flex flex-shrink-0 items-start justify-between">
                <CompletedAvatar
                  contentAvatarDisplayName={contentAvatarDisplayName}
                  contentAvatarUserName={contentAvatarUserName}
                  imageSrc="https://www.w3schools.com/w3images/avatar1.png"
                />
                {message.paid ? (
                  <div className="flex flex-shrink-0 items-center gap-[6px]">
                    <Locked />
                    <span className="text-[14px] font-medium leading-[0px] text-[#767676]">
                      Purchased
                    </span>
                  </div>
                ) : null}
              </div>
              <div>
                <span>{message?.text}</span>
              </div>
              <div className="pt-2">
                <Content
                  contents={messageContent}
                  paid={message.paid}
                  price={message?.price}
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              </div>
              <div className="pt-2">
                <span className="text-[12px] font-normal uppercase leading-[24px] text-[#fff]/50">
                  {messageContent[0].createdAt?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                  })}
                </span>
              </div>
            </div>
          )}
          {formatText(message?.text)}
        </div>
        {!!message?.pending && (
          <span className="text-md mt-2 text-gray-500">Pending...</span>
        )}
        {!message?.pending && message.sentAt && (
          <span className="text-md mt-2 text-gray-500">
            {message.sentAt.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
