import { ContentDto, CreatePostRequestDto, PostDto } from "@passes/api-client"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Post } from "src/components/organisms/profile/post/Post"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { usePost } from "src/hooks/profile/usePost"
import { useProfile } from "src/hooks/profile/useProfile"
import { NewPostEditor } from "./NewPostEditor"

interface NewPostsProps {
  setIsNewPostAdded: (value: boolean) => void
  postUpdates: Record<string, Partial<PostDto>>
}

export const NewPosts: FC<NewPostsProps> = ({
  setIsNewPostAdded,
  postUpdates
}) => {
  const [newPosts, setNewPosts] = useState<PostDto[]>([])
  const { profile, profileUsername, profileUserId } = useProfile()
  const { mutateManualCreatorStats } = useCreatorStats(profileUserId)
  const { createPost } = usePost()

  const handleSavePost = async (createPostDto: CreatePostRequestDto) => {
    if (!profile || !profileUsername) {
      console.error("Unexpected error: mising profile data")
      return
    }

    const res = await createPost(createPostDto)
    if (!res?.postId && !createPostDto.scheduledAt) {
      toast.error("There was an unexpected error; please try again")
      return
    }

    if (createPostDto.scheduledAt) {
      return
    }

    const post: PostDto = {
      postId: res.postId || "",
      purchasable: false,
      userId: profile.userId,
      username: profileUsername,
      displayName: profile.displayName ?? "",
      text: createPostDto.text,
      tags: createPostDto.tags,
      contents: createPostDto.contentIds.map(
        (c) =>
          ({
            contentId: c,
            userId: profile.userId
          } as ContentDto)
      ),
      contentProcessed: !createPostDto.contentIds.length,
      previewIndex: 0,
      passIds: createPostDto.passIds,
      numLikes: 0,
      numComments: 0,
      numPurchases: 0,
      earningsPurchases: 0,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: createPostDto.expiresAt,
      price: createPostDto.price,
      totalTipAmount: 0,
      isOwner: true,
      paying: false,
      paidAt: null,
      yourTips: 0
    }
    if (res.postId) {
      await mutateManualCreatorStats({ field: "numPosts", event: "increment" })
    }

    setNewPosts([post, ...newPosts])
    if (!newPosts?.length) {
      setIsNewPostAdded(true)
    }
  }

  // TODO: Missing the state to remove the post optimistically

  return (
    <>
      <NewPostEditor
        handleSavePost={handleSavePost}
        initialData={{}}
        popup={false}
      />
      {newPosts.map((post) => (
        <Post
          key={post.postId}
          post={{ ...post, ...(postUpdates[post.postId] ?? {}) }}
        />
      ))}
    </>
  )
}
