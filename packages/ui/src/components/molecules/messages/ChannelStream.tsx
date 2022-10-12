import { MessageDto, MessagesApi } from "@passes/api-client"
import ms from "ms"
import {
  FC,
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import { PendingStatus } from "src/components/messages/assets/PendingStatus"
import { TippedMessage } from "src/components/molecules/direct-messages/completed-tipped-message"
import { FreeMessagesLeftContainer } from "src/components/molecules/direct-messages/free-messages-left-container"
import { useUser } from "src/hooks/useUser"

import { ChannelMessage } from "./ChannelMessage"

const FETCH_NEW_MESSAGES_RATE = ms("3 seconds")

export interface ChannelStreamProps {
  channelId?: string
  freeMessages?: number
  isCreator?: boolean
}

export const ChannelStream: FC<ChannelStreamProps> = ({
  channelId,
  freeMessages,
  isCreator
}) => {
  const { user } = useUser()
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [earliestSentAt, setEarliestSentAt] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false)
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

      setEarliestSentAt(nonPendingMessagesRes.sentAt ?? new Date())
      setMessages((m) => {
        const messages = [...nonPendingMessagesRes.data, ...m]

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

        setPendingMessages(pendingMessagesRes.data)
      }
    },
    [channelId, earliestSentAt]
  )

  useEffect(() => {
    if (!isLoading) {
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
      for (let i = 0; i < nonPendingMessagesRes.data.length; ++i) {
        const message = nonPendingMessagesRes.data[i]
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
      setPendingMessages(pendingMessagesRes.data)
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
          {!isCreator && freeMessages !== null && (
            <div className="sticky top-0 z-20 w-full">
              <FreeMessagesLeftContainer freeMessages={freeMessages} />
            </div>
          )}
          {channelId &&
            messages.map((message, index) => (
              <ChannelMessage
                key={index}
                message={message}
                isOwnMessage={message.senderId === user?.userId}
                lastMessage={index === 0}
                channelId={channelId}
              />
            ))}
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          No messages
        </div>
      )}
      {pendingMessages.length > 0 &&
        pendingMessages.map((m, i) => {
          return (
            <div
              key={i}
              className="m-4 flex max-w-[70%] flex-row-reverse self-end rounded"
            >
              <div className="mx-4 flex flex-col items-start">
                <TippedMessage tipAmount={m?.tipAmount} />
                <PendingStatus />
              </div>
            </div>
          )
        })}

      {/* Dummy ref to allow scrolling to bottom of chat */}
      <div ref={bottomOfChatRef} />
    </div>
  )
}
