import { MessageDto, MessagesApi } from "@passes/api-client"
import { UIEventHandler, useCallback, useEffect, useRef, useState } from "react"

import { TippedMessage } from "../direct-messages/completed-tipped-message"
import { FreeMessagesLeftContainer } from "../direct-messages/free-messages-left-container"
import { ChannelMessage } from "./index"

const FETCH_NEW_MESSAGES_RATE = 3000 // 3 seconds

export interface ChannelStreamProps {
  channelId?: string
  freeMessages?: number
  isCreator?: boolean
}

export const ChannelStream = ({
  channelId,
  freeMessages,
  isCreator
}: ChannelStreamProps) => {
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [earliestSentAt, setEarliestSentAt] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(true)
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [pendingMessages, setPendingMessages] = useState<MessageDto[]>([])

  // Ref to keep latest message to fetch new ones, without causing refresh
  const latestMessageTimestamp = useRef<Date>(new Date())

  const handleScroll: UIEventHandler<HTMLDivElement> = async (e) => {
    const element = e.currentTarget
    if (element.scrollTop <= 200) {
      setIsLoadingOlderMessages(true)
      try {
        await loadPreviousMessages(false)
      } catch (e) {
        console.error("Error loading previous messages", e)
      } finally {
        setIsLoadingOlderMessages(false)
      }
    }
  }

  const loadPreviousMessages = useCallback(
    async (includePending: boolean) => {
      if (!channelId) {
        return
      }

      const api = new MessagesApi()
      const nonPendingMessagesRes = await api.getMessages({
        getMessagesRequestDto: {
          sentAt: earliestSentAt,
          channelId,
          contentOnly: false,
          pending: false
        }
      })

      setEarliestSentAt(nonPendingMessagesRes.sentAt)
      setMessages((m) => {
        const messages = [...nonPendingMessagesRes.messages, ...m]

        latestMessageTimestamp.current = messages.length
          ? messages[messages.length - 1].sentAt
          : new Date()

        return messages
      })

      // Fetch pending messages, only on initial load
      if (includePending) {
        const pendingMessagesRes = await api.getMessages({
          getMessagesRequestDto: {
            sentAt: earliestSentAt,
            channelId,
            contentOnly: false,
            pending: true
          }
        })

        setPendingMessages(pendingMessagesRes.messages)
      }
    },
    [channelId, earliestSentAt]
  )

  useEffect(() => {
    if (isLoading) {
      return
    }

    const loadInitialMessages = async () => {
      await loadPreviousMessages(true)
      bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" })
      setIsLoading(false)
    }

    loadInitialMessages()
  }, [isLoading, loadPreviousMessages])

  useEffect(() => {
    if (!channelId) {
      return
    }

    const loadNewMessages = setTimeout(async () => {
      const api = new MessagesApi()
      const nonPendingMessagesRes = await api.getMessages({
        getMessagesRequestDto: {
          dateLimit: latestMessageTimestamp.current,
          channelId,
          contentOnly: false,
          pending: false
        }
      })

      const existingIds = new Set(messages.map((m) => m.messageId))
      const newMessages = [...messages]
      for (let i = 0; i < nonPendingMessagesRes.messages.length; ++i) {
        const message = nonPendingMessagesRes.messages[i]
        if (!existingIds.has(message.messageId)) {
          newMessages.push(message)
        }
      }

      setMessages(newMessages)
      latestMessageTimestamp.current = newMessages.length
        ? newMessages[newMessages.length - 1].sentAt
        : new Date()

      // This always returns all pending messages
      const pendingMessagesRes = await api.getMessages({
        getMessagesRequestDto: {
          dateLimit: latestMessageTimestamp.current,
          channelId,
          contentOnly: false,
          pending: true
        }
      })
      setPendingMessages(pendingMessagesRes.messages)
    }, FETCH_NEW_MESSAGES_RATE)

    return () => clearTimeout(loadNewMessages)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  return (
    <div
      className="flex h-full flex-1 flex-col overflow-y-scroll"
      onScroll={handleScroll}
      ref={bottomOfChatRef}
    >
      {isLoadingOlderMessages && <div>Loading older messages...</div>}
      {messages.length ? (
        <>
          {!isCreator && (
            <div className="sticky top-0 w-full">
              <FreeMessagesLeftContainer freeMessages={freeMessages} />
            </div>
          )}
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <ChannelMessage />
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <ChannelMessage />
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <TippedMessage isOwnMessage tipAmount={5} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          No messages
        </div>
      )}
      {pendingMessages.length > 0 &&
        pendingMessages.map((m) => <div key={m.messageId}>{m.messageId}</div>)}

      {/* Dummy ref to allow scrolling to bottom of chat */}
      <div ref={bottomOfChatRef} />
    </div>
  )
}
