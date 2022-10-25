import { FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"

import { FormattedText } from "src/components/atoms/FormattedText"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { PostHeader } from "src/components/organisms/profile/post/PostHeader"
import { useFanWall } from "src/hooks/profile/useFanWall"

interface FanWallCommentProps {
  comment: FanWallCommentDto
  ownsProfile: boolean
}

export const FanWallComment: FC<FanWallCommentProps> = ({
  comment,
  ownsProfile
}) => {
  const [removed, setRemoved] = useState<boolean>(false)
  const [showHidden, setShowHidden] = useState(false)
  const { deleteFanWallComment, hideFanWallComment, unhideFanWallComment } =
    useFanWall()

  const {
    fanWallCommentId,
    commenterDisplayName,
    commenterId,
    commenterUsername,
    createdAt,
    isOwner,
    isHidden: _isHidden,
    text,
    tags
  } = comment

  const [isHidden, setIsHidden] = useState(_isHidden)

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
        setIsHidden(true)
        setShowHidden(false)
        await hideFanWallComment(fanWallCommentId)
      }
    ),
    ...DropDownGeneral(
      "Unhide",
      !isOwner && ownsProfile && isHidden,
      async () => {
        setIsHidden(false)
        await unhideFanWallComment(fanWallCommentId)
      }
    )
  ]

  return (
    <>
      {!removed && (
        <div className="z-1 mt-6 flex">
          <FormContainer className="!min-h-[10px] rounded-[15px] border border-white/10 px-5 pt-5">
            <PostHeader
              createdAt={createdAt}
              displayName={commenterDisplayName}
              isOwner={isOwner}
              userId={commenterId}
              username={commenterUsername}
              dropdownOptions={dropdownItems}
            />
            <div className="flex flex-col items-start">
              <p className="break-normal break-all text-start text-base font-medium text-white/90">
                {!isHidden || showHidden ? (
                  <FormattedText text={text} tags={tags} />
                ) : (
                  <div
                    className="text-gray-500"
                    onClick={() => setShowHidden(true)}
                  >
                    Click to reveal hidden comment
                  </div>
                )}
              </p>
            </div>
          </FormContainer>
        </div>
      )}
    </>
  )
}
