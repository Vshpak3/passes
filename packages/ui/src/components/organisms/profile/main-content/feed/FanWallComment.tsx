import { FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownFanWallCommentDelete,
  DropDownFanWallCommentHide
} from "src/components/organisms/profile/drop-down/DropdownOptionsFanWall"
import {
  DropDownBlock,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptionsGeneral"
import { PostProfileAvatar } from "src/components/organisms/profile/post/PostProfileAvatar"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useFanWall } from "src/hooks/useFanWall"
import { useProfile } from "src/hooks/useProfile"
import { useReportModal } from "src/hooks/useReportModal"

interface FanWallCommentProps {
  comment: FanWallCommentDto
}

export const FanWallComment: FC<FanWallCommentProps> = ({ comment }) => {
  const { ownsProfile } = useProfile()
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()
  const [removed, setRemoved] = useState<boolean>(false)
  const { deleteFanWallComment, hideFanWallComment } = useFanWall()

  const {
    commenterDisplayName,
    commenterId,
    commenterUsername,
    createdAt,
    isOwner,
    text
  } = comment

  const dropdownItems: DropdownOption[] = [
    ...DropDownReport(isOwner, setIsReportModalOpen),
    ...DropDownBlock(isOwner, setIsBlockModalOpen),
    ...DropDownFanWallCommentDelete(
      ownsProfile || comment.isOwner,
      comment.fanWallCommentId,
      deleteFanWallComment,
      () => {
        setRemoved(true)
      }
    ),
    ...DropDownFanWallCommentHide(
      ownsProfile && !comment.isOwner,
      comment.fanWallCommentId,
      hideFanWallComment
    )
  ]

  return (
    <ConditionRendering condition={!removed}>
      <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
        <PostProfileAvatar
          createdAt={createdAt}
          displayName={commenterDisplayName}
          isOwner={isOwner}
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
