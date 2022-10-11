import { CommentDto } from "@passes/api-client"
import { FC } from "react"
import TimeAgo from "react-timeago"
import { Text } from "src/components/atoms/Text"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"

interface CommentProps {
  readonly comment: CommentDto
}

export const Comment: FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex w-full justify-between border-b-[1px] border-b-gray-300/10 py-2">
      <div className="flex w-full">
        <div className="h-[40px] min-h-[40px] w-[40px] min-w-[40px] items-start justify-start rounded-full">
          <ProfileThumbnail userId={comment.commenterId} />
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
  )
}
