import dynamic from "next/dynamic"
import { useRouter } from "next/router"

// TODO: figure out why its necessary to cast to any
const Post = dynamic<any>(
  () =>
    import("src/components/organisms/profile/main-content/news-feed/post").then(
      (mod) => mod.Post
    ),
  { ssr: false }
)

import { useUser } from "src/hooks"
import usePost from "src/hooks/usePost"
import { withPageLayout } from "src/layout/WithPageLayout"
import { NotFoundPage } from "src/pages/404"

const PostByUrl = () => {
  const router = useRouter()
  const postId = router.query?.postid as string
  const { post, loading } = usePost(postId)
  const { user } = useUser()

  return (
    <>
      {!loading &&
        (!post ? (
          <NotFoundPage />
        ) : (
          <div className="w-full bg-black">
            <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
              <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
                {post && (
                  <Post post={post} ownsProfile={post.userId === user?.id} />
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  )
}

export default withPageLayout(PostByUrl)
