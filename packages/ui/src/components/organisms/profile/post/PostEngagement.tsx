import { PostDto } from "@passes/api-client"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import { FC, useCallback, useMemo, useState } from "react"

import { LikeButton } from "src/components/molecules/post/LikeButton"
import { TipButton } from "src/components/molecules/post/TipButton"
import { copyLinkToClipboard } from "src/helpers/clipboard"
import { compactNumberFormatter } from "src/helpers/formatters"
import { CommentSection } from "./CommentSection"

interface PostEngagementProps {
  post: PostDto
}

export const PostEngagement: FC<PostEngagementProps> = ({ post }) => {
  const {
    isLiked,
    isOwner,
    numComments: initialNumComments,
    numLikes,
    purchasable,
    postId,
    username,
    price,
    passIds
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
    <div className="flex w-full flex-col items-center justify-end">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-[25px] p-0 md:gap-[45px]">
          <LikeButton
            isLiked={isLiked}
            numLikes={numLikes}
            purchasable={purchasable}
            postId={postId}
          />
          <button
            type="button"
            aria-label="Toggle comments"
            disabled={purchasable}
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
        {/* or {passIds} */}

        {isOwner ? (
          <div className="text-sm font-normal text-gray-500">
            {price && !passIds.length
              ? `Viewable for $${price}`
              : !price && passIds.length
              ? "Requires a pass to view"
              : price && passIds.length
              ? `Viewable for $${price} or with pass`
              : "Free"}
          </div>
        ) : (
          <TipButton postId={postId} />
        )}
      </div>
      {showCommentSection && (
        <CommentSection
          postId={postId}
          incrementNumComments={incrementNumComments}
          decrementNumComments={decrementNumComments}
          ownsPost={isOwner}
        />
      )}
    </div>
  )
}
