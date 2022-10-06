import {
  CommentDto,
  ContentDto,
  ContentDtoContentTypeEnum,
  PostDto
} from "@passes/api-client"
import { CommentApi, LikeApi, PostApi } from "@passes/api-client/apis"
import classNames from "classnames"
import dynamic from "next/dynamic"
import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import VerifiedSmall from "public/icons/post-verified-small-icon.svg"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import TimeAgo from "react-timeago"
import { Button, PostUnlockButton, Text } from "src/components/atoms"
import PostStaticsButton from "src/components/molecules/post/PostStaticsButton"
import {
  BlockModal,
  CustomMentionEditor,
  FormContainer,
  ReportModal
} from "src/components/organisms"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"
import { compactNumberFormatter, formatCurrency } from "src/helpers"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks"

const PostVideo = dynamic(
  () => import("src/components/molecules/post/PostVideo"),
  { ssr: false }
)
const BuyPostModal = dynamic(
  () => import("src/components/organisms/payment/BuyPostModal"),
  { ssr: false }
)
const TipPostModal = dynamic(
  () => import("src/components/organisms/payment/TipPostModal"),
  { ssr: false }
)
const PostViewModal = dynamic(
  () => import("src/components/organisms/post/ViewModal"),
  { ssr: false }
)

import { copyToClipboard, PostDropdown } from "./post-dropdown"

interface PostProps {
  post: PostDto
  ownsProfile: boolean
  removePost?: (postId: string) => void
  setIsPayed?: (value: boolean) => void
}

export const Post = ({
  post,
  ownsProfile,
  removePost,
  setIsPayed
}: PostProps) => {
  const [postUnlocked, setPostUnlocked] = useState(!post.paywall)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()

  const getDropdownOptions = [
    {
      text: "Report",
      onClick: () => setUserReportModal(true)
    },
    {
      text: "Block",
      onClick: () => setUserBlockModal(true)
    },
    ...(post.userId === user?.id
      ? [
          {
            text: "Delete",
            onClick: () => {
              removePost && removePost(post.postId)
            }
          }
        ]
      : [])
  ]

  return (
    <>
      {currentPost && (
        <PostViewModal
          post={currentPost}
          isOpen
          onClose={() => setCurrentPost(null)}
          postUnlocked={postUnlocked}
        />
      )}
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar post={post} dropdownItems={getDropdownOptions} />
        <BlockModal
          isOpen={userBlockModal}
          setOpen={setUserBlockModal}
          userId={user?.id ?? ""}
        />
        <ReportModal
          isOpen={userReportModal}
          setOpen={setUserReportModal}
          userId={user?.id ?? ""}
        />
        <div className="cursor-pointer" onClick={() => setCurrentPost(post)}>
          <PostTextContent post={post} />
          <LockedMedia
            post={post}
            postUnlocked={postUnlocked}
            setPostUnlocked={setPostUnlocked}
            setIsPayed={setIsPayed}
            setIsLoading={setIsLoading}
          />
        </div>
        {/* {post.fundraiser ? (
          <FundraiserMedia images={post.content} />
        ) : (
        )} */}
        <PostEngagement
          post={post}
          postUnlocked={postUnlocked}
          ownsProfile={ownsProfile}
        />
        {isLoading && post?.content?.length && (
          <span>Please wait! Your content is being uploaded</span>
        )}
        {/* {post.fundraiser && <FundraiserTab post={post} />} */}
      </FormContainer>
    </>
  )
}

interface PostProfileAvatarProps {
  post: PostDto
  dropdownItems: Array<{
    text: string
    onClick: () => void
  }>
  hideStaticsBtn?: boolean
}

