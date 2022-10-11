import { PostDto } from "@passes/api-client"
import { LikeApi, PostApi } from "@passes/api-client/apis"
import dynamic from "next/dynamic"
import CostIcon from "public/icons/post-cost-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import { FC, useState } from "react"
import { copyLinkToClipboard } from "src/helpers/clipboard"
import { errorMessage } from "src/helpers/error"
import { compactNumberFormatter } from "src/helpers/formatters"

import { CommentSection } from "./CommentSection"
const TipPostModal = dynamic(
  () => import("src/components/organisms/payment/TipPostModal"),
  { ssr: false }
)

type PostEngagementProps = Pick<
  PostDto,
  | "numLikes"
  | "numComments"
  | "isLiked"
  | "isOwner"
  | "postId"
  | "paywall"
  | "username"
>

export const PostEngagement: FC<PostEngagementProps> = ({
  numLikes: initialNumLikes,
  numComments: initialNumComments,
  isLiked: initialIsLiked,
  isOwner,
  postId,
  paywall,
  username
}) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false)
  const [numLikes, setNumLikes] = useState(initialNumLikes)
  const [numComments, setNumComments] = useState(initialNumComments)
  const [liked, setLiked] = useState(initialIsLiked)
  const [showCommentSection, setShowCommentSection] = useState(false)

  async function updateEngagement() {
    try {
      const api = new PostApi()
      const response = await api.findPost({ postId })

      setNumLikes(response.numLikes)
      setNumComments(response.numComments)
      setLiked(response.isLiked)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  const likePost = async () => {
    try {
      if (paywall) {
        return
      }

      const api = new LikeApi()

      if (!liked) {
        await api.likePost({ postId })
      } else {
        await api.unlikePost({ postId })
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
              !paywall && setShowCommentSection((prev) => !prev)
            }}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <MessagesIcon />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {compactNumberFormatter(numComments)}
            </span>
          </div>
          <div className="flex cursor-pointer items-center gap-[5px] p-0">
            <ShareIcon onClick={() => copyLinkToClipboard(username, postId)} />
          </div>
        </div>
        <div
          onClick={() => setIsTipsModalOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-2 pr-2 text-passes-gray-100"
        >
          <CostIcon />
        </div>
      </div>
      {showCommentSection && (
        <CommentSection
          postId={postId}
          updateEngagement={updateEngagement}
          ownsPost={isOwner}
        />
      )}
      {isTipsModalOpen && (
        <TipPostModal
          isOpen={isTipsModalOpen}
          setOpen={setIsTipsModalOpen}
          postId={postId}
        />
      )}
    </div>
  )
}
