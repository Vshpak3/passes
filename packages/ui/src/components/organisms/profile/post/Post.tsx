import { PostDto } from "@passes/api-client"
import classNames from "classnames"
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
import { useBuyPostModal } from "src/hooks/context/useBuyPostModal"
import { CreatorStatsUpdate } from "src/hooks/profile/useCreatorStats"
import { usePinnedPosts } from "src/hooks/profile/usePinnedPosts"
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
    isOwner,
    pinnedAt,
    postId,
    paying,
    tags,
    text,
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

  // When pinning/unpinning we revalidate which causes each post to re-render.
  // We need this useEffect to ensure the posts are properly removed from their
  // respective section.
  useEffect(() => {
    if (
      !isPinned &&
      pinnedPosts.some(({ postId: pinnedPostId }) => pinnedPostId === postId)
    ) {
      setIsRemoved(true)
    }
  }, [isPinned, pinnedPosts, postId])

  return (
    <>
      {!isRemoved && (
        <div>
          <FormContainer
            className={classNames(
              isPinned && "border-passes-pink-100",
              "!min-h-[10px] w-full"
            )}
          >
            <PostHeader
              createdAt={createdAt}
              displayName={displayName}
              dropdownOptions={dropdownOptions}
              id={postId}
              isCreator
              isPinned={isPinned}
              userId={userId}
              username={username}
            />

            <p className="passes-break text-start text-base font-medium text-[#ffffff]/90">
              <FormattedText tags={tags} text={text} />
            </p>
            {!!contents?.length && (
              <MediaContent
                contents={contents}
                isProcessing={!contentProcessed}
                key={postId}
                openBuyModal={() => setPost(post)}
                paid={!!paidAt || isOwner}
                paying={paying}
                previewIndex={previewIndex}
                price={price ?? 0}
              />
            )}
            <PostEngagement post={post} />
          </FormContainer>
        </div>
      )}
      {deletePostModelOpen && (
        <DeletePostModal
          onDelete={onDelete}
          post={post}
          setOpen={setDeletePostModelOpen}
          updateProfileStats={updateProfileStats}
        />
      )}
    </>
  )
}

export const Post = memo(PostUnmemo)
export default Post // eslint-disable-line import/no-default-export
