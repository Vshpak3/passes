import { FC } from "react"
import { FormContainer } from "src/components/organisms"
import { DropdownOption } from "src/components/organisms/profile/post/PostDropdown"
import { PostProfileAvatar } from "src/components/organisms/profile/post/PostProfileAvatar"
import { usePostData } from "src/hooks/usePostData"

interface FanWallCommentProps {
  dropdownOptions: DropdownOption[]
}

export const FanWallComment: FC<FanWallCommentProps> = ({
  dropdownOptions
}) => {
  const postData = usePostData()

  return (
    <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
      <PostProfileAvatar dropdownOptions={dropdownOptions} hideStatisticsBtn />
      <div className="flex flex-col items-start">
        <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
          {postData.text}
        </p>
      </div>
    </FormContainer>
  )
}
