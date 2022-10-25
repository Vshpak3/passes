import { useRouter } from "next/router"
import { useEffect } from "react"

import { Loader } from "src/components/atoms/Loader"
import { PostByUrl } from "src/components/organisms/profile/post/PostByUrl"
import { queryParam } from "src/helpers/query"
import { useSinglePost } from "src/hooks/profile/useSinglePost"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
import { NotFoundPage } from "src/pages/404"

const PostByUrlPage = () => {
  const router = useRouter()
  const { post, setPostId, loadingPost, hasInitialFetch } =
    useSinglePost(undefined)

  useEffect(() => {
    if (router.query?.postid) {
      setPostId(queryParam(router.query.postid))
    }
  }, [router, setPostId])

  return (
    <>
      {!hasInitialFetch || loadingPost ? (
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

export default WithNormalPageLayout(PostByUrlPage, { header: false })
