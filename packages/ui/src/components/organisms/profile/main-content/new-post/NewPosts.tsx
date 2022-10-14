import { CreatePostRequestDto, PostDto } from "@passes/api-client"
import { useState } from "react"
import { Post } from "src/components/organisms/profile/post/Post"
import { useProfile } from "src/hooks/useProfile"

import { NewPost } from "./NewPost"

export const NewPosts: React.FC = () => {
  const { profileInfo, profileUsername } = useProfile()
  const [newPosts, setNewPosts] = useState<PostDto[]>([])

  const handleCreatePost = async (
    createPost: CreatePostRequestDto,
    postId: string
  ) => {
    const post: PostDto = {
      postId,
      purchasable: false,
      userId: profileInfo?.userId || "",
      username: profileUsername || "",
      displayName: profileInfo?.displayName ?? "",
      text: createPost.text,
      tags: createPost.tags,
      contents: [], // TODO: grab content through swr or endpoint
      previewIndex: 0,
      passIds: createPost.passIds,
      numLikes: 0,
      numComments: 0,
      numPurchases: 0,
      earningsPurchases: 0,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      scheduledAt: createPost.scheduledAt,
      expiresAt: createPost.expiresAt,
      price: createPost.price,
      totalTipAmount: 0,
      isOwner: true
    }
    setNewPosts([post, ...newPosts])
  }

  // TODO: Missing the state to remove the post optimistically

  return (
    <>
      <NewPost
        handleCreatePost={handleCreatePost}
        placeholder="What's on your mind?"
        initialData={{}}
      />
      <div className="mt-9 space-y-6">
        {newPosts.map((post) => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
    </>
  )
}
