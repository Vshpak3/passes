import { CreatePostRequestDto, PostDto } from "@passes/api-client"
import { useState } from "react"
import { Post } from "src/components/organisms/profile/post/Post"
import { usePost } from "src/hooks/usePost"
import { useProfile } from "src/hooks/useProfile"

import { NewPostEditor } from "./NewPostEditor"

export const NewPosts: React.FC = () => {
  const { profileInfo, profileUsername } = useProfile()
  const [newPosts, setNewPosts] = useState<PostDto[]>([])

  const { createPost } = usePost()
  const handleSavePost = async (createPostDto: CreatePostRequestDto) => {
    // Was a scheduled post

    const res = await createPost(createPostDto)
    const post: PostDto = {
      postId: res.postId ?? "",
      purchasable: false,
      userId: profileInfo?.userId || "",
      username: profileUsername || "",
      displayName: profileInfo?.displayName ?? "",
      text: createPostDto.text,
      tags: createPostDto.tags,
      contents: [], // TODO: grab content through swr or endpoint
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
      paid: false
    }

    setNewPosts([post, ...newPosts])
  }

  // TODO: Missing the state to remove the post optimistically

  return (
    <>
      <NewPostEditor handleSavePost={handleSavePost} initialData={{}} />
      {newPosts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </>
  )
}
