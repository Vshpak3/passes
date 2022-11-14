import { ScheduledEventDto } from "@passes/api-client"
import { format } from "date-fns"
import Calendar from "public/icons/calendar-minus.svg"
import { FC, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { useScheduledEvents } from "src/hooks/useScheduledEvents"
import { SchedulerContext } from "src/pages/tools/scheduler"
import { EventTableItemCached } from "./EventTableItemCached"

export const EventTable: FC = () => {
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

  return (
    <div className="pb-20">
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
          {!!selectEventIdDelete && (
            <DeleteConfirmationModal
              isOpen
              onClose={() => setSelectEventIdDelete(null)}
              onDelete={handleDeleteEvent}
            />
          )}
          <div className="w-full">
            {data?.map((item: ScheduledEventDto) => (
              <EventTableItemCached
                key={item.scheduledEventId}
                onChangeTime={handleOnUpdateEvent}
                onDeleteEvent={handleOnDeleteEvent}
                scheduledEvent={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
