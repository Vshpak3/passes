import { format } from "date-fns"
import Calendar from "public/icons/calendar-minus.svg"
import { FC, useCallback, useState } from "react"
import EventTableItem from "src/components/molecules/scheduler/EventTableItem"

import DeleteEventModal from "./DeleteEventModal"

// const EVENTS = [
//   {
//     name: "Content - 5$",
//     content: "4 videos, 20 photos",
//     date: new Date("2022, 09, 10"),
//     actionStatus: "in queue"
//   },
//   {
//     name: "New Pass Release",
//     content: "Golden Pass",
//     date: new Date("2022, 09, 10"),
//     actionStatus: "Re-schedule"
//   },
//   {
//     name: "Mass Message",
//     content: "Mass message (402 users)",
//     date: new Date("2022, 09, 10"),
//     actionStatus: "Re-schedule"
//   }
// ]

const EVENTS: any = []

const EventTable: FC = () => {
  const [selectEventIdDelete, setSelectEventIdDelete] = useState<number>(-1)

  const handleOnDeleteEvent = useCallback((targetId: number) => {
    setSelectEventIdDelete(targetId)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setSelectEventIdDelete(-1)
  }, [])

  const handleDeleteEvent = useCallback(() => {
    setSelectEventIdDelete(-1)
  }, [])

  return (
    <div className="px-[15px] md:px-[30px]">
      <div className="mb-9 select-none text-base font-bold md:text-2xl">
        Scheduled event
      </div>
      {EVENTS.length === 0 ? (
        <div className="mb-[30px] flex h-[295px] w-full flex-col items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] py-5 backdrop-blur-[50px]">
          <Calendar />
          <span className="mt-3 text-white opacity-50">
            There are no scheduled events for this day
          </span>
        </div>
      ) : (
        <div className="mb-[30px] w-full rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] py-5 backdrop-blur-[50px]">
          {selectEventIdDelete > -1 && (
            <DeleteEventModal
              onCancel={handleCancelDelete}
              onDelete={handleDeleteEvent}
            />
          )}
          <table className="w-full">
            <tr className="pb-2 text-left text-base font-medium leading-6 text-white opacity-50">
              <th className="pl-5 pb-1">Name</th>
              <th className="pb-1">Content</th>
              <th className="pb-1">Date</th>
              <th className="pb-1">Action</th>
            </tr>
            {EVENTS.map((item: any, index: number) => {
              const { name, content, date, actionStatus } = item
              return (
                <EventTableItem
                  key={index}
                  id={index}
                  name={name}
                  content={content}
                  date={format(date, "dd MMMM yyyy")}
                  actionStatus={actionStatus}
                  onDeleteEvent={handleOnDeleteEvent}
                />
              )
            })}
          </table>
        </div>
      )}
    </div>
  )
}

export default EventTable
