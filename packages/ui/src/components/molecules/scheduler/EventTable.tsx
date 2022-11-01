import { ScheduledEventDto } from "@passes/api-client"
import { format } from "date-fns"
import Calendar from "public/icons/calendar-minus.svg"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { EventTableItem } from "src/components/molecules/scheduler/EventTableItem"
import { useScheduledEvents } from "src/hooks/useScheduledEvents"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { SchedulerContext } from "src/pages/tools/scheduler"
import { DeleteEventModal } from "./DeleteEventModal"

export const EventTable: FC = () => {
  const { isTablet } = useWindowSize()
  const { month, year } = useContext(SchedulerContext)

  const {
    data,
    setMonthYear,
    deleteScheduledEvent,
    mutate,
    updateScheduledTime
  } = useScheduledEvents()

  useEffect(() => {
    setMonthYear({ month, year })
  }, [month, year, setMonthYear])

  const [selectEventIdDelete, setSelectEventIdDelete] = useState<string | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const handleOnDeleteEvent = (targetId: string) => {
    setSelectEventIdDelete(targetId)
  }

  const handleCancelDelete = () => {
    setSelectEventIdDelete(null)
  }

  const handleDeleteEvent = useCallback(async () => {
    if (!selectEventIdDelete) {
      return
    }
    setIsDeleting(true)
    await deleteScheduledEvent(selectEventIdDelete)
    setSelectEventIdDelete(null)
    setIsDeleting(false)
    toast.success("Deleted event successefully")
  }, [selectEventIdDelete, deleteScheduledEvent])

  const handleOnUpdateEvent = async (id: string, time: Date) => {
    await updateScheduledTime(id, time)
    toast.success("Updated schedule successefully")
  }

  const tableItems = data?.map((item: ScheduledEventDto) => (
    <EventTableItem
      key={item.scheduledEventId}
      scheduledEvent={item}
      onDeleteEvent={handleOnDeleteEvent}
      mutate={mutate}
      onChangeTime={handleOnUpdateEvent}
      isTablet={isTablet}
    />
  ))

  return (
    <div className="px-[15px] px-[30px] pb-[100px]">
      <div className="mb-9 select-none text-base text-xl font-bold md:text-2xl">
        Scheduled Events In {format(new Date(year, month, 1), "LLLL")}
      </div>
      {!data?.length ? (
        <div className="mb-[30px] flex h-[295px] w-full flex-col items-center justify-center rounded-[15px] border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] py-5 backdrop-blur-[50px]">
          <Calendar />
          <span className="mt-3 text-white opacity-50">
            There are no scheduled events for this month
          </span>
        </div>
      ) : (
        <div className="mb-[30px] w-full overflow-auto rounded-[15px] border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] py-5 backdrop-blur-[50px]">
          {selectEventIdDelete && (
            <DeleteEventModal
              isDeleting={isDeleting}
              onCancel={handleCancelDelete}
              onDelete={handleDeleteEvent}
            />
          )}
          {!isTablet ? (
            <table className="table w-full">
              <thead>
                <tr className="contents pb-2 text-left text-base font-medium leading-6 text-white opacity-50">
                  <th className="pl-5 pb-1">Type</th>
                  <th className="px-3 pb-1">Media</th>
                  <th className="px-3 pb-1">Price</th>
                  <th className="px-3 pb-1">Text</th>
                  <th className="pb-1 text-center">Date</th>
                  <th className="pb-1">Action</th>
                </tr>
              </thead>
              <tbody>{tableItems}</tbody>
            </table>
          ) : (
            <div className="w-full">{tableItems}</div>
          )}
        </div>
      )}
    </div>
  )
}
