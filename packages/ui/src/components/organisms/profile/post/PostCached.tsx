import { PostDto } from "@passes/api-client"
import { FC, memo, useEffect } from "react"

import { usePost } from "src/hooks/entities/usePost"
import { Post } from "./Post"

export interface PostCachedProps {
  post: PostDto
  postByUrl?: boolean
  allowPinned?: boolean
  // Whether or not the post was from returned from the feed API
  isPinned?: boolean
  bordered?: boolean

  toUpdate?: boolean
}

const PostCachedUnmemo: FC<PostCachedProps> = ({
  post,
  toUpdate = true,
  ...res
}: PostCachedProps) => {
  const { post: cachedPost, update } = usePost(post.postId)
  useEffect(() => {
    if (!cachedPost && toUpdate) {
      update(post)
    }
  }, [post, cachedPost, update, toUpdate])

  return <Post post={cachedPost ?? post} {...res} update={update} />
}

export const PostCached = memo(PostCachedUnmemo)
