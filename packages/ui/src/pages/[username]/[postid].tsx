import { useRouter } from "next/router"
import { Loader } from "src/components/atoms/Loader"
import { PostByUrl } from "src/components/organisms/profile/post/PostByUrl"
import { usePost } from "src/hooks/usePost"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
import { NotFoundPage } from "src/pages/404"

const PostByUrlPage = () => {
  const router = useRouter()
  const postId = router.query?.postid as string
  const { post, loading, hasInitialFetch } = usePost(postId)

  return (
    <>
      {!post && loading ? (
        <div className="pt-[100px]">
          <Loader />
        </div>
      ) : post ? (
        <PostByUrl post={post} />
      ) : (
        hasInitialFetch && <NotFoundPage />
      )}
    </>
  )
}

export default WithNormalPageLayout(PostByUrlPage)
