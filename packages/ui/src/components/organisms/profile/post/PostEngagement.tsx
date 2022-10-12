import { PostDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import CostIcon from "public/icons/post-cost-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import { FC, useCallback, useMemo, useState } from "react"
import { LikeButton } from "src/components/molecules/post/LikeButton"
import { copyLinkToClipboard } from "src/helpers/clipboard"
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
  numLikes,
  numComments: initialNumComments,
  isLiked,
  isOwner,
  postId,
  paywall,
  username
}) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false)
  const [numComments, setNumComments] = useState(initialNumComments)
  const [showCommentSection, setShowCommentSection] = useState(false)

  const incrementNumComments = useCallback(
    () => setNumComments((state) => state + 1),
    []
  )

  const decrementNumComments = useCallback(
    () => setNumComments((state) => state - 1),
    []
  )

  const formattedNumComments = useMemo(
    () => compactNumberFormatter(numComments),
    [numComments]
  )

  return (
    <div className="flex w-full flex-col items-center justify-end">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-[25px] p-0 md:gap-[45px]">
          <LikeButton
            isLiked={isLiked}
            numLikes={numLikes}
            paywall={paywall}
            postId={postId}
          />
          <button
            type="button"
            aria-label="Toggle comments"
            disabled={paywall}
            onClick={() => setShowCommentSection((prev) => !prev)}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <MessagesIcon />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {formattedNumComments}
            </span>
          </button>
          <button
            type="button"
            aria-label="Copy link to post"
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <ShareIcon onClick={() => copyLinkToClipboard(username, postId)} />
          </button>
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
          incrementNumComments={incrementNumComments}
          decrementNumComments={decrementNumComments}
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
