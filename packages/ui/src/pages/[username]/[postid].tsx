import { useRouter } from "next/router"

import { PostByUrl } from "src/components/organisms/profile/post/PostByUrl"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PostByUrlPage = () => {
  const router = useRouter()

  return (
    <>
      {!!router.query?.postid && (
        <PostByUrl postId={router.query?.postid as string} />
      )}
    </>
  )
}

export default WithNormalPageLayout(PostByUrlPage, {
  header: false,
  skipAuth: true
})
