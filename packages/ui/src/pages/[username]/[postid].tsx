import { useRouter } from "next/router"
import React from "react"

import { Post } from "../../components/pages/profile/main-content/news-feed/post"
import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
import usePost from "../../hooks/usePost"
import { withPageLayout } from "../../layout/WithPageLayout"

const PostByUrl = () => {
  const router = useRouter()
  const postId = router.query?.postid as string
  const { post, loading } = usePost(postId)
  const profile = {
    username: post?.username,
    fullName: post?.username,
    userId: post?.userId,
    profileImageUrl: "https://www.w3schools.com/w3images/avatar2.png",
    passes: []
  }

  if (loading) {
    return null
  }

  return (
    <AuthOnlyWrapper isPage>
      <div className="w-full bg-black">
        <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
          <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
            {post && <Post profile={profile} post={post} />}
          </div>
        </div>
      </div>
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(PostByUrl)
