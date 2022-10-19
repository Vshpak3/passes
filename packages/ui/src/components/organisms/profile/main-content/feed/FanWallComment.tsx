import { FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownFanWallCommentDelete,
  DropDownFanWallCommentHide,
  DropDownFanWallCommentUnhide
} from "src/components/organisms/profile/drop-down/DropdownOptionsFanWall"
import {
  DropDownBlock,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptionsGeneral"
import { PostHeader } from "src/components/organisms/profile/post/PostHeader"
import { formatText } from "src/helpers/formatters"
import { useFanWall } from "src/hooks/useFanWall"
import { useProfile } from "src/hooks/useProfile"

interface FanWallCommentProps {
  comment: FanWallCommentDto
}

export const FanWallComment: FC<FanWallCommentProps> = ({ comment }) => {
  const { ownsProfile } = useProfile()
  const [removed, setRemoved] = useState<boolean>(false)
  const { deleteFanWallComment, hideFanWallComment, unhideFanWallComment } =
    useFanWall()

  const {
    fanWallCommentId,
    commenterDisplayName,
    commenterId,
    commenterUsername,
    createdAt,
    isOwner,
    isHidden,
    text
  } = comment

  const dropdownItems: DropdownOption[] = [
    ...DropDownReport(!isOwner && !ownsProfile, {
      username: commenterUsername,
      userId: commenterId
    }),
    ...DropDownBlock(!isOwner && ownsProfile, {
      username: commenterUsername,
      userId: commenterId
    }),
    ...DropDownFanWallCommentDelete(
      isOwner || ownsProfile,
      fanWallCommentId,
      deleteFanWallComment,
      () => {
        setRemoved(true)
      }
    ),
    ...DropDownFanWallCommentHide(
      !isOwner && ownsProfile && !isHidden,
      fanWallCommentId,
      hideFanWallComment
    ),
    ...DropDownFanWallCommentUnhide(
      !isOwner && ownsProfile && isHidden,
      fanWallCommentId,
      unhideFanWallComment
    )
  ]

  return (
    <ConditionRendering condition={!removed}>
      <div className="mt-6 flex">
        <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
          <PostHeader
            createdAt={createdAt}
            displayName={commenterDisplayName}
            isOwner={isOwner}
            userId={commenterId}
            username={commenterUsername}
            dropdownOptions={dropdownItems}
          />
          <div className="flex flex-col items-start">
            <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
              {formatText(text)}
            </p>
          </div>
        </FormContainer>
      </div>
    </ConditionRendering>
  )
}
