import { PostApi, PostDto } from "@passes/api-client"
import { useState } from "react"
import { toast } from "react-toastify"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useReportModal } from "src/hooks/useReportModal"
import { useViewPostModal } from "src/hooks/useViewPostModal"

import { LockedMedia } from "./LockedMedia"
import { DropdownOption } from "./PostDropdown"
import { PostEngagement } from "./PostEngagement"
import { PostMedia } from "./PostMedia"
import { PostProfileAvatar } from "./PostProfileAvatar"
import { PostTextContent } from "./PostTextContent"

interface PostProps {
  post: PostDto
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [isRemoved, setIsRemoved] = useState(false)
  const { setPost } = useViewPostModal()
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
    ...(post.isOwner
      ? [
          {
            text: "Delete",
            onClick: async () => {
              const api = new PostApi()
              await api
                .removePost({ postId: post.postId })
                .catch((error) => toast(error))
              setIsRemoved(true)
            }
          }
        ]
      : [])
  ]

  const {
    content,
    createdAt,
    displayName,
    earningsPurchases,
    isLiked,
    isOwner,
    numComments,
    numLikes,
    numPurchases,
    paywall,
    postId,
    text,
    totalTipAmount,
    userId,
    username
  } = post

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
        <div
          className="cursor-pointer"
          onClick={() => {
            setPost({ ...post, setIsRemoved })
          }}
        >
          <PostTextContent text={text} />
          {!paywall && <PostMedia content={content} />}
        </div>
        {paywall && <LockedMedia post={post} />}
        <PostEngagement
          isLiked={isLiked}
          isOwner={isOwner}
          numLikes={numLikes}
          numComments={numComments}
          postId={postId}
          paywall={paywall}
          username={username}
        />
      </FormContainer>
    </ConditionRendering>
  )
}
