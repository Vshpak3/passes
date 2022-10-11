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
}
const api = new CommentApi()

export const Comment: FC<CommentProps> = ({ comment, removable, ownsPost }) => {
  const [removed, setRemoved] = useState<boolean>(false)
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()
  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setIsReportModalOpen(true)
    },
    {
      text: "Block",
      onClick: () => setIsBlockModalOpen(true)
    },
    ...(ownsPost || comment.isOwner
      ? [
          {
            text: "Delete comment",
            onClick: async () => {
              await api.deleteComment({
                commentId: comment.commentId,
                postId: comment.postId
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
                commentId: comment.commentId,
                postId: comment.postId
              })
            }
          }
        ]
      : [])
  ]
  return (
    <ConditionRendering condition={!removed}>
      <div className="flex w-full justify-between border-b-[1px] border-b-gray-300/10 py-2">
        <div className="flex w-full">
          <div className="h-[40px] min-h-[40px] w-[40px] min-w-[40px] items-start justify-start rounded-full">
            <ProfileThumbnail userId={comment.commenterId} />
            <div className="flex items-center gap-[15px]">
              <PostDropdown items={dropdownOptions} />
            </div>
          </div>
          <div className="ml-4 flex max-w-[100%] flex-col flex-wrap">
            <div className="flex gap-x-2">
              {comment.commenterDisplayName && (
                <Text fontSize={14} className="mb-1 font-bold">
                  {comment.commenterDisplayName}
                </Text>
              )}
              <Text fontSize={14} className="mb-1 text-gray-500">
                @{comment.commenterUsername}
              </Text>
            </div>
            <Text
              fontSize={14}
              className="break-normal break-all text-start font-light"
            >
              {comment.text}
            </Text>
          </div>
        </div>
        <TimeAgo
          className="ml-4 shrink-0 text-[12px] text-gray-300/60"
          date={comment.createdAt}
          live={false}
        />
      </div>
    </ConditionRendering>
  )
}
