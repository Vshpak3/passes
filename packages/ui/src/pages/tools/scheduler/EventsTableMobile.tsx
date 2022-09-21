import { CalendarClock, Edit3, Lock, Trash2, Unlock } from "lucide-react"
import { SetStateAction } from "react"

import postsData from "./posts.json"

type PropsType = {
  setShowDeletePostModal: React.Dispatch<SetStateAction<boolean>>
}

const EventsTableMobile = ({ setShowDeletePostModal }: PropsType) => {
  return (
    <div className="mb-[100px] min-h-[190px] rounded-[20px] border border-[#ffffff26] p-[20px]">
      {postsData.map((item) => (
        <div
          key={item.id}
          className="mb-[20px] min-h-[190px] rounded-[20px] border border-[#ffffff26] p-[20px]"
        >
          <div className="mb-[20px] flex items-center justify-between">
            <div>{item.date}</div>
            <div className="flex items-center">
              {item.status === "queued" ? (
                <>
                  <Edit3 className="mr-[20px] cursor-pointer" />
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => setShowDeletePostModal(true)}
                  />
                </>
              ) : (
                <CalendarClock className="cursor-pointer" />
              )}
            </div>
          </div>
          <div>
            <div className="flex">
              <div className="mr-[15px] h-[125px] w-[125px] rounded-[10px] bg-[#E6C4EA]"></div>
              <div className="flex flex-col justify-center">
                <div
                  className={`mb-[10px] flex h-[45px] items-center justify-center rounded-[50px] py-[10px] px-[15px] ${
                    item.pay ? "bg-[#C943A8]" : "bg-[#43C958]"
                  }`}
                >
                  {item.pay ? (
                    <Lock className="mr-[10px]" />
                  ) : (
                    <Unlock className="mr-[10px]" />
                  )}
                  <span className="hidden lg:inline">Post -</span>{" "}
                  {item.pay ? item.pay + "$" : "Free"}
                </div>
                <div className="mb-[10px]">{item.content}</div>
                <div
                  className={`${
                    item.status === "queued" ? "text-[#C9BC43]" : "text-[white]"
                  }`}
                >
                  {item.status === "queued" ? "In Queue" : "Posted"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventsTableMobile
