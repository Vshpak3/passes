import { FormContainer } from "src/components/organisms"

import { PostProfileAvatar } from "./post"

interface Props {
  post: {
    text: string
  }
  profile: {
    userId: string
    profileImageUrl: string
    fullName: string
  }
  dropdownItems: Array<{
    text: string
    onClick: () => void
  }>
}

export const Comment = ({ profile, post, dropdownItems }: Props) => {
  return (
    <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
      <PostProfileAvatar
        post={post}
        profile={profile}
        dropdownItems={dropdownItems}
      />
      <div className="flex flex-col items-start">
        <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
          {post.text}
        </p>
      </div>
    </FormContainer>
  )
}
