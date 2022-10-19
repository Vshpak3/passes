import { PostDto } from "@passes/api-client"
import { FC, useRef } from "react"
import {
  PostContent,
  PostContentProps
} from "src/components/molecules/PostContent"
import { Carousel } from "src/components/organisms/profile/post/Carousel"
import { useViewPostModal } from "src/hooks/useViewPostModal"

export interface PostMediaContentProps {
  postId: string
  contents: PostDto["contents"]
  setPostHandler?: PostContentProps["setPostHandler"]
}

export const PostMediaContent: FC<PostMediaContentProps> = ({
  postId,
  contents = [],
  setPostHandler
}) => {
  const { viewPostActiveIndex } = useViewPostModal()

  const imgRef = useRef<HTMLImageElement>(null)

  // For now we don't have any logic when the content has loaded
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onMediaLoad = () => () => {}

  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      {contents.length === 1 ? (
        <PostContent
          content={contents[0]}
          onMediaLoad={onMediaLoad}
          setPostHandler={setPostHandler}
          ref={imgRef}
        />
      ) : (
        contents.length > 1 && (
          <div className="relative w-[100%]">
            <Carousel
              contents={contents}
              onMediaLoad={onMediaLoad}
              setPostHandler={setPostHandler}
              afterChangeHandler={(current: number) => {
                viewPostActiveIndex.current = { [postId]: current }
              }}
              activeIndex={viewPostActiveIndex.current?.[postId] || 0}
            />
          </div>
        )
      )}
    </div>
  )
}
