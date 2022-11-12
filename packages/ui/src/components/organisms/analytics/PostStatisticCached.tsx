import { PostDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePost } from "src/hooks/profile/usePost"
import { PostStatistic } from "./PostStatistic"

export interface PostStatisticCachedProps {
  post: PostDto
}

const PostStatisticCached: FC<PostStatisticCachedProps> = ({
  post,
  ...res
}: PostStatisticCachedProps) => {
  const { post: cachedPost, update } = usePost(post.postId)

  useEffect(() => {
    if (!cachedPost) {
      update(post)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  return <PostStatistic post={cachedPost ?? post} {...res} update={update} />
}

export default PostStatisticCached // eslint-disable-line import/no-default-export
