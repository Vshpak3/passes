import { XCircle } from "lucide-react"
import { useContext } from "react"

import { MainContext } from "../../context/MainContext"

export const PostScheduleAlert = () => {
  const { postTime, setPostTime } = useContext(MainContext)
  const userTime = String(postTime?.$d).substring(0, 24)

  return (
    <div
      className="flex h-10 items-center justify-between rounded-md p-2.5 text-xs text-white"
      style={{
        backgroundColor: "#C943A8"
      }}
    >
      <div>Scheduled At {userTime}</div>
      <div style={{ cursor: "pointer" }}>
        <div onClick={() => setPostTime(null)}>
          <XCircle />
        </div>
      </div>
    </div>
  )
}
