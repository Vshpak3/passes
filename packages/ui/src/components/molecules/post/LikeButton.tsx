import { LikeApi, PostDto } from "@passes/api-client"
import classNames from "classnames"
import React, { FC, useCallback, useMemo, useState } from "react"

import { errorMessage } from "src/helpers/error"
import { compactNumberFormatter } from "src/helpers/formatters"
import { HeartIcon } from "src/icons/HeartIcon"

type LikeButtonProps = Pick<PostDto, "isLiked" | "numLikes" | "postId">

export const LikeButton: FC<LikeButtonProps> = ({
  isLiked: initialIsLiked,
  numLikes: initialNumLikes,
  postId
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [numLikes, setNumLikes] = useState(initialNumLikes)

  const toggleLike = useCallback(async () => {
    // Show optimistic update
    setNumLikes((state) => (isLiked ? state - 1 : state + 1))
    setIsLiked((state) => !state)

    // Make request to toggle like
    const likeApi = new LikeApi()
    try {
      if (isLiked) {
        await likeApi.unlikePost({ postId })
      } else {
        await likeApi.likePost({ postId })
      }
    } catch (error: unknown) {
      errorMessage(error, true)

      // Revert optimistic update
      setNumLikes((state) => (isLiked ? state + 1 : state - 1))
      setIsLiked((state) => !state)
    }
  }, [isLiked, postId])

  const formattedNumLikes = useMemo(
    () => compactNumberFormatter(numLikes),
    [numLikes]
  )

  return (
    <button
      aria-label="Toggle like"
      className="flex cursor-pointer items-center gap-[5px] p-0"
      onClick={toggleLike}
      type="button"
    >
      <HeartIcon
        fill={isLiked ? "#F4245E" : "none"}
        strokeColor={isLiked ? "#F4245E" : "#A09FA6"}
      />
      <span
        className={classNames(
          "text-[12px] leading-[15px] text-passes-gray-100",
          isLiked && "text-[#F4245E]"
        )}
      >
        {formattedNumLikes}
      </span>
    </button>
  )
}
