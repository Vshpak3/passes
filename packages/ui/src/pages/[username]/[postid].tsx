import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { PostByUrl } from "src/components/organisms/profile/post/PostByUrl"
import { usePost } from "src/hooks/usePost"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
import { NotFoundPage } from "src/pages/404"

const PostByUrlPage = () => {
  const router = useRouter()
  const postId = router.query?.postid as string
  const { post, loading, mutate } = usePost(postId)

  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!hasLoaded && post === undefined) {
      mutate()
    }
    setHasLoaded(true)
  }, [hasLoaded, mutate, post])

  return (
    <>{!loading && (!post ? <NotFoundPage /> : <PostByUrl post={post} />)}</>
  )
}

export default WithNormalPageLayout(PostByUrlPage)
