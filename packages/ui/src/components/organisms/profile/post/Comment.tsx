import { CommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"

import { MessagesNameDisplay } from "src/components/atoms/content/MessagesNameDisplay"
import { FormattedText } from "src/components/atoms/FormattedText"
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
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
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
              <ProfileImage
                key={comment.commenterId}
                type="thumbnail"
                userId={comment.commenterId}
              />
            </a>
          </div>
          <div className="flex grow flex-col">
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                <MessagesNameDisplay
                  displayName={commenterDisplayName}
                  displayNameClassName="text-base"
                  linked
                  username={commenterUsername}
                />
                {!!isHidden && (
                  <Text className="text-gray-500" fontSize={14}>
                    &nbsp;&nbsp; hidden
                  </Text>
                )}
              </div>

              <div className="flex gap-x-2">
                <TimeAgo
                  className="mt-[2px] shrink-0 text-[12px] text-gray-300/60"
                  date={comment.createdAt}
                  key={comment.commentId}
                  live={false}
                />
                <Dropdown items={dropdownOptions} />
              </div>
            </div>
            <Text
              className="passes-break whitespace-pre-wrap font-light"
              fontSize={14}
            >
              {!isHidden || showHidden ? (
                <FormattedText tags={comment.tags} text={comment.text} />
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
