import { format } from "date-fns"
import { XCircle } from "lucide-react"
import { FC } from "react"
import { useCreatePost } from "src/hooks"

export const PostScheduleAlert: FC<any> = () => {
  const { scheduledPostTime, setScheduledPostTime } = useCreatePost()

  return (
    <div
      className="mt-3 flex h-10 items-center justify-between rounded-md p-2.5 text-xs text-white"
      style={{
        backgroundColor: "#C943A8"
      }}
    >
      <div>
        Scheduled At:{" "}
        {scheduledPostTime && format(scheduledPostTime, "dd mm, yyyy hh:mm")}
      </div>
      <div style={{ cursor: "pointer" }}>
        <div onClick={() => setScheduledPostTime(null)}>
          <XCircle />
        </div>
      </div>
    </div>
  )
}
