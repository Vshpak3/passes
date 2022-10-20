import { CommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"
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
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { useComment } from "src/hooks/useComment"

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
  // const [hiddenParity, setHiddenParity] = useState(true)
  const { deleteComment, hideComment, unhideComment } = useComment()

  const {
    commentId,
    commenterUsername,
    isOwner,
    postId,
    commenterId,
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
            <ProfileThumbnail userId={comment.commenterId} />
          </div>
          <div className="flex grow flex-col">
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                {comment.commenterDisplayName && (
                  <Text fontSize={14} className="font-bold">
                    {comment.commenterDisplayName}
                  </Text>
                )}
                <Text fontSize={14} className="text-gray-500">
                  @{comment.commenterUsername}
                </Text>
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
              {!isHidden ? (
                <FormattedText text={comment.text} tags={comment.tags} />
              ) : (
                <div className="text-white/40">hidden</div>
              )}
            </Text>
          </div>
        </div>
      )}
    </>
  )
}
