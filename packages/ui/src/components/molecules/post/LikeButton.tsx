import { LikeApi, PostDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, useCallback, useMemo } from "react"

import { compactNumberFormatter } from "src/helpers/formatters"
import { HeartIcon } from "src/icons/HeartIcon"

interface LikeButtonProps
  extends Pick<PostDto, "isLiked" | "numLikes" | "postId"> {
  update: (update: Partial<PostDto>) => void
}

export const LikeButton: FC<LikeButtonProps> = ({
  isLiked,
  numLikes,
  postId,
  update
}) => {
  const toggleLike = useCallback(async () => {
    // Show optimistic update
    update({
      numLikes: isLiked ? numLikes - 1 : numLikes + 1,
      isLiked: !isLiked
    })

    // Make request to toggle like
    const likeApi = new LikeApi()
    try {
      if (isLiked) {
        await likeApi.unlikePost({ postId })
      } else {
        await likeApi.likePost({ postId })
      }
    } catch (error: unknown) {
      // Fail silently if the like fails
    }
  }, [isLiked, numLikes, postId, update])

  const formattedNumLikes = useMemo(
    () => compactNumberFormatter(numLikes),
    [numLikes]
  )

  return (
    <button
      aria-label="Toggle like"
      className={classNames(
        "flex min-w-[48px] cursor-pointer items-center gap-[5px] p-0",
        isLiked
          ? "stroke-[#F4245E] text-[#F4245E]"
          : "stroke-passes-gray-100 text-passes-gray-100 hover:stroke-white hover:text-white"
      )}
      onClick={toggleLike}
      type="button"
    >
      <HeartIcon fill={isLiked ? "#F4245E" : "none"} />
      <span className="min-w-[15px] text-[12px] leading-[15px]">
        {formattedNumLikes}
      </span>
    </button>
  )
}
