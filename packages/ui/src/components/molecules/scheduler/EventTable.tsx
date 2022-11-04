import { ScheduledEventDto } from "@passes/api-client"
import { format } from "date-fns"
import Calendar from "public/icons/calendar-minus.svg"
import { FC, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { EventTableItem } from "src/components/molecules/scheduler/EventTableItem"
import { useScheduledEvents } from "src/hooks/useScheduledEvents"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { SchedulerContext } from "src/pages/tools/scheduler"

export const EventTable: FC = () => {
  const { isTablet } = useWindowSize()
  const { month, year } = useContext(SchedulerContext)

  const { data, setMonthYear, deleteScheduledEvent, updateScheduledTime } =
    useScheduledEvents()

  useEffect(() => {
    setMonthYear({ month, year })
  }, [month, year, setMonthYear])

  const [selectEventIdDelete, setSelectEventIdDelete] = useState<string | null>(
    null
  )
  const handleOnDeleteEvent = (targetId: string) => {
    setSelectEventIdDelete(targetId)
  }

  const handleDeleteEvent = async () => {
    if (!selectEventIdDelete) {
      return
    }
    await deleteScheduledEvent(selectEventIdDelete)
    toast.success("Deleted event successfully")
  }

  const handleOnUpdateEvent = async (id: string, time: Date) => {
    await updateScheduledTime(id, time)
    toast.success("Updated schedule successefully")
  }

  const tableItems = data?.map((item: ScheduledEventDto) => (
    <EventTableItem
      isTablet={isTablet}
      key={item.scheduledEventId}
      onChangeTime={handleOnUpdateEvent}
      onDeleteEvent={handleOnDeleteEvent}
      scheduledEvent={item}
    />
  ))

  return (
    <div className="px-[30px] pb-[100px]">
      <div className="mb-9 text-base font-bold md:text-2xl">
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
            <DeleteConfirmationModal
              isOpen
              onClose={() => setSelectEventIdDelete(null)}
              onDelete={handleDeleteEvent}
            />
          )}
          {!isTablet ? (
            <table className="table w-full">
              <thead>
                <tr className="contents text-left text-base font-medium leading-6 text-white opacity-50">
                  <th className="pl-5 pb-5">Type</th>
                  <th className="px-3 pb-5">Media</th>
                  <th className="px-3 pb-5">Price</th>
                  <th className="px-3 pb-5">Text</th>
                  <th className="pb-5 text-center">Date</th>
                  <th className="px-10 pb-5">Action</th>
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
