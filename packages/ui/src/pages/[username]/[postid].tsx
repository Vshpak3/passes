import dynamic from "next/dynamic"
import { useRouter } from "next/router"

const Post = dynamic<any>(
  () =>
    import("src/components/pages/profile/main-content/news-feed/post").then(
      (mod) => mod.Post
    ),
  {
    ssr: false
  }
)

import usePost from "src/hooks/usePost"
import { withPageLayout } from "src/layout/WithPageLayout"
import { NotFoundPage } from "src/pages/404"

const PostByUrl = () => {
  const router = useRouter()
  const postId = router.query?.postid as string
  const { post } = usePost(postId)
  const profile = {
    username: post?.username,
    fullName: post?.username,
    userId: post?.userId,
    passes: []
  }

  return (
    <>
      {!post ? (
        <NotFoundPage />
      ) : (
        <div className="w-full bg-black">
          <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
            <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
              {post && <Post profile={profile} post={post} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default withPageLayout(PostByUrl)
