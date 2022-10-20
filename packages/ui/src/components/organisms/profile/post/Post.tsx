import { PostDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { toast } from "react-toastify"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownCopyLink,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { useFeed } from "src/hooks/useFeed"
import { usePost } from "src/hooks/usePost"
import { useUser } from "src/hooks/useUser"
import { useViewPostModal } from "src/hooks/useViewPostModal"

import { LockedMedia } from "./LockedMedia"
import { PostEngagement } from "./PostEngagement"
import { PostHeader } from "./PostHeader"
import { PostMedia } from "./PostMedia"
import { PostTextContent } from "./PostTextContent"

interface PostProps {
  post: PostDto
  redirectOnDelete?: boolean
  isPinned?: boolean
  isNewPost?: boolean
}

export const Post: FC<PostProps> = ({
  post,
  redirectOnDelete = false,
  isPinned = false,
  isNewPost = false
}) => {
  const router = useRouter()
  const { user } = useUser()
  const { removePost, pinPost, unpinPost } = usePost()
  const { setPost } = useViewPostModal()
  const { mutatePinnedPosts } = useFeed(post.userId)

  const {
    contents,
    createdAt,
    displayName,
    earningsPurchases,
    isOwner,
    numComments,
    numLikes,
    numPurchases,
    pinnedAt,
    postId,
    purchasable,
    tags,
    text,
    totalTipAmount,
    userId,
    username
  } = post

  const [isRemoved, setIsRemoved] = useState(!!pinnedAt !== isPinned)

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!post.isOwner, {
      username: username,
      userId: userId
    }),
    ...DropDownGeneral("Delete", post.isOwner, async () => {
      await removePost(postId)
      setIsRemoved(true)
      if (redirectOnDelete && user) {
        router.push(`/${user.username}`)
      }
    }),
    ...DropDownGeneral("Pin", post.isOwner && !isPinned, async () => {
      await pinPost(postId)
      toast.success("The post has been pinned")
      mutatePinnedPosts()
      setIsRemoved(true)
    }),
    ...DropDownGeneral("Unpin", post.isOwner && isPinned, async () => {
      await unpinPost(postId)
      toast.success("The post has been unpinned")
      mutatePinnedPosts()
      setIsRemoved(true)
    }),
    DropDownCopyLink(username, postId)
  ]

  const setPostHandler = () => setPost({ ...post, setIsRemoved })

  return (
    <ConditionRendering condition={!isRemoved}>
      <div className="mt-6">
        <FormContainer
          borderColor={
            isPinned ? "border-passes-pink-100" : "border-[#ffffff]/10"
          }
          className={"!min-h-[10px] w-full rounded-[20px] border px-5 pt-5"}
        >
          <PostHeader
            createdAt={createdAt}
            displayName={displayName}
            isOwner={isOwner}
            userId={userId}
            username={username}
            isPinned={isPinned}
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
          <PostTextContent text={text} tags={tags} />
          {!!contents?.length && (
            <>
              {!purchasable ? (
                <PostMedia
                  postId={postId}
                  contents={contents}
                  isNewPost={isNewPost}
                  setPostHandler={setPostHandler}
                />
              ) : (
                <LockedMedia post={post} />
              )}
            </>
          )}
          <PostEngagement post={post} />
        </FormContainer>
      </div>
    </ConditionRendering>
  )
}

export default Post // eslint-disable-line import/no-default-export
