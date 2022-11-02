import {
  ScheduledEventDto,
  ScheduledEventDtoTypeEnum
} from "@passes/api-client"
import { format } from "date-fns"
import CheckIcon from "public/icons/check.svg"
import TrashIcon from "public/icons/trash.svg"
import { FC } from "react"
import { KeyedMutator } from "swr"

import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { formatCurrency, formatText } from "src/helpers/formatters"

interface EventTableItemProps {
  scheduledEvent: ScheduledEventDto
  onDeleteEvent: (id: string) => void | Promise<void>
  onChangeTime: (id: string, time: Date) => void | Promise<void>
  mutate: KeyedMutator<ScheduledEventDto[] | undefined>
  isTablet: boolean
}

export const EventTableItem: FC<EventTableItemProps> = ({
  scheduledEvent,
  onDeleteEvent,
  onChangeTime,
  isTablet
}) => {
  const today = new Date()

  const {
    scheduledEventId,
    type,
    scheduledAt,
    createPost,
    batchMessage,
    sendMessage
  } = scheduledEvent

  let text: string
  let price: number | string
  let media: number
  let typeStr: string

  switch (type) {
    case ScheduledEventDtoTypeEnum.CreatePost:
      text = createPost?.text ?? ""
      price = createPost?.price ?? 0
      media = createPost?.contentIds.length ?? 0
      typeStr = "Post"
      break
    case ScheduledEventDtoTypeEnum.BatchMessage:
      text = batchMessage?.text ?? ""
      price = batchMessage?.price ?? 0
      media = batchMessage?.contentIds.length ?? 0
      typeStr = "Message"
      break
    case ScheduledEventDtoTypeEnum.SendMessage:
      text = sendMessage?.text ?? ""
      price = sendMessage?.price ?? 0
      media = sendMessage?.contentIds.length ?? 0
      typeStr = "Message"
      break
    default:
      throw new Error("Unexpected issue")
  }

  const generateActionStatus = (
    <div className="flex items-center gap-[5px] xs:gap-[30px]">
      {scheduledEvent.scheduledAt > today ? (
        <>
          <TrashIcon
            className="mr-3 cursor-pointer"
            onClick={async () => await onDeleteEvent(scheduledEventId)}
          />
          <CalendarSelector
            name="Schedule"
            activeHeader="Schedule"
            scheduledTime={scheduledAt}
            setScheduledTime={async (date: Date | null) => {
              if (!date) {
                return
              }
              await onChangeTime(scheduledEventId, date)
            }}
            placement={isTablet ? "top" : "auto"}
          />
        </>
      ) : (
        <CheckIcon />
      )}
    </div>
  )

  return !isTablet ? (
    <tr className="px-5 odd:bg-passes-purple-200">
      <td className="pl-5 pb-1">{typeStr}</td>
      <td className="px-3 pb-1">{media}</td>
      <td className="px-3 pb-1">{price ? formatCurrency(price) : "Free"}</td>
      <td className="my-[6px] max-w-[350px] truncate px-3 pb-1">
        {formatText(text)}
      </td>
      <td className="min-w-[75px] pb-1 text-center">
        {format(scheduledAt, "LLLL do, yyyy 'at' hh:mm a")}
      </td>
      <td className="my-[6px] min-w-[200px] whitespace-nowrap px-3">
        <div className="flex min-h-[60px] items-center">
          {generateActionStatus}
        </div>
      </td>
    </tr>
  ) : (
    <div className="mb-8 bg-passes-purple-200 px-5 py-5">
      <div className="mb-6 flex items-center justify-between">
        <span>{format(scheduledAt, "LLLL do, yyyy")}</span>
        <span>{generateActionStatus}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-start px-3">
          <span className="block px-5">{typeStr}</span>
          <span className="block px-5">{media}</span>
          <span className="block px-5">
            {price ? formatCurrency(price) : "Free"}
          </span>
          <span className="my-[6px] block max-w-[350px] truncate px-5">
            {formatText(text)}
          </span>
        </div>
      </div>
    </div>
  )
}
