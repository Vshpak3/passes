import { PostDto } from "@passes/api-client"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms/Button"
import { formatText } from "src/helpers/formatters"
import { usePost } from "src/hooks/usePost"

interface PostStatisticProps {
  post: PostDto
}

export const PostStatistic = ({ post }: PostStatisticProps) => {
  const [deleted, setDeleted] = useState<boolean>(false)
  const { removePost } = usePost()

  const deletePost = async () => {
    try {
      await removePost(post.postId)
      setDeleted(true)
    } catch (error: any) {
      toast.error("Failed to delete: please contact support")
    }
  }

  return (
    <div className="flex flex-row justify-between border-b border-passes-dark-200">
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700]">
          {post.createdAt.toLocaleString()}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-start overflow-hidden">
        <span className="w-full overflow-hidden text-ellipsis text-[14px] font-[700]">
          {formatText(post.text)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {post.contents?.length ?? 0}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {"$" + (post.price ?? 0).toFixed(2)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{post.numPurchases}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">{post.totalTipAmount}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">{post.earningsPurchases}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-start">
        {!deleted && !post.deletedAt ? (
          <span className="w-full overflow-hidden text-ellipsis text-center text-[14px] font-[700] text-passes-pink-100">
            <Button onClick={deletePost}>Delete</Button>
          </span>
        ) : (
          <span className="w-full overflow-hidden text-ellipsis text-center text-[14px] font-[700] text-gray-500">
            Deleted
          </span>
        )}
      </div>
    </div>
  )
}
