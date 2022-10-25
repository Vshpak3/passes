import { PostDto } from "@passes/api-client"
import { FC, useRef } from "react"
import { PostContent } from "src/components/molecules/PostContent"
import { Carousel } from "src/components/organisms/profile/post/Carousel"

export interface MediaContentProps {
  contents: PostDto["contents"]
}

export const MediaContent: FC<MediaContentProps> = ({ contents = [] }) => {
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
          ref={imgRef}
        />
      ) : (
        contents.length > 1 && (
          <div className="relative w-[100%]">
            <Carousel contents={contents} onMediaLoad={onMediaLoad} />
          </div>
        )
      )}
    </div>
  )
}
