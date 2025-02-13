import { PostDto } from "@passes/api-client"
import { MAX_PINNED_POST } from "@passes/shared-constants"
import classNames from "classnames"
import { useRouter } from "next/router"
import { FC, memo, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { FormattedText } from "src/components/atoms/FormattedText"
import { MediaContent } from "src/components/molecules/content/MediaContent"
import { AddCategoryToPostDialog } from "src/components/molecules/post/AddCategoryToPostDialog"
import { DropdownOption } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownCopyLink,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { EditPostDialog } from "src/components/organisms/profile/main-content/new-post/EditPostDialog"
import { useBuyPostModal } from "src/hooks/context/useBuyPostModal"
import { ProfileContext } from "src/pages/[username]"
import { DeletePostModal } from "./DeletePostModal"
import { PostCachedProps } from "./PostCached"
import { PostEngagement } from "./PostEngagement"
import { PostHeader } from "./PostHeader"

interface PostProps extends PostCachedProps {
  update: (update: Partial<PostDto>) => void
}

const PostUnmemo: FC<PostProps> = ({
  post,
  allowPinned = false,
  postByUrl = false,
  isPinned = false,
  bordered = false,
  update
}) => {
  const [deletePostModelOpen, setDeletePostModelOpen] = useState(false)
  const [editPostDialogOpen, setEditPostDialogOpen] = useState(false)
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false)
  const { setPost } = useBuyPostModal()
  const router = useRouter()
  const { pinPost, unpinPost, pinnedPosts, profileUserId } =
    useContext(ProfileContext)
  const {
    accessible,
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
    price,
    postCategories
  } = post

  useEffect(() => {
    if (postByUrl && !contentProcessed) {
      router.push(`/${username}`)
    }
  }, [router, postByUrl, contentProcessed, username])

  const isRemoved = !!pinnedAt !== isPinned && !postByUrl && !allowPinned

  const onDelete = () => {
    update({ deletedAt: new Date() })
    if (postByUrl) {
      router.push(`/${username}`)
    }
  }

  const dropdownOptions: DropdownOption[] = [
    ...DropDownGeneral("Edit", post.isOwner, async () => {
      setEditPostDialogOpen(true)
    }),
    ...DropDownGeneral("Categories", post.isOwner, async () => {
      setAddCategoryDialogOpen(true)
    }),
    ...DropDownReport(!isOwner, {
      username: username,
      userId: userId
    }),
    ...DropDownGeneral("Delete", isOwner, async () => {
      setDeletePostModelOpen(true)
    }),
    ...DropDownGeneral(
      "Pin",
      isOwner && !isPinned && contentProcessed && !!pinPost,
      async () => {
        if (pinnedPosts && pinnedPosts.length === MAX_PINNED_POST) {
          toast.error(`Can only pin a max of ${MAX_PINNED_POST} posts`)
          return
        }
        update({ pinnedAt: new Date() })
        await pinPost(post)
        toast.success("The post has been pinned")
      }
    ),
    ...DropDownGeneral(
      "Unpin",
      post.isOwner && isPinned && contentProcessed && !!unpinPost,
      async () => {
        update({ pinnedAt: null })
        await unpinPost(post)
        toast.success("The post has been unpinned")
      }
    ),
    ...DropDownCopyLink(contentProcessed, username, postId)
  ]

  return (
    <>
      {!isRemoved && !post.deletedAt && (
        <div
          className={classNames(
            bordered && "border-b-[0.5px] border-passes-gray"
          )}
        >
          {addCategoryDialogOpen && !!profileUserId && (
            <AddCategoryToPostDialog
              onCancel={() => setAddCategoryDialogOpen(false)}
              postId={postId}
              selectedPostCategories={postCategories}
              userId={profileUserId}
            />
          )}
          {editPostDialogOpen && (
            <EditPostDialog
              onCancel={() => setEditPostDialogOpen(false)}
              post={post}
            />
          )}
          <div
            className={classNames(
              isPinned && "bg-passes-pink-100/10",
              "flex !min-h-[10px] w-full flex-grow flex-col items-stretch gap-4 border-t-[1px] border-passes-gray py-5 md:min-h-[400px] md:pt-5"
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
            <p className="passes-break whitespace-pre-wrap px-5 text-start text-base font-medium text-white/90 sm:px-10 md:px-10 lg:px-5">
              <FormattedText tags={tags} text={text} />
            </p>
            {!!contents?.length && (
              <MediaContent
                contents={contents}
                isOwner={isOwner}
                isProcessing={!contentProcessed}
                key={postId}
                openBuyModal={() => setPost(post)}
                paid={!!paidAt || isOwner || accessible}
                paying={paying}
                previewIndex={previewIndex}
                price={price}
              />
            )}
            <PostEngagement post={post} update={update} />
          </div>
        </div>
      )}
      {deletePostModelOpen && (
        <DeletePostModal
          onDelete={onDelete}
          post={post}
          setOpen={setDeletePostModelOpen}
        />
      )}
    </>
  )
}

export const Post = memo(PostUnmemo)
