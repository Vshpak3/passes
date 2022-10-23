import { FC } from "react"
import {
  PostMediaContent,
  PostMediaContentProps
} from "src/components/molecule/profile/post/PostMediaContent"

interface PostMediaProps extends PostMediaContentProps {
  isProcessing: boolean
}

export const PostMedia: FC<PostMediaProps> = ({
  postId,
  contents = [],
  isProcessing
}) => {
  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      {isProcessing ? (
        <div className="relative mb-[30px] rounded-md border border-passes-purple-100 px-[25px] py-[15px]">
          Your content is being processed.
        </div>
      ) : (
        <PostMediaContent postId={postId} contents={contents} />
      )}
    </div>
  )
}
