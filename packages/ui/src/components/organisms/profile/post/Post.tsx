import { GetCreatorStatsResponseDto, PostDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, memo, useEffect, useState } from "react"
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
import { KeyedMutator } from "swr"

import { DeletePostModal } from "./DeletePostModal"
import { LockedMedia } from "./LockedMedia"
import { Media } from "./Media"
import { PostEngagement } from "./PostEngagement"
import { PostHeader } from "./PostHeader"

const MAX_PINNED_POST = 3

interface PostProps {
  post: PostDto
  postByUrl?: boolean
  // Whether or not the post is from shown in the non-profile home feed
  inHomeFeed?: boolean
  // Whether or not the post was from returned from the feed API
  isPinned?: boolean
  pinnedPostCount?: number
  mutateProfileStats?: KeyedMutator<GetCreatorStatsResponseDto>
}

const PostUnmemo: FC<PostProps> = ({
  post,
  inHomeFeed = false,
  postByUrl = false,
  isPinned = false,
  pinnedPostCount = 0,
  mutateProfileStats
}) => {
  const [deletePostModelOpen, setDeletePostModelOpen] = useState(false)

  const router = useRouter()
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
    username,
    contentProcessed
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
                  <Media contents={contents} isProcessing={!contentProcessed} />
                ) : (
                  <LockedMedia post={post} />
                )}
              </>
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
          mutateProfileStats={mutateProfileStats}
        />
      )}
    </>
  )
}

export const Post = memo(PostUnmemo)
export default Post // eslint-disable-line import/no-default-export
