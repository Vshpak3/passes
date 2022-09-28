import EditIcon from "public/icons/edit.svg"
import LockedUnlockedIcon from "public/icons/lock-unlocked.svg"
import TrashIcon from "public/icons/trash.svg"
import { FC, useCallback } from "react"
import useWindowDimensions from "src/helpers/hooks/useWindowDimensions"

interface EventTableItemProps {
  id: number
  name: string
  content: string
  date: string
  actionStatus: string
  onDeleteEvent: (id: number) => void
}

const EventTableItem: FC<EventTableItemProps> = ({
  id,
  name,
  content,
  date,
  actionStatus,
  onDeleteEvent
}) => {
  const { width = 0 } = useWindowDimensions()

  const generateButtonName = useCallback(() => {
    if (name.toLowerCase().includes("content")) {
      return (
        <button className="flex min-w-[175px] items-center justify-center gap-3 rounded-[50px] bg-passes-pink-100 py-[6px] text-white md:py-[13px]">
          <LockedUnlockedIcon /> {name}
        </button>
      )
    }
    return (
      <button className="flex min-w-[175px] items-center justify-center gap-3 rounded-[50px] bg-passes-primary-color py-[6px] text-white md:py-[13px]">
        {name}
      </button>
    )
  }, [name])

  const generateActionStatus = useCallback(
    (isMobile?: boolean, type?: string) => {
      if (!isMobile) {
        if (actionStatus === "in queue") {
          return (
            <div className="flex items-center">
              <span className="mr-6 text-passes-yellow">{actionStatus}</span>
              <TrashIcon
                className="mr-3 cursor-pointer"
                onClick={() => onDeleteEvent(id)}
              />
              <EditIcon />
            </div>
          )
        }
        return (
          <div className="flex items-center">
            <span className="mr-4 text-white">{actionStatus}</span>
            <EditIcon />
          </div>
        )
      }
      if (type === "status") {
        if (actionStatus === "in queue") {
          return (
            <div className="flex items-center">
              <span className="mr-6 text-passes-yellow">{actionStatus}</span>
            </div>
          )
        }
        return (
          <div className="flex items-center">
            <span className="mr-4 text-white">{actionStatus}</span>
          </div>
        )
      }
      if (actionStatus === "in queue") {
        return (
          <div className="flex items-center">
            <TrashIcon
              className="mr-3 cursor-pointer"
              onClick={() => onDeleteEvent(id)}
            />
            <EditIcon />
          </div>
        )
      }
      return (
        <div className="flex items-center">
          <EditIcon />
        </div>
      )
    },
    [actionStatus, id, onDeleteEvent]
  )

  if (width < 768) {
    const isMobile = true
    return (
      <div className="mb-8 px-5">
        <div className="mb-6 flex items-center justify-between">
          <span>{date}</span>
          <span>{generateActionStatus(isMobile, "action")}</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="mr-3 h-[125px] w-[125px] rounded-[12px] bg-passes-gray-400 backdrop-blur-[28px]" />
          <div className="flex flex-col gap-2">
            <div>{generateButtonName()}</div>
            <span>{content}</span>
            <span>{generateActionStatus(isMobile, "status")}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <tr className="px-5 odd:bg-passes-purple-200">
      <td className="my-[6px] flex items-center pl-5">
        <div className="mr-3 h-[75px] w-[75px] rounded-[12px] bg-passes-gray-400 backdrop-blur-[28px]" />
        {generateButtonName()}
      </td>
      <td className="my-[6px]">{content}</td>
      <td className="my-[6px]">{date}</td>
      <td className="my-[6px]">{generateActionStatus()}</td>
    </tr>
  )
}

export default EventTableItem
