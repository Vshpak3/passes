import {
  CreatePostRequestDto,
  GetProfileResponseDto,
  PostApi,
  PostDto
} from "@passes/api-client"
import { useState } from "react"
import { Post } from "src/components/organisms/profile/post/Post"

import { NewPost } from "./NewPost"

interface NewPostsProps {
  profile: GetProfileResponseDto
  username: string
}

export const NewPosts = ({ profile, username }: NewPostsProps) => {
  const [newPosts, setNewPosts] = useState<PostDto[]>([])
  const createPost = async (createPost: CreatePostRequestDto) => {
    const api = new PostApi()
    const response = await api.createPost({
      createPostRequestDto: createPost
    })
    const postId = response.postId

    const post: PostDto = {
      postId,
      paywall: false,
      userId: profile.userId,
      username,
      displayName: profile.displayName ?? "",
      text: createPost.text,
      tags: createPost.tags,
      content: undefined, // TODO: grab content through swr or endpoint
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
  return (
    <>
      <NewPost
        initScheduledTime={null}
        // TODO: passes={profile?.passes}
        createPost={createPost}
        placeholder="What's on your mind?"
      />
      {newPosts.map((post) => (
        <Post key={post.postId} post={post} removable={true} />
      ))}
    </>
  )
}
