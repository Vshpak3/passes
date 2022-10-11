import { CreatePostRequestDto, PostApi, PostDto } from "@passes/api-client"
import { useState } from "react"
import { Post } from "src/components/organisms/profile/post/Post"
import { PostDataContext } from "src/contexts/PostData"
import { useCreatorProfile } from "src/hooks"

import { NewPost } from "./NewPost"

interface PostWrapperProps {
  readonly post: PostDto
}

const PostWrapper: React.FC<PostWrapperProps> = ({ post }) => {
  const [isRemoved, setIsRemoved] = useState(false)

  return (
    <PostDataContext.Provider
      key={post.postId}
      value={{ ...post, isRemoved, setIsRemoved }}
    >
      <Post key={post.postId} />
    </PostDataContext.Provider>
  )
}

export const NewPosts: React.FC = () => {
  const { profile, profileUsername } = useCreatorProfile()
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
      userId: profile?.userId || "",
      username: profileUsername || "",
      displayName: profile?.displayName ?? "",
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

  // TODO: Missing the state to remove the post optimistically

  return (
    <>
      <NewPost
        // TODO: passes={profile?.passes}
        createPost={createPost}
        placeholder="What's on your mind?"
        initialData={{}}
      />
      <div className="mt-9 space-y-6">
        {newPosts.map((post) => (
          <PostWrapper key={post.postId} post={post} />
        ))}
      </div>
    </>
  )
}
