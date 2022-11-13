import { PostDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePost } from "src/hooks/entities/usePost"
import { Post } from "./Post"

export interface PostCachedProps {
  post: PostDto
  postByUrl?: boolean
  // Whether or not the post is from shown in the non-profile home feed
  inHomeFeed?: boolean
  // Whether or not the post was from returned from the feed API
  isPinned?: boolean
  fetch?: boolean
}

export const PostCached: FC<PostCachedProps> = ({
  post,
  fetch,
  ...res
}: PostCachedProps) => {
  const { post: cachedPost, update, mutatePost } = usePost(post.postId)

  useEffect(() => {
    update(post)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  useEffect(() => {
    if (fetch) {
      mutatePost()
    }
  }, [fetch, mutatePost])

  return <Post post={cachedPost ?? post} {...res} update={update} />
}

export default PostCached // eslint-disable-line import/no-default-export
