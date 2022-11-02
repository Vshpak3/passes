import { PostDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, memo, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { FormattedText } from "src/components/atoms/FormattedText"
import { MediaContent } from "src/components/molecules/content/MediaContent"
import { FormContainer } from "src/components/organisms/FormContainer"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownCopyLink,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { MAX_PINNED_POST } from "src/config/post"
import { CreatorStatsUpdate } from "src/hooks/profile/useCreatorStats"
import { usePinnedPosts } from "src/hooks/profile/usePinnedPosts"
import { useBuyPostModal } from "src/hooks/useBuyPostModal"
import { DeletePostModal } from "./DeletePostModal"
import { PostEngagement } from "./PostEngagement"
import { PostHeader } from "./PostHeader"

interface PostProps {
  post: PostDto
  postByUrl?: boolean
  // Whether or not the post is from shown in the non-profile home feed
  inHomeFeed?: boolean
  // Whether or not the post was from returned from the feed API
  isPinned?: boolean
  updateProfileStats?: (update: CreatorStatsUpdate) => Promise<void>
}

const PostUnmemo: FC<PostProps> = ({
  post,
  inHomeFeed = false,
  postByUrl = false,
  isPinned = false,
  updateProfileStats
}) => {
  const [deletePostModelOpen, setDeletePostModelOpen] = useState(false)
  const { setPost } = useBuyPostModal()
  const router = useRouter()
  const { pinPost, unpinPost, pinnedPosts } = usePinnedPosts(post.userId)

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
    paying,
    tags,
    text,
    totalTipAmount,
    userId,
    username,
    contentProcessed,
    paidAt,
    previewIndex,
    price
  } = post

  useEffect(() => {
    if (postByUrl && !contentProcessed) {
      router.push(`/${username}`)
    }
  }, [router, postByUrl, contentProcessed, username])

  const [isRemoved, setIsRemoved] = useState(
    !!pinnedAt !== isPinned && !postByUrl && !inHomeFeed
  )

  const onDelete = () => {
    setIsRemoved(true)
    if (postByUrl) {
      router.push(`/${username}`)
    }
  }

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!post.isOwner, {
      username: username,
      userId: userId
    }),
    ...DropDownGeneral("Delete", post.isOwner, async () => {
      setDeletePostModelOpen(true)
    }),
    ...DropDownGeneral("Pin", post.isOwner && !isPinned, async () => {
      if (pinnedPosts.length === MAX_PINNED_POST) {
        toast.error(`Can only pin a max of ${MAX_PINNED_POST} posts`)
        return
      }
      await pinPost(post)
      toast.success("The post has been pinned")
      setIsRemoved(true)
    }),
    ...DropDownGeneral("Unpin", post.isOwner && isPinned, async () => {
      await unpinPost(post)
      toast.success("The post has been unpinned")
      setIsRemoved(true)
    }),
    ...DropDownCopyLink(contentProcessed, username, postId)
  ]

  return (
    <>
      {!isRemoved && (
        <div className="mt-6">
          <FormContainer
            borderColor={
              isPinned ? "border-passes-pink-100" : "border-[#ffffff]/10"
            }
            className={"!min-h-[10px] w-full rounded-[15px] border px-5 pt-5"}
          >
            <PostHeader
              createdAt={createdAt}
              userId={userId}
              username={username}
              displayName={displayName}
              isCreator={true}
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
              <MediaContent
                contents={contents}
                isProcessing={!contentProcessed}
                paying={paying}
                paid={!!paidAt || isOwner}
                previewIndex={previewIndex}
                price={price ?? 0}
                openBuyModal={() => setPost(post)}
              />
            )}
            <PostEngagement post={post} />
          </FormContainer>
        </div>
      )}
      {deletePostModelOpen && (
        <DeletePostModal
          post={post}
          onDelete={onDelete}
          setOpen={setDeletePostModelOpen}
          updateProfileStats={updateProfileStats}
        />
      )}
    </>
  )
}

export const Post = memo(PostUnmemo)
export default Post // eslint-disable-line import/no-default-export
