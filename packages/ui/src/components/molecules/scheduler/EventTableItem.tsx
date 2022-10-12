import { PostApi, PostDto } from "@passes/api-client"
import { compareAsc, format } from "date-fns"
import EditIcon from "public/icons/edit.svg"
import TrashIcon from "public/icons/trash.svg"
import { FC, useCallback, useEffect, useState } from "react"
import { PostUnlockButton } from "src/components/atoms/Button"
import { Dialog } from "src/components/organisms/Dialog"
import { NewPost } from "src/components/organisms/profile/main-content/new-post/NewPost"
import { formatCurrency } from "src/helpers/formatters"
import { useWindowDimensions } from "src/helpers/hooks/useWindowDimensions"
import { CACHE_KEY_SCHEDULED_EVENTS } from "src/hooks/useScheduledPosts"
import { mutate } from "swr"

interface EventTableItemProps {
  id: string
  price?: number
  text: string
  scheduledAt: Date
  onDeleteEvent: (id: string) => void
  data: PostDto
  postUnlocked: boolean
}

const postAPI = new PostApi()

export const EditButtonGroup: FC<any> = ({ id, data }) => {
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
    <Dialog
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
        onlyText
      />
    </Dialog>
  )
}

const today = new Date()

export const EventTableItem: FC<EventTableItemProps> = ({
  id,
  price,
  text,
  data,
  scheduledAt,
  onDeleteEvent,
  postUnlocked
}) => {
  const { width = 0 } = useWindowDimensions()
  const [showcaseImg, setShowcaseImg] = useState<null | string>(null)

  // Set image if it exists in post
  useEffect(() => {
    if (data.content?.[0]?.contentType === "image") {
      setShowcaseImg(data.content[0].signedUrl as string)
    }
  }, [data.content])

  const generateButtonName = useCallback(() => {
    if (postUnlocked) {
      return <div>Unlocked</div>
    }

    return (
      <PostUnlockButton
        name={`${formatCurrency(price ?? 0)}`}
        className="w-auto cursor-default !px-5 !py-2.5"
      />
    )
  }, [price, postUnlocked])

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
        <div className="relative mr-3 h-[75px] w-[75px] overflow-hidden rounded-[12px] bg-passes-gray-400 backdrop-blur-[28px]">
          {showcaseImg && (
            <img
              src={showcaseImg}
              alt="user profile"
              className="absolute h-full w-full object-cover object-center"
            />
          )}
        </div>
        {generateButtonName()}
      </td>
      <td className="my-[6px] max-w-[350px] truncate px-3">{text}</td>
      <td className="min-w-[150px] text-center">
        {format(scheduledAt, "LLLL do, yyyy 'at' hh:mm a")}
      </td>
      <td className="my-[6px] min-w-[170px] whitespace-nowrap px-3">
        {generateActionStatus()}
      </td>
    </tr>
  )
}
