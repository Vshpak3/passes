import { CommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"

import { FormattedText } from "src/components/atoms/FormattedText"
import { NameDisplay } from "src/components/atoms/NameDisplay"
import { Text } from "src/components/atoms/Text"
import {
  Dropdown,
  DropdownOption
} from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { useComment } from "src/hooks/profile/useComment"

interface CommentProps {
  comment: CommentDto
  ownsPost: boolean
  decrementNumComments: () => void
}

export const Comment: FC<CommentProps> = ({
  comment,
  ownsPost,
  decrementNumComments
}) => {
  const [removed, setRemoved] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const { deleteComment, hideComment, unhideComment } = useComment()

  const {
    commentId,
    commenterUsername,
    isOwner,
    postId,
    commenterId,
    commenterDisplayName,
    isHidden: _isHidden
  } = comment

  const [isHidden, setIsHidden] = useState(_isHidden)

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!isOwner && !ownsPost, {
      username: commenterUsername,
      userId: commenterId
    }),
    ...DropDownBlock(!isOwner && ownsPost, {
      username: commenterUsername,
      userId: commenterId
    }),
    ...DropDownGeneral("Delete", isOwner || ownsPost, async () => {
      await deleteComment(postId, commentId)
      decrementNumComments()
      setRemoved(true)
    }),
    ...DropDownGeneral("Hide", !isOwner && ownsPost && !isHidden, async () => {
      setIsHidden(true)
      setShowHidden(false)
      await hideComment(postId, commentId)
    }),
    ...DropDownGeneral("Unhide", !isOwner && ownsPost && isHidden, async () => {
      setIsHidden(false)
      await unhideComment(postId, commentId)
    })
  ]

  return (
    <>
      {!removed && (
        <div className="flex w-full gap-x-4 border-b-[1px] border-b-gray-300/10 py-2">
          <div>
            <a href={`${window.location.origin}/${comment.commenterUsername}`}>
              <ProfileThumbnail userId={comment.commenterId} />
            </a>
          </div>
          <div className="flex grow flex-col">
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                <NameDisplay
                  displayName={commenterDisplayName}
                  username={commenterUsername}
                  linked={true}
                />
                {!!isHidden && (
                  <Text fontSize={14} className="text-gray-500">
                    &nbsp;&nbsp; hidden
                  </Text>
                )}
              </div>

              <div className="flex gap-x-2">
                <TimeAgo
                  className="shrink-0 text-[12px] text-gray-300/60"
                  date={comment.createdAt}
                  live={false}
                />
                <Dropdown items={dropdownOptions} />
              </div>
            </div>
            <Text
              fontSize={14}
              className="whitespace-pre-wrap break-all font-light"
            >
              {!isHidden || showHidden ? (
                <FormattedText text={comment.text} tags={comment.tags} />
              ) : (
                <div
                  className="text-gray-500"
                  onClick={() => setShowHidden(true)}
                >
                  Click to reveal hidden comment
                </div>
              )}
            </Text>
          </div>
        </div>
      )}
    </>
  )
}
