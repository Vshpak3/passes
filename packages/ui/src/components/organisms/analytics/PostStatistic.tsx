import { PostDto } from "@passes/api-client"
import Link from "next/link"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/Button"
import { DeletePostModal } from "src/components/organisms/profile/post/DeletePostModal"
import { formatText } from "src/helpers/formatters"
import { usePost } from "src/hooks/profile/usePost"

interface PostStatisticProps {
  post: PostDto
}

export const PostStatistic: FC<PostStatisticProps> = ({ post }) => {
  const [deleted, setDeleted] = useState<boolean>(false)
  const [deletePostModelOpen, setDeletePostModelOpen] = useState(false)
  const { removePost } = usePost()

  const onDelete = async () => {
    try {
      await removePost(post.postId)
      setDeleted(true)
    } catch (error: any) {
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
          <Link href={`/${post.userId}/${post.postId}`}>
            <a>
              <span className="text-[14px] font-[700]">
                {post.createdAt.toLocaleString()}
              </span>
            </a>
          </Link>
        </div>
        <div className="flex h-[72px] w-[100px] flex-1 items-center justify-start overflow-hidden">
          <Link href={`/${post.userId}/${post.postId}`}>
            <a>
              <span className="w-full overflow-hidden truncate text-ellipsis whitespace-normal break-words text-[14px] font-[700]">
                {formatText(post.text)}
              </span>
            </a>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <Link href={`/${post.userId}/${post.postId}`}>
            <a>
              <span className="text-[12px] font-[500]">
                {post.contents?.length ?? 0}
              </span>
            </a>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <Link href={`/${post.userId}/${post.postId}`}>
            <a>
              <span className="text-[12px] font-[500]">
                {"$" + (post.price ?? 0).toFixed(2)}
              </span>
            </a>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <span className="text-[12px] font-[500]">{post.numPurchases}</span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[12px] font-[500]">{post.totalTipAmount}</span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[12px] font-[500]">
            {post.earningsPurchases}
          </span>
        </div>

        <div className="flex h-[72px] flex-1 items-center justify-start">
          {!deleted && !post.deletedAt ? (
            <span className="w-full overflow-hidden text-ellipsis text-center text-[14px] font-[700] text-passes-pink-100">
              <Button onClick={handleConfirmDelete}>Delete</Button>
            </span>
          ) : (
            <span className="w-full overflow-hidden text-ellipsis text-center text-[14px] font-[700] text-gray-500">
              Deleted
            </span>
          )}
        </div>
      </div>
      {deletePostModelOpen && (
        <DeletePostModal
          post={post}
          onDelete={onDelete}
          setOpen={setDeletePostModelOpen}
        />
      )}
    </>
  )
}
