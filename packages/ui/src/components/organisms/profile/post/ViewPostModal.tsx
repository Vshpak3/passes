import { PostDto } from "@passes/api-client"
import classnames from "classnames"
import Image from "next/image"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import HeartIcon from "public/icons/heart-gray.svg"
import MessageIcon from "public/icons/message-dots-square.svg"
import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import TimeAgo from "react-timeago"
import { PostUnlockButton } from "src/components/atoms/Button"
import { PostStaticsButton } from "src/components/molecules/post/PostStaticsButton"
import { Dialog } from "src/components/organisms/Dialog"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"
import { PostDataContext } from "src/contexts/PostData"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { compactNumberFormatter, formatCurrency } from "src/helpers/formatters"
import { plural } from "src/helpers/plural"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useBuyPostModal } from "src/hooks/useBuyPostModal"
import { useComments } from "src/hooks/useComments"
import { usePost } from "src/hooks/usePost"
import { useReportModal } from "src/hooks/useReportModal"

import { DropdownOption, PostDropdown } from "./PostDropdown"

export interface ViewPostModalProps {
  post: PostDto & { setIsRemoved?: Dispatch<SetStateAction<boolean>> }
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

export const ViewPostModal: FC<ViewPostModalProps> = ({ post, setPost }) => {
  const { images, video } = contentTypeCounter(post.content)
  const { data } = useComments(post.postId)
  const { setPost: setBuyPost } = useBuyPostModal()
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()
  const [showcaseImg, setShowcaseImg] = useState<null | string>(null)
  const { removePost } = usePost(post.postId)

  // Set image if it exists in post
  useEffect(() => {
    if (post.content?.[0]?.contentType === "image") {
      setShowcaseImg(post.content[0].signedUrl as string)
    }
  }, [post.content])

  const postUnlocked = !post.paywall

  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setIsReportModalOpen(true)
    },
    {
      text: "Block",
      onClick: () => setIsBlockModalOpen(true)
    },
    ...(post.isOwner
      ? [
          {
            text: "Delete",
            onClick: async () => {
              removePost(post.postId)
              post.setIsRemoved?.(true)
              setPost(null)
            }
          }
        ]
      : [])
  ]

  return (
    <Dialog open={true} className="z-10" onClose={() => setPost(null)}>
      <PostDataContext.Provider value={post}>
        <div className="relative flex min-h-[85vh] w-[90vw] max-w-[1285px] rounded-[20px] border border-white/[0.15] bg-[#1B141D]/40 p-6 pl-5 backdrop-blur-[50px]">
          <div className="relative flex flex-1">
            {!postUnlocked && (
              <div className="absolute top-[67px] left-4 h-[68vh] w-[80%] [filter:blur(15px)] md:left-16 lg:left-20 xl:left-[113px]">
                <Image
                  src={showcaseImg || ""}
                  layout="fill"
                  alt="post"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
            )}

            <div className="relative mr-[27px] flex flex-1 flex-col space-y-[35px] rounded-[20px] border border-white/20 bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px]">
              <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[20px]">
                {postUnlocked && (
                  <Image
                    src={showcaseImg || ""}
                    layout="fill"
                    alt="post"
                    objectFit="cover"
                    objectPosition="center"
                  />
                )}

                {!postUnlocked && (
                  <>
                    <PostUnlockButton
                      onClick={() => setBuyPost(post)}
                      name={`Unlock Post For ${formatCurrency(
                        post.price ?? 0
                      )}`}
                      className="w-auto !px-[30px] !py-2.5"
                    />
                    <p className="mt-[17px] text-base font-medium">
                      <span>
                        UNLOCK {video ? "1 video" : plural("photo", images)}!
                      </span>
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-[5px]">
                  <HeartIcon />
                  <p className="text-xs font-medium leading-[14px] text-passes-gray-100">
                    {compactNumberFormatter(post.numLikes)}
                  </p>
                </div>
                <div className="flex items-center space-x-[5px]">
                  <DollarIcon />
                  <p className="text-label">{post.price || 0}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[248px] pt-3 pb-[70px]">
            <div className="flex items-center justify-between pl-0.5 pr-1.5">
              <div className="flex max-w-[80%] items-center space-x-2.5">
                {post.createdAt && (
                  <span
                    className={classnames(
                      "flex-shrink text-start text-xs text-white/50"
                    )}
                  >
                    <TimeAgo date={post.createdAt} minPeriod={30} />
                  </span>
                )}
                {post.isOwner && <PostStaticsButton />}
              </div>
              <PostDropdown items={dropdownOptions} />
            </div>
            <div className="mt-[50px] flex space-x-4">
              <ProfileThumbnail userId={post.userId} />
              <div>
                <div className="flex items-center">
                  <h4 className="mr-1.5 text-base font-medium leading-[22px]">
                    {post.displayName}
                  </h4>
                  <VerifiedIcon />
                  <span className="ml-0.5 text-xs font-medium text-white/50">
                    Verified
                  </span>
                </div>
                <p className="text-start text-xs font-medium leading-[22px] text-white/50">
                  @{post.username}
                </p>
              </div>
            </div>
            <p className="mt-7 text-justify text-base font-medium">
              {post.text}
            </p>
            <div className="mt-8 flex items-center justify-start space-x-1.5 border-b border-[#727272] pb-6 text-xs font-medium text-passes-gray-100">
              <MessageIcon />
              <span>{compactNumberFormatter(post.numComments)}</span>
            </div>
            <div className="mt-8 max-h-[380px] space-y-[34px] overflow-y-scroll">
              {data?.data.map(({ commentId, commenterDisplayName, text }) => (
                <div key={commentId}>
                  <div className="flex items-center space-x-3.5">
                    <span className="h-[30px] w-[30px] flex-shrink-0 rounded-full bg-[#BB5454]" />
                    <h6 className="text-sm font-medium leading-[22px]">
                      {commenterDisplayName}
                    </h6>
                  </div>
                  <p className="mt-2.5 text-start text-sm leading-6 text-white/60">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PostDataContext.Provider>
    </Dialog>
  )
}
