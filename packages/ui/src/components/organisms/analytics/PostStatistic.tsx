import { PostDto } from "@passes/api-client"
import { format } from "date-fns"
import Link from "next/link"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { DeletePostModal } from "src/components/organisms/profile/post/DeletePostModal"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { usePost } from "src/hooks/profile/usePost"

interface PostStatisticProps {
  post: PostDto
}

export const PostStatistic: FC<PostStatisticProps> = ({ post }) => {
  const [deleted, setDeleted] = useState<boolean>(false)
  const [deletePostModelOpen, setDeletePostModelOpen] = useState(false)
  const { removePost } = usePost()

  const {
    postId,
    createdAt,
    userId,
    text,
    contents,
    price,
    totalTipAmount,
    earningsPurchases,
    expiresAt,
    deletedAt,
    numPurchases
  } = post

  const onDelete = async () => {
    try {
      await removePost(postId)
      setDeleted(true)
    } catch (error: unknown) {
      toast.error("Failed to delete: please contact support")
    }
  }

  const handleConfirmDelete = () => {
    setDeletePostModelOpen(true)
  }

  return (
    <>
      <div className="flex flex-row justify-between border-b border-passes-dark-200">
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <Link href={`/${userId}/${postId}`}>
            <span className="text-[12px] font-[500]">
              {format(createdAt, "LL/dd/yyyy")}
              <br />
              {format(createdAt, "hh:mm a")}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] w-[100px] flex-1 items-center justify-start overflow-hidden">
          <Link href={`/${userId}/${postId}`}>
            <span className="passes-break w-full overflow-hidden truncate whitespace-pre-wrap text-[14px] font-[700]">
              {formatText(text)}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <Link href={`/${userId}/${postId}`}>
            <span className="text-[12px] font-[500]">
              {contents?.length ?? 0}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <Link href={`/${userId}/${postId}`}>
            <span className="text-[12px] font-[500]">
              {formatCurrency(price ?? 0)}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <span className="text-[12px] font-[500]">{numPurchases}</span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[12px] font-[500]">
            {formatCurrency(totalTipAmount ?? 0)}
          </span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[12px] font-[500]">
            {formatCurrency(earningsPurchases)}
          </span>
        </div>

        <div className="flex h-[72px] flex-1 items-center justify-start">
          {!deleted && !deletedAt && (!expiresAt || expiresAt > new Date()) ? (
            <span className="w-full overflow-hidden truncate text-center text-[14px] font-[700] text-passes-pink-100">
              <Button onClick={handleConfirmDelete}>Delete</Button>
            </span>
          ) : (
            <span className="w-full overflow-hidden truncate text-center text-[14px] font-[700] text-gray-500">
              Deleted
            </span>
          )}
        </div>
      </div>
      {deletePostModelOpen && (
        <DeletePostModal
          onDelete={onDelete}
          post={post}
          setOpen={setDeletePostModelOpen}
        />
      )}
    </>
  )
}
