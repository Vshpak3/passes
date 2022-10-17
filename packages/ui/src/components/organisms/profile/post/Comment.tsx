import { CommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"
import { Text } from "src/components/atoms/Text"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import {
  Dropdown,
  DropdownOption
} from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownCommentDelete,
  DropDownCommentHide
} from "src/components/organisms/profile/drop-down/DropdownOptionsComment"
import {
  DropDownBlock,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptionsGeneral"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"
import { useComment } from "src/hooks/useComment"

interface CommentProps {
  comment: CommentDto
  ownsPost: boolean
}

export const Comment: FC<CommentProps> = ({ comment, ownsPost }) => {
  const [removed, setRemoved] = useState(false)
  const { deleteComment, hideComment } = useComment()

  const { commentId, commenterUsername, isOwner, postId, commenterId } = comment

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!isOwner && !ownsPost, {
      username: commenterUsername,
      userId: commenterId
    }),
    ...DropDownBlock(!isOwner && ownsPost, {
      username: commenterUsername,
      userId: commenterId
    }),
    ...DropDownCommentDelete(
      isOwner || ownsPost,
      postId,
      commentId,
      deleteComment,
      () => {
        setRemoved(true)
      }
    ),
    ...DropDownCommentHide(!isOwner && ownsPost, postId, commentId, hideComment)
  ]

  return (
    <ConditionRendering condition={!removed}>
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
            {comment.text}
          </Text>
        </div>
      </div>
    </ConditionRendering>
  )
}
