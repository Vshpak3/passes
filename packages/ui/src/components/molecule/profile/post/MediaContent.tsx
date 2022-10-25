import { PostDto } from "@passes/api-client"
import { FC } from "react"
import { Carousel } from "src/components/organisms/profile/post/Carousel"

export interface MediaContentProps {
  contents: PostDto["contents"]
  autoplayVideo?: boolean
}

export const MediaContent: FC<MediaContentProps> = ({
  contents = [],
  autoplayVideo
}) => {
  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      <div className="relative w-[100%]">
        <Carousel contents={contents} autoplayVideo={autoplayVideo} />
      </div>
    </div>
  )
}
