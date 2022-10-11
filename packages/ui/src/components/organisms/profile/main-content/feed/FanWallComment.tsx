import { FanWallApi, FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms"
import { DropdownOption } from "src/components/organisms/profile/post/PostDropdown"
import { PostProfileAvatar } from "src/components/organisms/profile/post/PostProfileAvatar"
import { useBlockModal } from "src/hooks/useBlockModal"
import { usePostData } from "src/hooks/usePostData"
import { useReportModal } from "src/hooks/useReportModal"

interface FanWallCommentProps {
  removable: boolean
  comment: FanWallCommentDto
  ownsProfile: boolean
}

export const FanWallComment: FC<FanWallCommentProps> = ({
  ownsProfile,
  comment,
  removable
}) => {
  const postData = usePostData()
  const api = new FanWallApi()

  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()

  const [removed, setRemoved] = useState<boolean>(false)
  const dropdownItems: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setIsReportModalOpen(true)
    },
    {
      text: "Block",
      onClick: () => setIsBlockModalOpen(true)
    },
    ...(ownsProfile || comment.isOwner
      ? [
          {
            text: "Delete comment",
            onClick: async () => {
              await api.deleteFanWallComment({
                fanWallCommentId: comment.fanWallCommentId
              })
              if (removable) {
                setRemoved(true)
              }
            }
          }
        ]
      : []), //TODO: add unhide
    ...(ownsProfile && !comment.isOwner
      ? [
          {
            text: "Hide comment",
            onClick: async () => {
              await api.hideFanWallComment({
                fanWallCommentId: comment.fanWallCommentId
              })
            }
          }
        ]
      : [])
  ]
  return (
    <ConditionRendering condition={!removed}>
      <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
        <PostProfileAvatar
          dropdownOptions={dropdownItems}
          hideStatisticsBtn={true}
        />
        <div className="flex flex-col items-start">
          <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
            {postData.text}
          </p>
        </div>
      </FormContainer>
    </ConditionRendering>
  )
}
