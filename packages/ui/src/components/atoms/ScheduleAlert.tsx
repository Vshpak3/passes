import { format } from "date-fns"
import { FC } from "react"

import { Cross } from "src/icons/CrossIcon"

interface ScheduleAlertProps {
  scheduledPostTime: Date | null
  onRemoveScheduledPostTime: () => void
}

export const ScheduleAlert: FC<ScheduleAlertProps> = ({
  scheduledPostTime,
  onRemoveScheduledPostTime
}) => {
  return (
    <div className="mt-3 flex items-center justify-between gap-1 rounded-md bg-[#C943A8] p-[10px] text-sm text-white sm:h-10 md:p-2.5">
      <div>
        Scheduled at:{" "}
        {scheduledPostTime &&
          format(scheduledPostTime, "EEEE, LLLL do, yyyy 'at' hh:mm a")}
      </div>
      <div className="cursor-pointer" onClick={onRemoveScheduledPostTime}>
        <Cross />
      </div>
    </div>
  )
}
