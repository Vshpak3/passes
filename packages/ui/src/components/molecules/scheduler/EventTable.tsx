import { PostDto } from "@passes/api-client"
import { format } from "date-fns"
import Calendar from "public/icons/calendar-minus.svg"
import { FC, useCallback, useEffect, useState } from "react"
import { EventTableItem } from "src/components/molecules/scheduler/EventTableItem"
import { CalendarProps, useScheduledPosts } from "src/hooks/useScheduledPosts"

import { DeleteEventModal } from "./DeleteEventModal"

export const EventTable: FC<CalendarProps> = ({ month, year }) => {
  const { data, setMonthYear, deletePost } = useScheduledPosts()

  const [selectEventIdDelete, setSelectEventIdDelete] = useState<string | null>(
    null
  )
  const [isDeletingPost, setIsDeletingPost] = useState<boolean>(false)

  const handleOnDeleteEvent = useCallback((targetId: string) => {
    setSelectEventIdDelete(targetId)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setSelectEventIdDelete(null)
  }, [])

  const handleDeleteEvent = useCallback(async () => {
    if (!selectEventIdDelete) {
      return
    }
    setIsDeletingPost(true)
    await deletePost(selectEventIdDelete)
    setSelectEventIdDelete(null)
    setIsDeletingPost(false)
  }, [selectEventIdDelete, deletePost])

  useEffect(() => {
    setMonthYear({ month, year })
  }, [month, year, setMonthYear])

  return (
    <div className="px-[15px] md:px-[30px]">
      <div className="mb-9 select-none text-base font-bold md:text-2xl">
        Scheduled Posts In {format(new Date(year, month, 1), "LLLL")}
      </div>
      {!data?.length ? (
        <div className="mb-[30px] flex h-[295px] w-full flex-col items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] py-5 backdrop-blur-[50px]">
          <Calendar />
          <span className="mt-3 text-white opacity-50">
            There are no scheduled events for this day
          </span>
        </div>
      ) : (
        <div className="mb-[30px] w-full overflow-auto rounded-[20px] py-5 md:border md:border-[rgba(255,255,255,0.15)] md:bg-[rgba(27,20,29,0.5)] md:backdrop-blur-[50px]">
          {selectEventIdDelete && (
            <DeleteEventModal
              isDeleting={isDeletingPost}
              onCancel={handleCancelDelete}
              onDelete={handleDeleteEvent}
            />
          )}
          <table className="w-full">
            <tr className="hidden pb-2 text-left text-base font-medium leading-6 text-white opacity-50 md:contents">
              <th className="pl-5 pb-1">Name</th>
              <th className="px-3 pb-1">Text</th>
              <th className="pb-1 text-center">Date</th>
              <th className="pb-1">Action</th>
            </tr>
            {data?.map((item: PostDto) => {
              const { postId, price, text, scheduledAt, paywall } = item

              return (
                <EventTableItem
                  key={postId}
                  id={postId}
                  price={price}
                  text={text}
                  scheduledAt={scheduledAt as Date}
                  data={item}
                  onDeleteEvent={handleOnDeleteEvent}
                  postUnlocked={!paywall}
                />
              )
            })}
          </table>
        </div>
      )}
    </div>
  )
}
