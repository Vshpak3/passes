import {
  ScheduledEventDto,
  ScheduledEventDtoTypeEnum
} from "@passes/api-client"
import { format } from "date-fns"
import TrashIcon from "public/icons/trash.svg"
import { FC } from "react"
import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { formatCurrency } from "src/helpers/formatters"
import { useWindowDimensions } from "src/helpers/hooks/useWindowDimensions"
import { KeyedMutator } from "swr"

interface EventTableItemProps {
  scheduledEvent: ScheduledEventDto
  onDeleteEvent: (id: string) => void | Promise<void>
  onChangeTime: (id: string, time: Date) => void | Promise<void>
  mutate: KeyedMutator<ScheduledEventDto[] | undefined>
}

// export const EditTimeGroup: FC<any> = ({ id, data }) => {
//   const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

//   const hideUpdatePostModalHandler = () => {
//     setIsNewPostModalOpen(false)
//   }

//   return (
//     <Dialog
//       open={isNewPostModalOpen}
//       triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-0"
//       className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
//       trigger={<EditIcon onClick={() => setIsNewPostModalOpen(true)} />}
//     >
//       {/* <UpdatePost
//         onUpdate={hideUpdatePostModalHandler}
//         onClose={hideUpdatePostModalHandler}
//         initialData={data}
//         postId={id}
//       /> */}
//       {/* TODO: add in calendar dropdown */}
//     </Dialog>
//   )
// }

export const EventTableItem: FC<EventTableItemProps> = ({
  scheduledEvent,
  onDeleteEvent,
  onChangeTime
}) => {
  const { width = 0 } = useWindowDimensions()
  // const [showcaseImg, setShowcaseImg] = useState<null | string>(null)

  // Set image if it exists in post
  // useEffect(() => {
  //   if (data.contents?.[0]?.contentType === "image") {
  //     setShowcaseImg(data.contents[0].signedUrl as string)
  //   }
  // }, [data.contents])

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
  let typeStr = "unkown"
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
    <div className="flex items-center">
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
      {/* <EditButtonGroup id={id} data={data} /> */}
    </div>
  )

  if (width < 768) {
    return (
      <div className="mb-8 px-5">
        <div className="mb-6 flex items-center justify-between">
          <span>{format(scheduledAt, "LLLL do, yyyy")}</span>
          <span>{generateActionStatus}</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="mr-3 h-[125px] w-[125px] rounded-[12px] bg-passes-gray-400 backdrop-blur-[28px]" />
          <div className="flex flex-col gap-2">
            <div> {media}</div>
            <div>{formatCurrency(price ?? 0)}</div>
            <span>{text}</span>
            <span>{generateActionStatus}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <tr className="px-5 odd:bg-passes-purple-200">
      <td className="pl-5 pb-1">{typeStr}</td>
      <td>{media}</td>
      <td>{formatCurrency(price ?? 0)}</td>
      <td className="my-[6px] max-w-[350px] truncate px-3">{text}</td>
      <td className="min-w-[150px] text-center">
        {format(scheduledAt, "LLLL do, yyyy 'at' hh:mm a")}
      </td>
      <td className="my-[6px] min-w-[170px] whitespace-nowrap px-3">
        <div className="flex items-center">
          {generateActionStatus}
          {/* <EditButtonGroup id={id} data={data} /> */}
        </div>
      </td>
    </tr>
  )
}
