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
      className="mt-3 flex h-10 items-center justify-between gap-1 rounded-md p-2.5 text-sm text-white"
      style={{
        backgroundColor: "#C943A8"
      }}
    >
      <div>
        Scheduled at:{" "}
        {scheduledPostTime && format(scheduledPostTime, "dd MMM yyyy, hh:mm")}
      </div>
      <div style={{ cursor: "pointer" }}>
        <div onClick={onRemoveScheduledPostTime}>
          <XCircle />
        </div>
      </div>
    </div>
  )
}
