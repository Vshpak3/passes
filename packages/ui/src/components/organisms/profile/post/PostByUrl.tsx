import { FC, useEffect } from "react"

import { Loader } from "src/components/atoms/Loader"
import { Header } from "src/components/molecules/performance/Header"
import { usePost } from "src/hooks/entities/usePost"
import { NotFoundPage } from "src/pages/404"
import { PostCached } from "./PostCached"

interface PostByUrlProps {
  postId: string
}

export const PostByUrl: FC<PostByUrlProps> = ({ postId }) => {
  const { post, loadingPost, mutatePost, hasInitialFetch } = usePost(postId)
  useEffect(() => {
    if (!post) {
      mutatePost()
    }
  }, [post, mutatePost])

  return (
    <>
      {!hasInitialFetch || loadingPost ? (
        <div className="pt-[100px]">
          <Loader />
        </div>
      ) : post ? (
        <>
          <Header />
          <div className="grid w-full grid-cols-7">
            <div className="col-span-7 w-full pt-20 lg:col-span-4">
              <PostCached bordered post={post} postByUrl toUpdate={false} />
            </div>
            <div className="col-span-3 hidden h-screen border-l-[0.5px] border-passes-gray lg:block" />
          </div>
        </>
      ) : (
        hasInitialFetch && <NotFoundPage />
      )}
    </>
  )
}
