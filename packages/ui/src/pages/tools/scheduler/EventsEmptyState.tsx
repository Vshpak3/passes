import { CalendarDays } from "lucide-react"

export const EventsEmptyState = () => {
  return (
    <div className="bg-[rgba(27, 20, 29, 0.5)] backdrop-blur[100px] flex h-[290px] items-center justify-center rounded-[20px] border border-[#ffffff26] p-[20px]">
      <div>
        <div className="mb-[20px] flex justify-center">
          <CalendarDays size={32} color={"#ffffff80"} />
        </div>
        <div className="text-center text-[14px] text-[#ffffff80] md:text-base">
          There are no scheduled events for this month
        </div>
      </div>
    </div>
  )
}
