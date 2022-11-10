import { FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"

import { FormattedText } from "src/components/atoms/FormattedText"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
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

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

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

  const deleteComment = async () => {
    await deleteFanWallComment(fanWallCommentId)
    setRemoved(true)
  }

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
      setDeleteModalOpen(true)
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
          <div className="flex !min-h-[10px] w-full grow flex-col items-stretch gap-4 border-y-[1px] border-passes-gray py-5 md:min-h-[400px] md:pt-5">
            <PostHeader
              createdAt={createdAt}
              displayName={commenterDisplayName}
              dropdownOptions={dropdownItems}
              id={fanWallCommentId}
              isCreator={commenterIsCreator}
              userId={commenterId}
              username={commenterUsername}
            />
            <p className="passes-break whitespace-pre-wrap px-5 text-start text-base font-medium text-[#ffffff]/90 sm:px-10 md:px-10 lg:px-5">
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
            </p>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setDeleteModalOpen(false)}
          onDelete={deleteComment}
        />
      )}
    </>
  )
}
