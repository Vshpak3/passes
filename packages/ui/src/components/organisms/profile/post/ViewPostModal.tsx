import { PostDto } from "@passes/api-client"
import classnames from "classnames"
import Image from "next/image"
import MessageIcon from "public/icons/message-dots-square.svg"
import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import TimeAgo from "react-timeago"
import { PostUnlockButton } from "src/components/atoms/Button"
import { LikeButton } from "src/components/molecules/post/LikeButton"
import { PostStatisticsButton } from "src/components/molecules/post/PostStatisticsButton"
import { TipButton } from "src/components/molecules/post/TipButton"
import { Dialog } from "src/components/organisms/Dialog"
import {
  Dropdown,
  DropdownOption
} from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownCopyLink,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptionsGeneral"
import { DropDownDeletePost } from "src/components/organisms/profile/drop-down/DropdownOptionsPost"
import { Carousel } from "src/components/organisms/profile/post/Carousel"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { compactNumberFormatter, formatCurrency } from "src/helpers/formatters"
import { plural } from "src/helpers/plural"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useBuyPostModal } from "src/hooks/useBuyPostModal"
import { usePost } from "src/hooks/usePost"
import { useReportModal } from "src/hooks/useReportModal"
import { useViewPostModal } from "src/hooks/useViewPostModal"

import { CommentFeed } from "./CommentFeed"

export interface ViewPostModalProps {
  post: PostDto & { setIsRemoved?: Dispatch<SetStateAction<boolean>> }
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

export const ViewPostModal: FC<ViewPostModalProps> = ({ post, setPost }) => {
  const { images, video } = contentTypeCounter(post.contents)
  const { setPost: setBuyPost } = useBuyPostModal()
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()
  const { viewPostActiveIndex } = useViewPostModal()
  const [showcaseImg, setShowcaseImg] = useState<null | string>(null)
  const { removePost } = usePost()

  // Set image if it exists in post
  useEffect(() => {
    if (post.contents?.[0]?.contentType === "image") {
      setShowcaseImg(post.contents[0].signedUrl as string)
    }
  }, [post.contents])

  const postUnlocked = !post.purchasable

  const {
    createdAt,
    earningsPurchases,
    isLiked,
    numLikes,
    numPurchases,
    numComments,
    purchasable,
    postId,
    totalTipAmount,
    username
  } = post

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!post.isOwner, setIsReportModalOpen),
    ...DropDownBlock(!post.isOwner, setIsBlockModalOpen),
    ...DropDownDeletePost(post.isOwner, post.postId, removePost, () => {
      post.setIsRemoved?.(true)
      setPost(null)
    }),
    DropDownCopyLink(username, postId)
  ]

  return (
    <Dialog open={true} className="z-10" onClose={() => setPost(null)}>
      <div className="relative flex max-h-screen min-h-[85vh] w-[90vw] max-w-[1285px] flex-col overflow-auto rounded-[20px] border border-white/[0.15] bg-[#1B141D]/40 p-6 pl-5 backdrop-blur-3xl lg:flex-row">
        <div className="relative flex flex-1">
          {!postUnlocked && (
            <div className="absolute h-[80%] w-[80%] translate-x-[10%] translate-y-[10%] [filter:blur(15px)]">
              <Image
                src={showcaseImg || ""}
                layout="fill"
                alt="post"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
          )}
          <div className="relative mr-[27px] flex h-96 flex-1 flex-col space-y-[35px] rounded-[20px] border border-white/20 bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px] lg:h-auto">
            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[20px]">
              {postUnlocked && post.contents && post.contents.length === 1 && (
                <Image
                  src={showcaseImg || ""}
                  layout="fill"
                  alt="post"
                  objectFit="cover"
                  objectPosition="center"
                />
              )}
              <div className="relative mt-3 flex h-[500px] w-full w-[600px] flex-row items-center justify-center bg-transparent">
                {postUnlocked && post.contents && post.contents.length > 1 && (
                  <Carousel
                    contents={post.contents}
                    activeIndex={
                      (viewPostActiveIndex.current &&
                        viewPostActiveIndex.current[post.postId]) ||
                      0
                    }
                  />
                )}
              </div>
              {!postUnlocked && (
                <>
                  <PostUnlockButton
                    onClick={() => setBuyPost(post)}
                    name={`Unlock Post For ${formatCurrency(post.price ?? 0)}`}
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
            <div className="flex justify-between">
              <LikeButton
                isLiked={isLiked}
                numLikes={numLikes}
                purchasable={purchasable}
                postId={postId}
              />
              <TipButton postId={postId} />
            </div>
          </div>
        </div>
        <div className="w-full pt-3 pb-[70px] lg:w-[348px]">
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
              {post.isOwner && (
                <PostStatisticsButton
                  numLikes={numLikes}
                  earningsPurchases={earningsPurchases}
                  createdAt={createdAt}
                  numPurchases={numPurchases}
                  numComments={numComments}
                  totalTipAmount={totalTipAmount}
                />
              )}
            </div>
            <Dropdown items={dropdownOptions} />
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
          <p className="mt-7 text-justify text-base font-medium">{post.text}</p>
          <div className="mt-8 flex items-center justify-start space-x-1.5 border-b border-[#727272] pb-2 text-xs font-medium text-passes-gray-100">
            <MessageIcon />
            <span>{compactNumberFormatter(post.numComments)}</span>
          </div>
          <div className="max-h-[380px] overflow-auto">
            <CommentFeed postId={post.postId} ownsPost={post.isOwner} />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
