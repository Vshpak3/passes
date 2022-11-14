import { ScheduledEventDtoTypeEnum } from "@passes/api-client"
import { format } from "date-fns"
import CheckIcon from "public/icons/check.svg"
import EditIcon from "public/icons/edit-icon.svg"
import TrashIcon from "public/icons/trash.svg"
import { FC, useState } from "react"

import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { EditPostPopup } from "./EditPostPopup"
import { EventTableItemCachedProps } from "./EventTableItemCached"

type EventTableItemProps = EventTableItemCachedProps

export const EventTableItem: FC<EventTableItemProps> = ({
  scheduledEvent,
  onDeleteEvent,
  onChangeTime
}) => {
  const today = new Date()
  const [edit, setEdit] = useState<boolean>(false)

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
  let typeStr: string

  switch (type) {
    case ScheduledEventDtoTypeEnum.CreatePost:
      text = createPost?.text ?? ""
      price = createPost?.price ?? 0
      typeStr = "Post"
      break
    case ScheduledEventDtoTypeEnum.BatchMessage:
      text = batchMessage?.text ?? ""
      price = batchMessage?.price ?? 0
      typeStr = "Message"
      break
    case ScheduledEventDtoTypeEnum.SendMessage:
      text = sendMessage?.text ?? ""
      price = sendMessage?.price ?? 0
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
            activeHeader="Schedule"
            name="Schedule"
            placement="top"
            scheduledTime={scheduledAt}
            setScheduledTime={async (date: Date | null) => {
              if (!date) {
                return
              }
              await onChangeTime(scheduledEventId, date)
            }}
          />
          {type === ScheduledEventDtoTypeEnum.CreatePost && (
            <EditIcon
              className="mr-3 cursor-pointer"
              onClick={() => setEdit(true)}
            />
          )}
        </>
      ) : (
        <CheckIcon />
      )}
    </div>
  )
  const { images, video } = contentTypeCounter(scheduledEvent.contents ?? [])

  return (
    <>
      {edit && (
        <EditPostPopup
          isOpen
          onCancel={() => setEdit(false)}
          scheduledEvent={scheduledEvent}
        />
      )}
      <div className="mb-8 bg-passes-purple-200 p-5">
        <div className="mb-6 flex items-center justify-between">
          <span>
            {format(scheduledAt, "LLL do, yyyy")}
            <br />
            {format(scheduledAt, "hh:mm a")}
          </span>
          <span>{generateActionStatus}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-start px-3">
            <span className="block px-5">{typeStr}</span>
            <span className="block px-5">
              {images} images, {video} videos
            </span>
            <span className="block px-5">
              {price ? formatCurrency(price) : "Free"}
            </span>
            <span className="my-[6px] block max-w-[350px] truncate px-5">
              {formatText(text)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
