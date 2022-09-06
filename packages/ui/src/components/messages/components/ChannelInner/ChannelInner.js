import { MessagesApi } from "@passes/api-client/apis"
import React, { useContext } from "react"
import { toast } from "react-toastify"
import { wrapApi } from "src/helpers/wrapApi"
import { useChat } from "src/hooks"
import { logChatPromiseExecution } from "stream-chat"
import {
  ChatContext,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window
} from "stream-chat-react"

import { ContentService } from "../../../../helpers"
import {
  MessagingChannelHeader,
  MessagingInput,
  MessagingInputFanPerspective
} from "../../components"
import { GiphyContext } from "../../index"

export const ChannelInner = (props) => {
  const { theme, toggleMobile } = props

  const { giphyState, setGiphyState, files, setFiles, isCreator } =
    useContext(GiphyContext)
  const { channel: activeChannel, client } = useChatContext(ChatContext)

  const members = Object.values(activeChannel?.state?.members).filter(
    ({ user }) => user?.id !== client.userID
  )

  const { channelId } = useChat(members[0]?.user.name)
  const sendMessage = async (messageToSend) => {
    const content = await new ContentService().uploadUserContent(files)
    try {
      const api = wrapApi(MessagesApi)
      await api.sendMessage({
        sendMessageRequestDto: {
          text: messageToSend.text || "",
          attachments: [],
          content: content.map((c) => c.id),
          channelId
        }
      })
      setFiles([])
    } catch (err) {
      toast.error(err)
      console.error(err)
    }
  }

  const overrideSubmitHandler = (message) => {
    let updatedMessage

    if (message.attachments?.length && message.text?.startsWith("/giphy")) {
      const updatedText = message.text.replace("/giphy", "")
      updatedMessage = { ...message, text: updatedText }
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`
      updatedMessage = { ...message, text: updatedText }
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message
      const parentMessage = newMessage.parent

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString()
            }
          : undefined
      }

      const sendMessagePromise = sendMessage(messageToSend)
      logChatPromiseExecution(sendMessagePromise, "send message")
    }

    setGiphyState(false)
  }

  const actions = ["delete", "edit", "flag", "mute", "react", "reply"]

  return (
    <>
      <Window>
        <MessagingChannelHeader
          theme={theme}
          toggleMobile={toggleMobile}
          isCreator={isCreator}
        />
        {isCreator && (
          <div className="custom-border-second-header spending-tips-buttons flex min-h-[54px] items-center justify-start gap-[18px] bg-[#1b141d]/50 pl-5">
            <span>Tips spent</span>
            <div className="flex items-center justify-start gap-[10px]">
              <div className="m-0 flex cursor-pointer items-center p-0">
                <span className="flex h-[36px] w-[87px] items-center justify-center rounded-l-[40px] bg-[#E58230] text-[16px] font-medium leading-[16px] text-[#ffff]">
                  Today 👑
                </span>
                <span className="flex h-[36px] w-[60px] items-center justify-center rounded-r-[40px] bg-[#D55C26] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                  $200
                </span>
              </div>
              <div className="m-0 flex cursor-pointer items-center p-0">
                <span className="flex h-[36px] w-[125px] items-center justify-center rounded-l-[40px] bg-[#499B8E] text-[16px] font-medium leading-[16px] text-[#ffff]">
                  4 days ago 👏🏻
                </span>
                <span className="flex h-[36px] w-[58px] items-center justify-center rounded-r-[40px] bg-[#3B867A] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                  $150
                </span>
              </div>
              <div className="m-0 flex cursor-pointer items-center p-0">
                <span className="flex h-[36px] w-[89px] items-center justify-center rounded-l-[40px] bg-[#589752] text-[16px] font-medium leading-[16px] text-[#ffff]">
                  March 👍
                </span>
                <span className="flex h-[36px] w-[40px] items-center justify-center rounded-r-[40px] bg-[#488243] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                  $5
                </span>
              </div>
            </div>
          </div>
        )}
        <MessageList messageActions={actions} />
        <MessageInput focus overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread
        Input={isCreator ? MessagingInput : MessagingInputFanPerspective}
      />
    </>
  )
}
