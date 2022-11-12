import { ContentDto, CreatePostRequestDto, PostDto } from "@passes/api-client"
import { FC, useContext, useState } from "react"
import { toast } from "react-toastify"

import { PostCached } from "src/components/organisms/profile/post/PostCached"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { useUpdatePost } from "src/hooks/profile/useUpdatePost"
import { ProfileContext } from "src/pages/[username]"
import { NewPostEditor } from "./NewPostEditor"

export const NewPosts: FC = () => {
  const [newPosts, setNewPosts] = useState<PostDto[]>([])
  const { profile, profileUsername, profileUserId } = useContext(ProfileContext)
  const { mutateManualCreatorStats } = useCreatorStats(profileUserId)
  const { createPost } = useUpdatePost()

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
  }

  return (
    <>
      <NewPostEditor
        handleSavePost={handleSavePost}
        initialData={{}}
        popup={false}
      />
      {newPosts.map((post) => (
        <PostCached key={post.postId} post={post} />
      ))}
    </>
  )
}
