import {
  ScheduledEventDto,
  ScheduledEventDtoTypeEnum
} from "@passes/api-client"
import { format } from "date-fns"
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
}

export const EventTableItem: FC<EventTableItemProps> = ({
  scheduledEvent,
  onDeleteEvent,
  onChangeTime
}) => {
  const {
    scheduledEventId,
    type,
    scheduledAt,
    createPost,
    batchMessage,
    sendMessage
  } = scheduledEvent
  let text: string | undefined = undefined
  let price: number | undefined = undefined
  let media = 0
  let typeStr = "Unknown"
  switch (type) {
    case ScheduledEventDtoTypeEnum.CreatePost:
      text = createPost?.text
      price = createPost?.price
      media = createPost?.contentIds.length ?? 0
      typeStr = "Post"
      break
    case ScheduledEventDtoTypeEnum.BatchMessage:
      text = batchMessage?.text
      price = batchMessage?.price
      media = batchMessage?.contentIds.length ?? 0
      typeStr = "Message"
      break
    case ScheduledEventDtoTypeEnum.SendMessage:
      text = sendMessage?.text
      price = sendMessage?.price
      media = sendMessage?.contentIds.length ?? 0
      typeStr = "Message"
      break
  }
  const generateActionStatus = (
    <div className="flex items-center gap-[5px] xs:gap-[30px]">
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
      />
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <tr className="hidden px-5 odd:bg-passes-purple-200 md:table-row">
        <td className="pl-5 pb-1">{typeStr}</td>
        <td className="px-3 pb-1">{media}</td>
        <td className="px-3 pb-1">{formatCurrency(price ?? 0)}</td>
        <td className="my-[6px] max-w-[350px] truncate px-3 pb-1">
          {formatText(text)}
        </td>
        <td className="min-w-[75px] pb-1 text-center">
          {format(scheduledAt, "LLLL do, yyyy 'at' hh:mm a")}
        </td>
        <td className="my-[6px] min-w-[200px] whitespace-nowrap px-3">
          <div className="flex items-center">{generateActionStatus}</div>
        </td>
      </tr>

      {/* Mobile */}
      <div className="mb-8 px-5 md:hidden">
        <div className="mb-6 flex items-center justify-between">
          <span>{format(scheduledAt, "LLLL do, yyyy")}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div>Type: {typeStr}</div>
          <div>Media: {media}</div>
          <div>Price: {formatCurrency(price ?? 0)}</div>
          <div className="flex">
            <span>Text: {formatText(text)}</span>
          </div>
          <span>{generateActionStatus}</span>
        </div>
      </div>
    </>
  )
}
