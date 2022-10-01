import { CommentDto } from "@passes/api-client"
import { CommentApi, LikeApi, PostApi } from "@passes/api-client/apis"
import dynamic from "next/dynamic"
import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import FundraiserCoinIcon from "public/icons/post-fundraiser-coin-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import VerifiedSmall from "public/icons/post-verified-small-icon.svg"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TimeAgo from "react-timeago"
import { toast } from "react-toastify"
import { Button, PostUnlockButton, Text } from "src/components/atoms"
import PostStaticsButton from "src/components/molecules/post/PostStaticsButton"
import {
  BlockModal,
  CustomMentionEditor,
  FormContainer,
  ReportModal
} from "src/components/organisms"
import { useUser } from "src/hooks"

import {
  classNames,
  compactNumberFormatter,
  ContentService,
  formatCurrency
} from "../../../../../helpers"

const BuyPostModal = dynamic(
  () => import("src/components/organisms/BuyPostModal"),
  {
    ssr: false
  }
)
const TipsModal = dynamic(() => import("src/components/organisms/TipsModal"), {
  ssr: false
})

const PostViewModal = dynamic(
  () => import("src/components/organisms/post/ViewModal"),
  {
    ssr: false
  }
)

import { PostDropdown } from "./post-dropdown"

export const Post = ({ profile, post }: any) => {
  const [postUnlocked, setPostUnlocked] = useState(!post?.locked)
  const [postPinned, setPostPinned] = useState(false)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)

  const getDropdownOptions = [
    {
      text: "Report",
      onClick: () => setUserReportModal(true)
    },
    {
      text: "Block",
      onClick: () => setUserBlockModal(true)
    }
  ]

  return (
    <>
      {currentPost && (
        <PostViewModal
          post={currentPost}
          isOpen
          onClose={() => setCurrentPost(null)}
          view={currentPost.fundraiser ? "creator" : "fan"}
        />
      )}
      <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar
          post={post}
          profile={profile}
          postPinned={postPinned}
          setPostPinned={setPostPinned}
          dropdownItems={getDropdownOptions}
        />
        <BlockModal
          isOpen={userBlockModal}
          setOpen={setUserBlockModal}
          userId={profile.userId}
        />
        <ReportModal
          isOpen={userReportModal}
          setOpen={setUserReportModal}
          userId={profile.userId}
        />

        <div className="cursor-pointer" onClick={() => setCurrentPost(post)}>
          <PostTextContent post={post} />
        </div>
        {post.fundraiser ? (
          <FundraiserMedia images={post.content} />
        ) : (
          <LockedMedia
            post={post}
            postUnlocked={postUnlocked}
            setPostUnlocked={setPostUnlocked}
          />
        )}
        <PostEngagement post={post} postUnlocked={postUnlocked} />
        {post.fundraiser && <FundraiserTab post={post} />}
      </FormContainer>
    </>
  )
}

