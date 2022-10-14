import { PostApi, PostDto } from "@passes/api-client"
import React, { useState } from "react"
import { Button } from "src/components/atoms/Button"

interface PostStatisticProps {
  post: PostDto
}

export const PostStatistic = ({ post }: PostStatisticProps) => {
  const [deleted, setDeleted] = useState<boolean>(false)

  const deletePost = async () => {
    const postApi = new PostApi()
    await postApi.removePost({ postId: post.postId })
    setDeleted(true)
  }
  const canDelete = !deleted && !post.deletedAt
  return (
    <div className="flex flex-row justify-between border-b border-passes-dark-200">
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700]">
          {post.createdAt.toLocaleString()}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] ">{post.text}</span>
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
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {canDelete && <Button onClick={deletePost}>Delete</Button>}
          {!canDelete && <>Deleted</>}
        </span>
      </div>
    </div>
  )
}
