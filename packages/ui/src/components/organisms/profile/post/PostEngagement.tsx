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
    <div className="flex w-full flex-col items-center justify-end overflow-x-hidden px-5 sm:px-10 md:px-10 lg:px-5">
      <div className="flex w-full min-w-[340px] items-center justify-between overflow-x-hidden">
        <div className="flex items-start gap-[25px] p-0 md:gap-[45px]">
          <LikeButton isLiked={isLiked} numLikes={numLikes} postId={postId} />
          <button
            aria-label="Toggle comments"
            className="flex cursor-pointer items-center gap-[5px] p-0"
            onClick={() => setShowCommentSection((prev) => !prev)}
            type="button"
          >
            <MessagesIcon />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {formattedNumComments}
            </span>
          </button>
          <button
            aria-label="Copy link to post"
            className="flex cursor-pointer items-center gap-[5px] p-0"
            type="button"
          >
            <ShareIcon onClick={() => copyLinkToClipboard(username, postId)} />
          </button>
        </div>

        {isOwner ? (
          <div className="text-sm font-normal text-gray-500">
            <span>
              {price && !passIds.length
                ? `Viewable for $${price}`
                : !price && passIds.length
                ? "Requires a pass to view"
                : price && passIds.length
                ? `Viewable for $${price} or with pass`
                : "Free"}
            </span>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap text-sm font-normal text-gray-500">
            <span className="mr-4 pt-[0.35rem] text-center">
              Tipped: ${post.yourTips}
            </span>
            <TipButton post={post} />
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
