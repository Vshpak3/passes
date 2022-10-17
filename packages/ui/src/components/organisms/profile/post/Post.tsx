import { PostDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { useState } from "react"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownCopyLink,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptionsGeneral"
import { DropDownDeletePost } from "src/components/organisms/profile/drop-down/DropdownOptionsPost"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useBlockUnblockUser } from "src/hooks/useBlockUnblockUser"
import { usePost } from "src/hooks/usePost"
import { useReportModal } from "src/hooks/useReportModal"
import { useUser } from "src/hooks/useUser"
import { useViewPostModal } from "src/hooks/useViewPostModal"

import { LockedMedia } from "./LockedMedia"
import { PostEngagement } from "./PostEngagement"
import { PostMedia } from "./PostMedia"
import { PostProfileAvatar } from "./PostProfileAvatar"
import { PostTextContent } from "./PostTextContent"

interface PostProps {
  post: PostDto
  redirectOnDelete?: boolean
}

export const Post: React.FC<PostProps> = ({ post, redirectOnDelete }) => {
  const [isRemoved, setIsRemoved] = useState(false)
  const { setPost } = useViewPostModal()
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()
  const router = useRouter()
  const { user } = useUser()
  const { removePost } = usePost()

  const {
    contents,
    createdAt,
    displayName,
    earningsPurchases,
    isOwner,
    numComments,
    numLikes,
    numPurchases,
    purchasable,
    postId,
    text,
    totalTipAmount,
    userId,
    username
  } = post

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!post.isOwner, setIsReportModalOpen),
    ...DropDownBlock(!post.isOwner, setIsBlockModalOpen),
    ...DropDownDeletePost(post.isOwner, post.postId, removePost, () => {
      setIsRemoved(true)
      if (redirectOnDelete && user) {
        router.push(`/${user.username}`)
      }
    }),
    DropDownCopyLink(username, postId)
  ]

  const { blockedUsersList } = useBlockUnblockUser(displayName)

  const setPostHandler = () => setPost({ ...post, setIsRemoved })

  return (
    <ConditionRendering condition={!isRemoved}>
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar
          createdAt={createdAt}
          displayName={displayName}
          isOwner={isOwner}
          userId={userId}
          username={username}
          dropdownOptions={dropdownOptions}
          statisticsButtonProps={{
            createdAt,
            earningsPurchases,
            numComments,
            numLikes,
            numPurchases,
            totalTipAmount
          }}
        />
        <PostTextContent text={text} />
        {!purchasable && (
          <PostMedia
            postId={postId}
            contents={contents}
            setPostHandler={setPostHandler}
          />
        )}
        {purchasable && <LockedMedia post={post} />}
        <PostEngagement
          post={post}
          isCreator={user?.isCreator}
          blockedUsers={blockedUsersList}
        />
      </FormContainer>
    </ConditionRendering>
  )
}

export default Post // eslint-disable-line import/no-default-export
