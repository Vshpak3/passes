import { CalendarClock, Edit3, Lock, Trash2, Unlock } from "lucide-react"
import { SetStateAction } from "react"

import postsData from "./posts.json"

type PropsType = {
  setShowDeletePostModal: React.Dispatch<SetStateAction<boolean>>
}

const EventsTableDesktop = ({ setShowDeletePostModal }: PropsType) => {
  return (
    <div className="mb-[100px] min-h-[190px] rounded-[20px] border border-[#ffffff26] p-[20px]">
      <div className="mb-[25px] flex text-base font-medium text-[#ffffff80]">
        <div className="w-1/3">Name</div>
        <div className="w-1/4">Content</div>
        <div className="w-1/5">Date</div>
        <div className="w-1/4">Action</div>
      </div>
      {postsData.map((item) => (
        <div
          key={item.id}
          className="mb-[22px] flex text-[13px] font-normal md:font-medium lg:text-[16px]"
        >
          <div className="flex w-1/3 items-center">
            <div className="mr-[15px] h-[75px] w-[75px] rounded-[10px] bg-[#E6C4EA]"></div>
            <div
              className={`flex h-[45px] items-center justify-center rounded-[50px] py-[10px] px-[15px] ${
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
          </div>
          <div className="flex w-[25%] items-center">{item.content}</div>
          <div className="flex w-[20%] items-center">{item.date}</div>
          <div className="flex w-[12.5%] items-center">
            <div
              className={`${
                item.status === "queued" ? "text-[#C9BC43]" : "text-[white]"
              } mr-[20px] overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {item.status === "queued" ? "In Queue" : "Re-schedule"}
            </div>
          </div>
          <div className="flex w-[12.5%] items-center">
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
      ))}
    </div>
  )
}

export default EventsTableDesktop
