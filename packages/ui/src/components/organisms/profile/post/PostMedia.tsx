import {
  ContentDto,
  ContentDtoContentTypeEnum,
  PostDto
} from "@passes/api-client"
import dynamic from "next/dynamic"
import { FC, useEffect, useRef, useState } from "react"

const PostVideo = dynamic(
  () => import("src/components/molecules/post/PostVideo"),
  { ssr: false }
)

interface PostMediaProps {
  post: PostDto
}

const PostMedia: FC<PostMediaProps> = ({ post }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoadingStart, setIsLoadingStart] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const startLoadingHandler = () => () => setIsLoadingStart(true)

  const onLoadingHandler = () => {
    if (imgRef.current && imgRef.current.complete && setIsLoading) {
      setIsLoadingStart(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    onLoadingHandler()
  }, [isLoadingStart, setIsLoading, post])

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

export default PostMedia