export const PostProfileAvatar: FC<PostProfileAvatarProps> = ({
  post,
  dropdownItems = [],
  hideStaticsBtn = false
}) => {
  const { user } = useUser()

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-4">
          <ProfileThumbnail userId={post.userId} />
          <div className="space-y-1 font-medium dark:text-white">
            {/* TODO: consider making this not link for non-creator comments */}
            <a href={`${window.location.origin}/${post.username}`}>
              <div className="flex items-center gap-[6px]">
                <span className="whitespace-nowrap font-semibold text-[#ffffff] md:text-[20px] md:leading-[25px]">
                  {post.displayName}
                </span>
                <span className="flex items-center">
                  <VerifiedSmall />
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                @{post.username}
              </div>
            </a>
          </div>
        </div>
        <div className="-mt-[21px] flex flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
          <div className="leading=[22px] text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
            <TimeAgo
              className="uppercase text-gray-300/60"
              date={post.createdAt ? post.createdAt : ""} // TODO: post.date}
              minPeriod={30}
            />
          </div>
          {user?.id === post.userId && !hideStaticsBtn && <PostStaticsButton />}

          <div className="flex items-center gap-[15px]">
            {/* <div
          onClick={() => setPostPinned(!postPinned)}
          className={classNames(
            postPinned ? "gap-[10px] rounded-lg bg-[#FFFFFF]/10 px-[10px]" : "",
            "flex cursor-pointer items-center py-[5px] "
          )}
        >
          {postPinned && (
            <span className="text-[12px] font-medium leading-[22px]">
              Pinned post
            </span>
          )}
          {postPinned ? <PinnedActive /> : <PinnedInactive />}
        </div> */}
            <div>
              <PostDropdown post={post} items={dropdownItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface PostTextContentProps {
  post: any
}

export const PostTextContent: FC<PostTextContentProps> = ({ post }) => (
  <div className="flex flex-col items-start">
    <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
      {post.caption ? post.caption : post.text}
    </p>
    {/* {post.fundraiser && (
      <div className="ml-auto flex pt-3">
        <div className="flex cursor-pointer items-center gap-[10px] rounded-md bg-[#ffff]/10 py-[7px] px-[10px] ">
          <span className="text-[12px] font-medium leading-[22px] text-[#ffff]">
            Fundraiser
          </span>
          <span>
            <FundraiserCoinIcon />
          </span>
        </div>
      </div>
    )} */}
  </div>
)

interface LockedMedia {
  postUnlocked: boolean
  post: PostDto
  setPostUnlocked: any
  setIsPayed?: (value: boolean) => void
  setIsLoading?: (value: boolean) => void
}

export const LockedMedia = ({
  postUnlocked,
  post,
  setIsPayed,
  setIsLoading
}: LockedMedia) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [openBuyPostModal, setOpenBuyPostModal] = useState<boolean>(false)
  const { images, video } = contentTypeCounter(post.content)
  const [isLoadingStart, setIsLoadingStart] = useState(false)

  const startLoadingHandler = () => () => setIsLoadingStart(true)

  const onLoadingHandler = () => {
    if (imgRef.current && imgRef.current.complete && setIsLoading) {
      setIsLoadingStart(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    onLoadingHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {postUnlocked &&
          post?.content?.length &&
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
          })}
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

interface PostEngagementProps {
  post: any
  postUnlocked: boolean
  ownsProfile: boolean
}

export const PostEngagement: FC<PostEngagementProps> = ({
  post,
  postUnlocked = false,
  ownsProfile
}) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false)
  const [numLikes, setNumLikes] = useState(post.numLikes)
  const [numComments, setNumComments] = useState(post.numComments)
  const [liked, setLiked] = useState(post.isLiked)
  const [showCommentSection, setShowCommentSection] = useState(false)

  async function updateEngagement() {
    try {
      const api = new PostApi()
      const response = await api.findPost({
        postId: post.postId
      })

      setNumLikes(response.numLikes)
      setNumComments(response.numComments)
      setLiked(response.isLiked)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  const likePost = async () => {
    try {
      if (!postUnlocked) {
        return
      }

      const api = new LikeApi()

      if (!liked) {
        await api.likePost({
          postId: post.postId
        })
      } else {
        await api.unlikePost({
          postId: post.postId
        })
      }
      updateEngagement()
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-end">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-[25px] p-0 md:gap-[45px]">
          <div
            onClick={likePost}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <HeartIcon fill={liked ? "#A09FA6" : "none"} />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {compactNumberFormatter(numLikes)}
            </span>
          </div>
          <div
            onClick={() => {
              postUnlocked && setShowCommentSection((prev) => !prev)
            }}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <MessagesIcon />
            <span className="text-[12px] leading-[15px] text-passes-gray-100">
              {compactNumberFormatter(numComments)}
            </span>
          </div>
          <div className="flex cursor-pointer items-center gap-[5px] p-0">
            <ShareIcon onClick={() => copyToClipboard(post)} />
            {ownsProfile && (
              <span className="text-[12px] leading-[15px] text-passes-gray-100">
                {compactNumberFormatter(post.sharesCount)}
              </span>
            )}
          </div>
        </div>
        <div
          onClick={() => setIsTipsModalOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-2 pr-2 text-passes-gray-100"
        >
          <CostIcon />
        </div>
        {post.tipAmount && "$" + post.tipAmount.toFixed(2)}
      </div>
      <CommentSection
        postId={post.postId}
        visible={showCommentSection}
        updateEngagement={updateEngagement}
      />
      <TipPostModal
        isOpen={isTipsModalOpen}
        postId={post.postId}
        setOpen={setIsTipsModalOpen}
      />
    </div>
  )
}

interface CommentSectionProps {
  postId: string
  visible: boolean
  updateEngagement: any
}

export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  visible = false,
  updateEngagement
}) => {
  const [isLoadingComments, setLoadingComments] = useState(false)
  const [comments, setComments] = useState<CommentDto[]>([])
  const [isReset, setIsReset] = useState(false)
  const {
    getValues,
    setValue,
    formState: { isSubmitSuccessful }
  } = useForm()

  const getComments = useCallback(
    async (withLoadingState = true) => {
      try {
        if (withLoadingState) {
          setLoadingComments(true)
        }
        const api = new CommentApi()

        const response = await api.findCommentsForPost({
          getCommentsForPostRequestDto: {
            postId
          }
        })

        setComments(response.comments)
      } catch (error: any) {
        errorMessage(error, true)
      } finally {
        setLoadingComments(false)
      }
    },
    [postId]
  )

  useEffect(() => {
    if (visible) {
      getComments()
    }
  }, [getComments, visible])

  async function postComment() {
    try {
      const text = getValues("comment")
      const tags = getValues("mentions")
      if (text.length === 0) {
        return
      }

      const api = new CommentApi()

      await api.createComment({
        createCommentRequestDto: {
          text,
          tags,
          postId
        }
      })

      setValue("comment", "")
      getComments(false)
      setIsReset(true)
      updateEngagement()
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <div
      className={classNames(
        "mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10",
        !visible ? "hidden" : ""
      )}
    >
      {isLoadingComments ? (
        <div className="flex w-full items-center justify-center">
          <span className="h-7 w-7 animate-spin rounded-[50%] border-4 border-t-4 border-gray-400 border-t-white" />
        </div>
      ) : (
        comments.map((comment: CommentDto) => (
          <Comment key={comment.commentId} comment={comment} />
        ))
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          postComment()
        }}
        className="flex w-full flex-row items-center pt-5"
      >
        <div className="hide-scroll block w-full resize-none overflow-auto overflow-y-visible rounded-lg border border-white/50 bg-black/10 p-4 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]">
          <CustomMentionEditor
            isReset={isReset}
            setIsReset={setIsReset}
            placeholder="Type a comment..."
            onInputChange={(params: any) => {
              setValue("comment", params?.text)
              setValue("mentions", params?.mentions)
            }}
          />
        </div>
        <Button
          tag="button"
          variant="pink"
          disabled={isSubmitSuccessful}
          className="ml-4 h-[40px] w-[10%] min-w-[70px]"
        >
          Post
        </Button>
      </form>
    </div>
  )
}

interface CommentProps {
  readonly comment: CommentDto
}

export const Comment: FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex w-full justify-between border-b-[1px] border-b-gray-300/10 py-2">
      <div className="flex w-full">
        <div className="h-[40px] min-h-[40px] w-[40px] min-w-[40px] items-start justify-start rounded-full">
          <ProfileThumbnail userId={comment.commenterId} />
        </div>
        <div className="ml-4 flex max-w-[100%] flex-col flex-wrap">
          <div className="flex gap-x-2">
            {comment.commenterDisplayName && (
              <Text fontSize={14} className="mb-1 font-bold">
                {comment.commenterDisplayName}
              </Text>
            )}
            <Text fontSize={14} className="mb-1 text-gray-500">
              @{comment.commenterUsername}
            </Text>
          </div>
          <Text
            fontSize={14}
            className="break-normal break-all text-start font-light"
          >
            {comment.text}
          </Text>
        </div>
      </div>
      <TimeAgo
        className="ml-4 shrink-0 text-[12px] text-gray-300/60"
        date={comment.createdAt}
        live={false}
      />
    </div>
  )
}

// Old fundraising stuff

interface FundraiserMediaProps {
  images: any
}

export const FundraiserMedia: FC<FundraiserMediaProps> = ({ images }) => {
  const mediaGridLayout = (length: any, index: any) => {
    switch (length) {
      case 1:
        return "col-span-12"
      case 2:
      case 4:
        return "col-span-6"
      case 3:
        return index === 0 ? "col-span-6 row-span-2" : "col-span-6"
      case 5:
        return index === 0 || index === 1 ? "col-span-6" : "col-span-4"
      default:
        return "col-span-4"
    }
  }
  return (
    <div className="relative bg-transparent">
      <div className="grid h-full grid-cols-12 gap-4">
        {images.length > 0 &&
          images.map((image: any, index: any) => (
            <div
              key={`media_${index}`}
              className={mediaGridLayout(images.length, index)}
            >
              <img
                src={image.url}
                alt={`media_${index}`}
                className="rounded-[23px] object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  )
}

interface FundraiserTabProps {
  post: any
}

export const FundraiserTab: FC<FundraiserTabProps> = ({ post }) => {
  const [goal] = useState(post?.goal || 100)
  const [amountCollected, setAmountColleted] = useState(
    post?.collectedAmount || 0
  )
  const [numberOfDonations, setNumberOfDonations] = useState(
    post?.numberOfDonations || 0
  )

  const onDonate = (amount: any) => {
    setNumberOfDonations(numberOfDonations + 1)
    setAmountColleted(amountCollected + amount)
  }

  const progressPercentage = Math.min(
    100,
    Math.floor((amountCollected / goal) * 100)
  )
  return (
    <div className="flex w-full flex-col items-start rounded-md bg-[#1b141d]/80 px-4 py-4 backdrop-blur-[10px]">
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center text-[#ffffff]">
          <span className="pr-2">
            <FundraiserDollarIcon />
          </span>
          <span className="pr-1 text-[15px] font-medium leading-[16px] tracking-[0.003em]">
            {formatCurrency(amountCollected)}
          </span>
          <span className="self-end text-xs tracking-[0.003em]">
            USD raised of $100,000 goal
          </span>
        </div>
        <div className="self-end text-xs tracking-[0.003em] text-[#ffffff]/50">
          <span>{numberOfDonations}</span>
          <span> donations</span>
        </div>
      </div>
      <div className="flex w-full pt-3">
        <ProgressBar progressPercentage={progressPercentage} />
      </div>
      <span className="pt-[5px] text-[10px] leading-[16px] tracking-[0.003em] text-[#ffffff]/50">
        Last donation 1 hr ago
      </span>
      <div className="flex items-center gap-[5px] p-0 pt-[10px]">
        <span className="text-base font-medium text-[#ffff]/90">
          Donate now
        </span>
        {post.donationTypes.map((amount: any, index: any) => (
          <button
            key={index}
            onClick={() => onDonate(amount)}
            className="flex items-start gap-[10px] rounded-[56px] bg-[#0E0A0F] py-[10px] px-[18px] text-base font-bold leading-[25px] text-[#ffff]/90 hover:bg-passes-secondary-color/10"
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  progressPercentage: any
}

export const ProgressBar: FC<ProgressBarProps> = ({ progressPercentage }) => {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-[6px] bg-[#FFFFFF]">
      <div
        style={{ width: `${progressPercentage}%` }}
        className="h-full bg-[#EE53C3] "
      ></div>
    </div>
  )
}
