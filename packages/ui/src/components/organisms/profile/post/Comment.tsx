import { CommentApi, CommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"
import { Text } from "src/components/atoms/Text"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useReportModal } from "src/hooks/useReportModal"

import { DropdownOption, PostDropdown } from "./PostDropdown"

interface CommentProps {
  readonly comment: CommentDto
  removable: boolean
  ownsPost: boolean
  isPostComment?: boolean
}

const api = new CommentApi()

export const Comment: FC<CommentProps> = ({
  comment,
  removable,
  ownsPost,
  isPostComment
}) => {
  const [removed, setRemoved] = useState(false)
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()

  const { commentId, commenterUsername, isOwner, postId } = comment

  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setIsReportModalOpen(true)
    },
    {
      text: "Block",
      onClick: () => setIsBlockModalOpen(true)
    },
    ...(ownsPost || isOwner
      ? [
          {
            text: "Delete comment",
            onClick: async () => {
              await api.deleteComment({
                commentId: commentId,
                postId: postId
              })
              if (removable) {
                setRemoved(true)
              }
            }
          }
        ]
      : []), //TODO: add unhide
    ...(ownsPost && !comment.isOwner
      ? [
          {
            text: "Hide comment",
            onClick: async () => {
              await api.hideComment({
                commentId: commentId,
                postId: postId
              })
            }
          }
        ]
      : [])
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
              <PostDropdown
                items={dropdownOptions}
                username={commenterUsername}
                postId={postId}
                isPostComment={isPostComment}
              />
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