export const PostProfileAvatar = ({
  profile,
  post,
  dropdownItems = []
}: any) => {
  const { user } = useUser()

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-4">
          {profile.userId ? (
            <img // eslint-disable-line @next/next/no-img-element
              className="h-12 w-12 rounded-full object-cover"
              src={ContentService.profileThumbnail(profile.userId)}
              alt={profile.fullName}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-passes-primary-color">
              <div className="absolute flex h-12 w-12 items-center justify-center uppercase">
                {profile.fullName && profile.fullName[0]}
              </div>
            </div>
          )}
          <div className="space-y-1 font-medium dark:text-white">
            <div className="flex items-center gap-[6px]">
              <span className="whitespace-nowrap font-semibold text-[#ffffff] md:text-[20px] md:leading-[25px]">
                {profile.fullName}
              </span>
              <span className="flex items-center">
                <VerifiedSmall />
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {profile.username}
            </div>
          </div>
        </div>
        <div className="-mt-[21px] flex flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
          <div className="leading=[22px] text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
            <TimeAgo
              className="uppercase text-gray-300/60"
              date={post.createdAt ? post.createdAt : post.date}
              minPeriod={30}
            />
          </div>
          {user?.id === post.userId && <PostStaticsButton />}

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

export const PostTextContent = ({ post }: any) => (
  <div className="flex flex-col items-start">
    <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
      {post.caption ? post.caption : post.text}
    </p>
    {post.fundraiser && (
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
    )}
  </div>
)

export const LockedMedia = ({ postUnlocked, post, setPostUnlocked }: any) => {
  const [openBuyPostModal, setOpenBuyPostModal] = useState(null)

  const onMockedSuccess = () => {
    setPostUnlocked(true)
    setOpenBuyPostModal(null)
  }

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
            <div className="flex-center h-45 flex w-[245px] flex-col ">
              <PostUnlockButton
                onClick={() => setOpenBuyPostModal(post)}
                value={postUnlocked}
                name={`Unlock Post For ${formatCurrency(post.price ?? 100)}`}
              />
              <div className="flex items-center justify-center pt-4 text-[#ffffff]">
                <span>Unlock 4 videos, 20 photos</span>
              </div>
            </div>
          )}
        </div>
        {post.content?.length > 0 && (
          <img // eslint-disable-line @next/next/no-img-element
            src={post.content[0].url}
            alt=""
            className="w-full rounded-[20px] object-cover shadow-xl"
          />
        )}
      </div>
      <BuyPostModal postInfo={openBuyPostModal} setOpen={onMockedSuccess} />
    </>
  )
}

export const PostEngagement = ({
  post,
  postUnlocked = false,
  ownsProfile
}: any) => {
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
      console.error(error)
      toast.error(error)
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
      console.error(error)
      toast.error(error)
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
            <ShareIcon />
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
          <span className="text-[16px] leading-[25px]">{post.price}</span>
          <CostIcon />
        </div>
      </div>
      <CommentSection
        postId={post.postId}
        visible={showCommentSection}
        updateEngagement={updateEngagement}
      />
      <TipsModal
        isOpen={isTipsModalOpen}
        postId={post.postId}
        setOpen={setIsTipsModalOpen}
      />
    </div>
  )
}

export const CommentSection = ({
  postId = "",
  visible = false,
  updateEngagement
}: any) => {
  const [isLoadingComments, setLoadingComments] = useState(false)
  const [comments, setComments] = useState<CommentDto[]>([])
  const { getValues, setValue } = useForm()

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
        console.error(error)
        toast.error(error)
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
      updateEngagement()
    } catch (error: any) {
      console.error(error)
      toast.error(error)
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
        comments.map((comment) => (
          <Comment comment={comment} key={(comment as any).commentId} />
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
          className="ml-4 h-[40px] w-[10%] min-w-[70px]"
        >
          Post
        </Button>
      </form>
    </div>
  )
}

export const Comment = ({ comment }: any) => {
  return (
    <div className="flex w-full flex-row border-b-[1px] border-b-gray-300/10 py-2">
      <div className="h-[40px] min-h-[40px] w-[40px] min-w-[40px] items-start justify-start rounded-full bg-red-300" />
      <TimeAgo
        className="absolute right-5 text-[12px] text-gray-300/60"
        date={comment?.createdAt}
        live={false}
      />
      <div className="ml-4 flex max-w-[100%] flex-col flex-wrap">
        <Text fontSize={14} className="mb-1 font-bold">
          {comment?.commenterDisplayName ?? "Fan"}
        </Text>
        <Text
          fontSize={14}
          className="break-normal break-all text-start font-light"
        >
          {comment?.text}
        </Text>
      </div>
    </div>
  )
}
export const FundraiserMedia = ({ images }: any) => {
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
              <img // eslint-disable-line @next/next/no-img-element
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

export const FundraiserTab = ({ post }: any) => {
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

export const ProgressBar = ({ progressPercentage }: any) => {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-[6px] bg-[#FFFFFF]">
      <div
        style={{ width: `${progressPercentage}%` }}
        className="h-full bg-[#EE53C3] "
      ></div>
    </div>
  )
}
