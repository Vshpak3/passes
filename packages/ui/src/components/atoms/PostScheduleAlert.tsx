import { format } from "date-fns"
import { XCircle } from "lucide-react"
import { FC } from "react"

interface PostScheduleAlertProps {
  scheduledPostTime: Date | null
  onRemoveScheduledPostTime: () => void
}

export const PostScheduleAlert: FC<PostScheduleAlertProps> = ({
  scheduledPostTime,
  onRemoveScheduledPostTime
}) => {
  return (
    <div
      className="mt-3 flex items-center justify-between gap-1 rounded-md p-[10px] text-sm text-white sm:h-10 md:p-2.5"
      style={{
        backgroundColor: "#C943A8"
      }}
    >
      <div>
        Scheduled at:{" "}
        {scheduledPostTime &&
          format(scheduledPostTime, "EEEE, LLLL do, yyyy 'at' hh:mm a")}
      </div>
      <div style={{ cursor: "pointer" }}>
        <div onClick={onRemoveScheduledPostTime}>
          <XCircle />
        </div>
      </div>
    </div>
  )
}
