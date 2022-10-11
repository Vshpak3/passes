import {
  ContentDto,
  ContentDtoContentTypeEnum,
  GetFeedResponseDto
} from "@passes/api-client"
import dynamic from "next/dynamic"
import { FC, useEffect, useRef, useState } from "react"
import { usePostData } from "src/hooks/usePostData"
import { KeyedMutator } from "swr"

const PostVideo = dynamic(
  () => import("src/components/molecules/post/PostVideo"),
  { ssr: false }
)

interface PostMediaProps {
  mutatePosts?: KeyedMutator<GetFeedResponseDto>
}

export const PostMedia: FC<PostMediaProps> = ({ mutatePosts }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoadingStart, setIsLoadingStart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const post = usePostData()

  const startLoadingHandler = () => () => setIsLoadingStart(true)

  const onLoadingHandler = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    mutatePosts && mutatePosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onLoadingHandler()
  }, [isLoadingStart])
  return (
    <div className="relative mt-3 w-full bg-transparent">
      {!!post?.content?.length &&
        (isLoading ? (
          <span>Please wait! Your content is being uploaded</span>
        ) : (
          post.content.map((c: ContentDto) => {
            if (c.contentType === ContentDtoContentTypeEnum.Image) {
              return (
                <img
                  ref={imgRef}
                  onLoad={startLoadingHandler}
                  key={c.contentId}
                  src={c.signedUrl}
                  alt=""
                  className="w-full rounded-[20px] object-cover shadow-xl"
                />
              )
            } else if (c.contentType === ContentDtoContentTypeEnum.Video) {
              return (
                <PostVideo key={c.contentId} videoUrl={c.signedUrl ?? ""} />
              )
            } else {
              console.error("Unsupported media type")
            }
          })
        ))}
    </div>
  )
}
