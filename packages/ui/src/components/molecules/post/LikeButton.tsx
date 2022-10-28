import { LikeApi, PostDto } from "@passes/api-client"
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
      type="button"
      aria-label="Toggle like"
      onClick={toggleLike}
      className="flex cursor-pointer items-center gap-[5px] p-0"
    >
      <HeartIcon
        fill={isLiked ? "#FF60DC" : "none"}
        strokeWidth={isLiked ? "0" : "2"} // TODO: fix
      />
      <span className="text-[12px] leading-[15px] text-passes-gray-100">
        {formattedNumLikes}
      </span>
    </button>
  )
}
