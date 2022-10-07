import { useRouter } from "next/router"
import { PostByUrl } from "src/components/organisms/profile/post/PostByUrl"
import usePost from "src/hooks/usePost"
import { withPageLayout } from "src/layout/WithPageLayout"
import { NotFoundPage } from "src/pages/404"

const PostByUrlPage = () => {
  const router = useRouter()
  const postId = router.query?.postid as string
  const { post, loading } = usePost(postId)

  return (
    <>{!loading && (!post ? <NotFoundPage /> : <PostByUrl post={post} />)}</>
  )
}

export default withPageLayout(PostByUrlPage)
