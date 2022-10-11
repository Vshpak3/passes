import { FanWallApi, FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/post/PostDropdown"
import { PostProfileAvatar } from "src/components/organisms/profile/post/PostProfileAvatar"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useProfile } from "src/hooks/useProfile"
import { useReportModal } from "src/hooks/useReportModal"

interface FanWallCommentProps {
  comment: FanWallCommentDto
  removable: boolean
}

export const FanWallComment: FC<FanWallCommentProps> = ({
  comment,
  removable
}) => {
  const { ownsProfile } = useProfile()
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

  const {
    commenterDisplayName,
    commenterId,
    commenterUsername,
    createdAt,
    fanWallCommentId,
    isOwner,
    text
  } = comment

  return (
    <ConditionRendering condition={!removed}>
      <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
        <PostProfileAvatar
          createdAt={createdAt}
          displayName={commenterDisplayName}
          isOwner={isOwner}
          postId={fanWallCommentId}
          userId={commenterId}
          username={commenterUsername}
          dropdownOptions={dropdownItems}
        />
        <div className="flex flex-col items-start">
          <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
            {text}
          </p>
        </div>
      </FormContainer>
    </ConditionRendering>
  )
}
