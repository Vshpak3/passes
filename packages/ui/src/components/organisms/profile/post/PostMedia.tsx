import { PostApi } from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import {
  PostMediaContent,
  PostMediaContentProps
} from "src/components/molecule/profile/post/PostMediaContent"

const CHECK_FOR_PROCESSED_CONTENT_MAX = 10 // seconds

interface PostMediaProps extends PostMediaContentProps {
  isNewPost: boolean
}

export const PostMedia: FC<PostMediaProps> = ({
  postId,
  contents = [],
  isNewPost = false
}) => {
  const [seconds, setSeconds] = useState(1)
  const [isProcessing, setIsProcessing] = useState(
    !!contents.length && isNewPost
  )
  const [postContent, setPostContent] = useState(contents)

  const postApi = new PostApi()

  const checkForProcessContent = async () => {
    if (isProcessing) {
      const res = await postApi.isAllPostContentProcessed({ postId })
      if (res.contentProcessed) {
        setIsProcessing(false)
        setPostContent(res.contents || [])
      }
    }
  }

  // Used for new posts to ensure the content shows up
  useEffect(() => {
    if (isProcessing) {
      const interval = setTimeout(async () => {
        checkForProcessContent()
        setSeconds(seconds + 1)
      }, Math.max(seconds, CHECK_FOR_PROCESSED_CONTENT_MAX))

      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, seconds])

  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      {isProcessing ? (
        <div className="relative mb-[30px] rounded-md border border-passes-purple-100 px-[25px] py-[15px]">
          Your content is being processed.
        </div>
      ) : (
        <PostMediaContent postId={postId} contents={postContent} />
      )}
    </div>
  )
}
