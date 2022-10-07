import {
  ContentDto,
  ContentDtoContentTypeEnum,
  PostDto
} from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import { FC, useEffect, useRef, useState } from "react"
import { PostUnlockButton } from "src/components/atoms"
import { formatCurrency } from "src/helpers"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"

const PostVideo = dynamic(
  () => import("src/components/molecules/post/PostVideo"),
  { ssr: false }
)
const BuyPostModal = dynamic(
  () => import("src/components/organisms/payment/BuyPostModal"),
  { ssr: false }
)

interface LockedMedia {
  postUnlocked: boolean
  post: PostDto
  setPostUnlocked: any
  setIsPayed?: (value: boolean) => void
}

export const LockedMedia: FC<LockedMedia> = ({
  postUnlocked,
  post,
  setIsPayed
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [openBuyPostModal, setOpenBuyPostModal] = useState<boolean>(false)
  const { images, video } = contentTypeCounter(post.content)
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
    <>
      <div className="relative w-full bg-transparent ">
        <div
          className={classNames(
            postUnlocked ? "" : "bg-[#1B141D]/50 backdrop-blur-[40px]",
            "absolute flex h-full w-full items-center justify-center rounded-[20px]"
          )}
        >
          {!postUnlocked && (
            <>
              <div className="flex-center h-45 flex w-[245px] flex-col ">
                <PostUnlockButton
                  onClick={() => setOpenBuyPostModal(true)}
                  value={postUnlocked.toString()}
                  name={`Unlock Post For ${formatCurrency(post.price ?? 0)}`}
                />
                {/* TODO: add in blurred image <img
                  src="/img/..."
                  alt=""
                  className="w-full rounded-[20px] object-cover shadow-xl"
                /> */}
                <div className="flex items-center justify-center pt-4 text-[#ffffff]">
                  <span>
                    Unlock{" "}
                    {video
                      ? "1 video"
                      : `${images} photo${images > 1 ? "s" : ""}`}
                    !
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        {post?.content?.length &&
          (isLoading ? (
            <span>Please wait! Your content is being uploaded</span>
          ) : (
            postUnlocked &&
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
      <BuyPostModal
        post={post}
        isOpen={openBuyPostModal}
        setOpen={setOpenBuyPostModal}
        setIsPayed={setIsPayed}
      />
    </>
  )
}
