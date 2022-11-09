import { PostDto } from "@passes/api-client"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import React, { FC } from "react"

import { Button } from "src/components/atoms/button/Button"
import { useTipPostModal } from "src/hooks/context/useTipPostModal"

interface TipButtonProps {
  post: PostDto
}

export const TipButton: FC<TipButtonProps> = ({ post }) => {
  const { setPost } = useTipPostModal()

  return (
    <Button
      aria-label="Tip post"
      className="m-auto flex flex-row rounded-[5px] bg-[#B52A6F]/[0.25] py-[3px] pl-[9px] pr-[12px]"
      onClick={() => setPost(post)}
    >
      <DollarIcon />{" "}
      <span className="pt-[2px] text-center hover:text-white">Send Tip</span>
    </Button>
  )
}
