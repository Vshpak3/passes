import { PostApi, PostDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { useBlockUnblockUser } from "src/hooks/useBlockUnblockUser"
import { useReportModal } from "src/hooks/useReportModal"
import { useUser } from "src/hooks/useUser"
import { useViewPostModal } from "src/hooks/useViewPostModal"

import { LockedMedia } from "./LockedMedia"
import { DropdownOption } from "./PostDropdown"
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

  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setIsReportModalOpen(true)
    },
    ...(post.isOwner
      ? [
          {
            text: "Delete",
            onClick: async () => {
              const api = new PostApi()
              await api
                .removePost({ postId: post.postId })
                .catch((error) => toast(error))
              if (redirectOnDelete && user) {
                router.push(`/${user.username}`)
              }
              setIsRemoved(true)
            }
          }
        ]
      : [])
  ]

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

  const { blockedUsersList } = useBlockUnblockUser(displayName)

  const setPostHandler = () => setPost({ ...post, setIsRemoved })

  return (
    <ConditionRendering condition={!isRemoved}>
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar
          createdAt={createdAt}
          displayName={displayName}
          isOwner={isOwner}
          postId={postId}
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
