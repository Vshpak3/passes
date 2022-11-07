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
    commenterId,
    commenterUsername,
    commenterDisplayName,
    commenterIsCreator,
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
        <div className="mt-6 flex">
          <FormContainer className="flex !min-h-[10px] w-full border border-white/10 px-5 pt-5">
            <PostHeader
              createdAt={createdAt}
              displayName={commenterDisplayName}
              dropdownOptions={dropdownItems}
              id={fanWallCommentId}
              isCreator={commenterIsCreator}
              userId={commenterId}
              username={commenterUsername}
            />
            <div className="flex flex-col items-start">
              <div className="passes-break text-start text-base font-medium text-white/90">
                {!isHidden || showHidden ? (
                  <FormattedText tags={tags} text={text} />
                ) : (
                  <p
                    className="text-gray-500"
                    onClick={() => setShowHidden(true)}
                  >
                    Click to reveal hidden comment
                  </p>
                )}
              </div>
            </div>
          </FormContainer>
        </div>
      )}
    </>
  )
}
