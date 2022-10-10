import { LikeApi, PostApi } from "@passes/api-client/apis"
import { PostDto } from "@passes/api-client/src/models/PostDto"
import dynamic from "next/dynamic"
import CostIcon from "public/icons/post-cost-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import { FC, useState } from "react"
import { compactNumberFormatter } from "src/helpers"
import { errorMessage } from "src/helpers/error"

import { CommentSection } from "./CommentSection"
import { copyToClipboard } from "./PostDropdown"

const TipPostModal = dynamic(
  () => import("src/components/organisms/payment/TipPostModal"),
  { ssr: false }
)

interface PostEngagementProps {
  post: PostDto
  postUnlocked: boolean
}

export const PostEngagement: FC<PostEngagementProps> = ({
  post,
  postUnlocked = false
}) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false)
  const [numLikes, setNumLikes] = useState(post.numLikes)
  const [numComments, setNumComments] = useState(post.numComments)
  const [liked, setLiked] = useState(post.isLiked)
  const [showCommentSection, setShowCommentSection] = useState(false)

  async function updateEngagement() {
    try {
      const api = new PostApi()
      const response = await api.findPost({
        postId: post.postId
      })

      setNumLikes(response.numLikes)
      setNumComments(response.numComments)
      setLiked(response.isLiked)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  const likePost = async () => {
    try {
      if (!postUnlocked) {
        return
      }

      const api = new LikeApi()

      if (!liked) {
        await api.likePost({
          postId: post.postId
        })
      } else {
        await api.unlikePost({
          postId: post.postId
        })
      }
      updateEngagement()
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-end">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-[25px] p-0 md:gap-[45px]">
          <div
            onClick={likePost}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <HeartIcon fill={liked ? "#A09FA6" : "none"} />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {compactNumberFormatter(numLikes)}
            </span>
          </div>
          <div
            onClick={() => {
              postUnlocked && setShowCommentSection((prev) => !prev)
            }}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <MessagesIcon />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {compactNumberFormatter(numComments)}
            </span>
          </div>
          <div className="flex cursor-pointer items-center gap-[5px] p-0">
            <ShareIcon onClick={() => copyToClipboard(post)} />
          </div>
        </div>
        <div
          onClick={() => setIsTipsModalOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-2 pr-2 text-passes-gray-100"
        >
          <CostIcon />
        </div>
      </div>
      <CommentSection
        postId={post.postId}
        visible={showCommentSection}
        updateEngagement={updateEngagement}
      />
      {isTipsModalOpen && (
        <TipPostModal
          isOpen={isTipsModalOpen}
          post={post}
          setOpen={setIsTipsModalOpen}
        />
      )}
    </div>
  )
}
