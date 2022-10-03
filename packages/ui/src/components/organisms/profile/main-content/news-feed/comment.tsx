import { PostDto } from "@passes/api-client"
import { FC } from "react"
import { FormContainer } from "src/components/organisms"

import { PostProfileAvatar } from "./post"

interface CommentProps {
  post: PostDto
  dropdownItems: Array<{
    text: string
    onClick: () => void
  }>
}

export const Comment: FC<CommentProps> = ({ post, dropdownItems }) => {
  return (
    <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
      <PostProfileAvatar post={post} dropdownItems={dropdownItems} />
      <div className="flex flex-col items-start">
        <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
          {post.text}
        </p>
      </div>
    </FormContainer>
  )
}
