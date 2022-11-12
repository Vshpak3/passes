import { CommentDto } from "@passes/api-client"
import Link from "next/link"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
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
    commenterIsCreator,
    isHidden: _isHidden
  } = comment
  const [isHidden, setIsHidden] = useState(_isHidden)

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!isOwner, {
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
            <Link href={`/${comment.commenterUsername}`}>
              <ProfileImage
                key={comment.commenterId}
                type="thumbnail"
                userId={comment.commenterId}
              />
            </Link>
          </div>
          <div className="flex w-0 flex-1 flex-col">
            <div className="flex w-full justify-between">
              <div className="shrink overflow-x-hidden">
                <NameDisplay
                  displayName={commenterDisplayName}
                  displayNameClassName="text-base"
                  isCreator={commenterIsCreator}
                  linked
                  username={commenterUsername}
                />
              </div>
              {!!isHidden && (
                <Text className="text-gray-500" fontSize={14}>
                  &nbsp;&nbsp; hidden
                </Text>
              )}

              <div className="flex shrink-0 flex-row items-center justify-end gap-x-2">
                <div className="flex items-center">
                  <TimeAgo
                    className="mt-[2px] shrink-0 text-[12px] text-gray-300/60"
                    date={comment.createdAt}
                    key={comment.commentId}
                    live={false}
                  />
                </div>
                <div className="flex items-center">
                  <Dropdown
                    className="flex justify-end"
                    items={dropdownOptions}
                  />
                </div>
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
