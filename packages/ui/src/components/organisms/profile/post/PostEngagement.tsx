import { PostDto } from "@passes/api-client"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import { FC, useCallback, useMemo, useState } from "react"

import { LikeButton } from "src/components/molecules/post/LikeButton"
import { TipButton } from "src/components/molecules/post/TipButton"
import { copyLinkToClipboard } from "src/helpers/clipboard"
import { compactNumberFormatter, formatCurrency } from "src/helpers/formatters"
import { CommentSection } from "./CommentSection"

interface PostEngagementProps {
  post: PostDto
}

export const PostEngagement: FC<PostEngagementProps> = ({ post }) => {
  const {
    contentProcessed,
    isLiked,
    isOwner,
    numComments: initialNumComments,
    numLikes,
    passIds,
    postId,
    price,
    username
  } = post

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
    <div className="flex w-full flex-col items-center justify-end overflow-x-hidden px-5 sm:px-10 md:px-10 lg:px-5">
      <div className="flex w-full min-w-[340px] items-center justify-between overflow-x-hidden">
        <div className="flex items-start gap-[25px] p-0 md:gap-[45px]">
          <LikeButton isLiked={isLiked} numLikes={numLikes} postId={postId} />
          <button
            aria-label="Toggle comments"
            className="flex cursor-pointer items-center gap-[5px] stroke-[#A09FA6] p-0 text-passes-gray-100 hover:stroke-white hover:text-white"
            onClick={() => setShowCommentSection((prev) => !prev)}
            type="button"
          >
            <MessagesIcon />
            <span className="text-[12px] leading-[15px]">
              {formattedNumComments}
            </span>
          </button>
          {contentProcessed && (
            <button
              aria-label="Copy link to post"
              className="flex cursor-pointer items-center gap-[5px] stroke-[#A09FA6] p-0 hover:stroke-white"
              type="button"
            >
              <ShareIcon
                onClick={() => copyLinkToClipboard(username, postId)}
              />
            </button>
          )}
        </div>

        {isOwner ? (
          <div className="flex flex-col text-sm font-normal text-gray-500">
            <span>
              {price && !passIds.length
                ? `Viewable for $${price}`
                : !price && passIds.length
                ? "Requires a pass to view"
                : price && passIds.length
                ? `Viewable for $${price} or with pass`
                : "Free"}
            </span>
            <span>Tips: {formatCurrency(post.totalTipAmount ?? 0)}</span>
          </div>
        ) : (
          <div>
            <div className="flex flex-row flex-wrap justify-end gap-3 text-sm font-normal text-gray-500">
              <span className="pt-[0.35rem] text-center">
                Tipped: {formatCurrency(post.yourTips)}
              </span>
              <TipButton post={post} />
            </div>
          </div>
        )}
      </div>
      {showCommentSection && (
        <CommentSection
          decrementNumComments={decrementNumComments}
          incrementNumComments={incrementNumComments}
          ownsPost={isOwner}
          postId={postId}
        />
      )}
    </div>
  )
}
