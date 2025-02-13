import { PostDto } from "@passes/api-client"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import { FC, memo, useCallback, useMemo, useState } from "react"

import { LikeButton } from "src/components/molecules/post/LikeButton"
import { TipButton } from "src/components/molecules/post/TipButton"
import { copyLinkToClipboard } from "src/helpers/clipboard"
import { compactNumberFormatter, formatCurrency } from "src/helpers/formatters"
import { CommentSection } from "./CommentSection"

interface PostEngagementProps {
  post: PostDto
  update: (update: Partial<PostDto>) => void
}

const PostEngagementUnmemo: FC<PostEngagementProps> = ({ post, update }) => {
  const {
    contentProcessed,
    isLiked,
    isOwner,
    numLikes,
    passIds,
    postId,
    price,
    username
  } = post

  const [showCommentSection, setShowCommentSection] = useState(false)
  const incrementNumComments = useCallback(
    () => update({ numComments: post.numComments + 1 }),
    [post, update]
  )

  const decrementNumComments = useCallback(
    () => update({ numComments: post.numComments - 1 }),
    [post, update]
  )
  const formattedNumComments = useMemo(
    () => compactNumberFormatter(post.numComments),
    [post.numComments]
  )

  const handleToggleComment = () => {
    setShowCommentSection((prev) => !prev)
  }

  return (
    <div className="flex w-full flex-col items-center justify-end px-5 sm:px-10 md:px-10 lg:px-5">
      <div className="flex w-full min-w-[340px] items-center justify-between overflow-x-hidden">
        <div className="flex items-start gap-[20px] p-0 md:gap-[45px]">
          <LikeButton
            isLiked={isLiked}
            numLikes={numLikes}
            postId={postId}
            update={update}
          />
          <button
            aria-label="Toggle comments"
            className="flex min-w-[48px] cursor-pointer items-center gap-[5px] stroke-[#A09FA6] p-0 text-passes-gray-100 hover:stroke-white hover:text-white"
            onClick={() => handleToggleComment()}
            type="button"
          >
            <MessagesIcon />
            <span className="min-w-[15px] text-[12px] leading-[15px]">
              {formattedNumComments}
            </span>
          </button>
          {contentProcessed && (
            <button
              aria-label="Copy link to post"
              className="flex min-w-[48px] cursor-pointer items-center gap-[5px] stroke-[#A09FA6] p-0 hover:stroke-white"
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
      <CommentSection
        decrementNumComments={decrementNumComments}
        hidden={!showCommentSection}
        incrementNumComments={incrementNumComments}
        ownsPost={isOwner}
        postId={postId}
      />
    </div>
  )
}

export const PostEngagement = memo(PostEngagementUnmemo)
