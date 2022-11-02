import { PostDto } from "@passes/api-client"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import React, { FC } from "react"

import { useTipPostModal } from "src/hooks/context/useTipPostModal"

interface TipButtonProps {
  post: PostDto
}

export const TipButton: FC<TipButtonProps> = ({ post }) => {
  const { setPost } = useTipPostModal()

  return (
    <button aria-label="Tip post" onClick={() => setPost(post)}>
      <DollarIcon />
    </button>
  )
}
