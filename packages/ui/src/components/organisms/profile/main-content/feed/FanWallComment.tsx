import { FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import { FormattedText } from "src/components/atoms/FormattedText"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { PostHeader } from "src/components/organisms/profile/post/PostHeader"
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
    text,
    tags
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
    ...DropDownGeneral("Delete", isOwner || ownsProfile, async () => {
      await deleteFanWallComment(fanWallCommentId)
      setRemoved(true)
    }),
    ...DropDownGeneral(
      "Hide",
      !isOwner && ownsProfile && !isHidden,
      async () => {
        await hideFanWallComment(fanWallCommentId)
      }
    ),
    ...DropDownGeneral(
      "Unhide",
      !isOwner && ownsProfile && isHidden,
      async () => {
        await unhideFanWallComment(fanWallCommentId)
      }
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
              <FormattedText text={text} tags={tags} />
            </p>
          </div>
        </FormContainer>
      </div>
    </ConditionRendering>
  )
}
