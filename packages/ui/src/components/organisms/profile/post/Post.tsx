import { PostDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { toast } from "react-toastify"
import { FormattedText } from "src/components/atoms/FormattedText"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownCopyLink,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { useFeed } from "src/hooks/profile/useFeed"
import { usePost } from "src/hooks/profile/usePost"
import { useViewPostModal } from "src/hooks/profile/useViewPostModal"
import { useUser } from "src/hooks/useUser"

import { LockedMedia } from "./LockedMedia"
import { PostEngagement } from "./PostEngagement"
import { PostHeader } from "./PostHeader"
import { PostMedia } from "./PostMedia"

const MAX_PINNED_POST = 3

interface PostProps {
  post: PostDto
  postByUrl?: boolean
  // Whether or not the post is from shown in the non-profile home feed
  inHomeFeed?: boolean
  // Whether or not the post was from returned from the feed API
  isPinned?: boolean
  isNewPost?: boolean
  pinnedPostCount?: number
}

export const Post: FC<PostProps> = ({
  post,
  inHomeFeed = false,
  postByUrl = false,
  isPinned = false,
  isNewPost = false,
  pinnedPostCount = 0
}) => {
  const router = useRouter()
  const { user } = useUser()
  const { removePost } = usePost()
  const { setPost } = useViewPostModal()
  const { mutatePinnedPosts, pinPost, unpinPost } = useFeed(post.userId)

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

  const [isRemoved, setIsRemoved] = useState(
    !!pinnedAt !== isPinned && !postByUrl && !inHomeFeed
  )

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!post.isOwner, {
      username: username,
      userId: userId
    }),
    ...DropDownGeneral("Delete", post.isOwner, async () => {
      await removePost(postId)
      setIsRemoved(true)
      if (postByUrl && user) {
        router.push(`/${user.username}`)
      }
    }),
    ...DropDownGeneral("Pin", post.isOwner && !isPinned, async () => {
      if (pinnedPostCount === MAX_PINNED_POST) {
        toast.error(`Can only pin a max of ${MAX_PINNED_POST} posts`)
        return
      }
      await pinPost(post)
      toast.success("The post has been pinned")
      mutatePinnedPosts()
      setIsRemoved(true)
    }),
    ...DropDownGeneral("Unpin", post.isOwner && isPinned, async () => {
      await unpinPost(post)
      toast.success("The post has been unpinned")
      mutatePinnedPosts()
      setIsRemoved(true)
    }),
    DropDownCopyLink(username, postId)
  ]

  const setPostHandler = () => setPost({ ...post, setIsRemoved })

  return (
    <>
      {!isRemoved && (
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

            <p className="break-all text-start text-base font-medium text-[#ffffff]/90">
              <FormattedText text={text} tags={tags} />
            </p>
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
      )}
    </>
  )
}

export default Post // eslint-disable-line import/no-default-export
