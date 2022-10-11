import { PostApi, PostDto } from "@passes/api-client"
import { compareAsc, format } from "date-fns"
import EditIcon from "public/icons/edit.svg"
import LockedUnlockedIcon from "public/icons/lock-unlocked.svg"
import TrashIcon from "public/icons/trash.svg"
import { FC, useCallback, useState } from "react"
import { Dialog as NewPostDialog } from "src/components/organisms"
import { NewPost } from "src/components/organisms/profile/main-content/new-post/NewPost"
import useWindowDimensions from "src/helpers/hooks/useWindowDimensions"
import { mutate } from "swr"

import { CACHE_KEY_SCHEDULED_EVENTS } from "./EventTable"

interface EventTableItemProps {
  id: string
  price?: number
  text: string
  scheduledAt: Date
  onDeleteEvent: (id: string) => void
  data: PostDto
}

const postAPI = new PostApi()

const EditButtonGroup: FC<any> = ({ id, data }) => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  const handleUpdatePost = async (values: any) => {
    await postAPI.updatePost({
      postId: id,
      updatePostRequestDto: values
    })
    setIsNewPostModalOpen(false)
    mutate(CACHE_KEY_SCHEDULED_EVENTS)
  }

  return (
    <NewPostDialog
      open={isNewPostModalOpen}
      triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-0"
      className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
      trigger={<EditIcon onClick={() => setIsNewPostModalOpen(true)} />}
    >
      <NewPost
        isExtended
        passes={[]}
        initialData={data}
        createPost={handleUpdatePost}
        placeholder="What's on your mind?"
      />
    </NewPostDialog>
  )
}

const today = new Date()

const EventTableItem: FC<EventTableItemProps> = ({
  id,
  price,
  text,
  data,
  scheduledAt,
  onDeleteEvent
}) => {
  const { width = 0 } = useWindowDimensions()

  const generateButtonName = useCallback(() => {
    if (price && price >= 0) {
      return (
        <button className="flex min-w-[175px] items-center justify-center gap-3 rounded-[50px] bg-passes-pink-100 py-[6px] text-white md:py-[13px]">
          <LockedUnlockedIcon /> {price}
        </button>
      )
    }
    return (
      <button className="flex min-w-[175px] items-center justify-center gap-3 rounded-[50px] bg-passes-primary-color py-[6px] text-white md:py-[13px]">
        {price}
      </button>
    )
  }, [price])

  const generateActionStatus = useCallback(() => {
    const isPosted = compareAsc(new Date(scheduledAt), today) === -1

    if (isPosted) {
      return (
        <div className="flex items-center">
          <span className="mr-6 text-passes-green-100">Posted</span>
        </div>
      )
    }
    return (
      <div className="flex items-center">
        <span className="mr-6 text-passes-yellow">In queue</span>
        <TrashIcon
          className="mr-3 cursor-pointer"
          onClick={() => onDeleteEvent(id)}
        />
        <EditButtonGroup id={id} data={data} />
      </div>
    )
  }, [data, id, onDeleteEvent, scheduledAt])

  if (width < 768) {
    return (
      <div className="mb-8 px-5">
        <div className="mb-6 flex items-center justify-between">
          <span>{format(scheduledAt, "LLLL do, yyyy")}</span>
          <span>{generateActionStatus()}</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="mr-3 h-[125px] w-[125px] rounded-[12px] bg-passes-gray-400 backdrop-blur-[28px]" />
          <div className="flex flex-col gap-2">
            <div>{generateButtonName()}</div>
            <span>{text}</span>
            <span>{generateActionStatus()}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <tr className="px-5 odd:bg-passes-purple-200">
      <td className="my-[6px] flex items-center pl-5">
        <div className="mr-3 h-[75px] w-[75px] rounded-[12px] bg-passes-gray-400 backdrop-blur-[28px]" />
        {generateButtonName()}
      </td>
      <td className="my-[6px]">{text}</td>
      <span>{format(scheduledAt, "LLLL do, yyyy")}</span>
      <td className="my-[6px]">{generateActionStatus()}</td>
    </tr>
  )
}

export default EventTableItem
