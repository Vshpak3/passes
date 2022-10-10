import { PostApi } from "@passes/api-client"
import { format } from "date-fns"
import Calendar from "public/icons/calendar-minus.svg"
import { FC, useCallback, useEffect, useState } from "react"
import EventTableItem from "src/components/molecules/scheduler/EventTableItem"

import DeleteEventModal from "./DeleteEventModal"

const postApi = new PostApi()

const EventTable: FC = () => {
  const [selectEventIdDelete, setSelectEventIdDelete] = useState<number>(-1)
  const [posts, setPosts] = useState<Array<any>>([])

  useEffect(() => {
    ;(async function () {
      const scheduledPosts = await postApi.getPosts({
        getPostsRequestDto: {
          scheduledOnly: true
        }
      })
      setPosts(scheduledPosts.data)
    })()
  }, [])

  const handleOnDeleteEvent = useCallback((targetId: number) => {
    setSelectEventIdDelete(targetId)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setSelectEventIdDelete(-1)
  }, [])

  const handleDeleteEvent = useCallback(() => {
    setSelectEventIdDelete(-1)
  }, [])

  return (
    <div className="px-[15px] md:px-[30px]">
      <div className="mb-9 select-none text-base font-bold md:text-2xl">
        Scheduled event
      </div>
      {posts.length === 0 ? (
        <div className="mb-[30px] flex h-[295px] w-full flex-col items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] py-5 backdrop-blur-[50px]">
          <Calendar />
          <span className="mt-3 text-white opacity-50">
            There are no scheduled events for this day
          </span>
        </div>
      ) : (
        <div className="mb-[30px] w-full rounded-[20px] py-5 md:border md:border-[rgba(255,255,255,0.15)] md:bg-[rgba(27,20,29,0.5)] md:backdrop-blur-[50px]">
          {selectEventIdDelete > -1 && (
            <DeleteEventModal
              onCancel={handleCancelDelete}
              onDelete={handleDeleteEvent}
            />
          )}
          <table className="w-full">
            <tr className="hidden pb-2 text-left text-base font-medium leading-6 text-white opacity-50 md:contents">
              <th className="pl-5 pb-1">Name</th>
              <th className="pb-1">Content</th>
              <th className="pb-1">Date</th>
              <th className="pb-1">Action</th>
            </tr>
            {posts.map((item: any, index: number) => {
              const { price, text, scheduledAt, expiresAt } = item
              return (
                <EventTableItem
                  key={index}
                  id={index}
                  price={price}
                  text={text}
                  scheduledAt={format(scheduledAt, "dd MMMM yyyy")}
                  expiresAt={expiresAt}
                  onDeleteEvent={handleOnDeleteEvent}
                />
              )
            })}
          </table>
        </div>
      )}
    </div>
  )
}

export default EventTable
