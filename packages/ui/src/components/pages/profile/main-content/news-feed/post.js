import { CommentApi, LikeApi, PostApi } from "@passes/api-client/apis"
import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import FundraiserCoinIcon from "public/icons/post-fundraiser-coin-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import PostOptionsIcon from "public/icons/post-options-icon.svg"
// import PinnedActive from "public/icons/post-pinned-active.svg"
// import PinnedInactive from "public/icons/post-pinned-inactive.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import VerifiedSmall from "public/icons/post-verified-small-icon.svg"
import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TimeAgo from "react-timeago"
import { toast } from "react-toastify"
import { Button, FormInput, PostUnlockButton, Text } from "src/components/atoms"
import { FormContainer } from "src/components/organisms"
import BuyPostModal from "src/components/organisms/BuyPostModal"
import { classNames, compactNumberFormatter, formatCurrency } from "src/helpers"
import { wrapApi } from "src/helpers/wrapApi"

import TipsModal from "../../../../organisms/TipsModal"

export const Post = ({ profile, post }) => {
  const [postUnlocked, setPostUnlocked] = useState(!post.locked)
  const [postPinned, setPostPinned] = useState(false)
  return (
    //this is the rounded container
    <FormContainer className="!min-h-[10px]">
      <PostProfileAvatar
        post={post}
        profile={profile}
        postPinned={postPinned}
        setPostPinned={setPostPinned}
      />
      <PostTextContent post={post} />
      {post.fundraiser ? (
        <FundraiserMedia images={post.images} />
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
  )
}

export const PostProfileAvatar = ({ profile }) => (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-center space-x-4">
      <img // eslint-disable-line @next/next/no-img-element
        className="h-12 w-12 rounded-full object-cover"
        src={profile.profileImageUrl}
        alt={profile.fullName}
      />
      <div className="space-y-1 font-medium dark:text-white">
        <div className="flex items-center gap-[6px]">
          <span className="whitespace-nowrap font-semibold md:text-[20px] md:leading-[25px]">
            {profile.fullName}
          </span>
          <span className="flex items-center">
            <VerifiedSmall />
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {profile.userId}
        </div>
      </div>
    </div>
    <div className="-mt-[21px] flex flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
      <div className="leading=[22px] text-[12px] font-medium tracking-[1px] text-[#FFFFFF]/50">
        2 DAYS AGO
      </div>
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
          <PostOptionsIcon className="cursor-pointer stroke-[#868487] hover:stroke-white" />
        </div>
      </div>
    </div>
  </div>
)

export const PostTextContent = ({ post }) => (
  <div className="flex flex-col items-start">
    <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90 md:pl-[78px] md:pr-[30px]">
      {post.caption ? post.caption : post.text}
    </p>
    {post.fundraiser && (
      <div className="flex pt-3 md:pl-[78px]">
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

export const LockedMedia = ({ postUnlocked, post }) => {
  const [openBuyPostModal, setOpenBuyPostModal] = useState(null)

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
              <div className="flex items-center justify-center pt-4">
                <span>UNLOCK 4 videos, 20 photos</span>
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
      <BuyPostModal isOpen={openBuyPostModal} setOpen={setOpenBuyPostModal} />
    </>
  )
}

export const PostEngagement = ({ post, postUnlocked = false }) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false)
  const [numLikes, setNumLikes] = useState(post.numLikes)
  const [numComments, setNumComments] = useState(post.numComments)
  const [liked, setLiked] = useState(post.hasLiked)
  const [showCommentSection, setShowCommentSection] = useState(false)

  async function updateEngagement() {
    try {
      const api = wrapApi(PostApi)
      const response = await api.postFindOne({
        id: post.id
      })

      setNumLikes(response.numLikes)
      setNumComments(response.numComments)
      setLiked(response.hasLiked)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  async function likePost() {
    try {
      if (!postUnlocked) return

      const api = wrapApi(LikeApi)

      if (!liked)
        await api.likeCreate({
          id: post.id
        })
      else
        await api.likeDelete({
          id: post.id
        })

      setTimeout(updateEngagement, 1000)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-end">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-[45px] p-0">
          <div
            onClick={likePost}
            className="flex cursor-pointer items-center gap-[5px] p-0"
          >
            <HeartIcon fill={liked ? "#A09FA6" : "none"} />
            <span className="text-[12px] leading-[15px] text-[#A09FA6]">
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
            <span className="text-[12px] leading-[15px] text-[#A09FA6]">
              {compactNumberFormatter(numComments)}
            </span>
          </div>
          <div className="flex cursor-pointer items-center gap-[5px] p-0">
            <ShareIcon />
            <span className="text-[12px] leading-[15px] text-[#A09FA6]">
              {compactNumberFormatter(post.sharesCount)}
            </span>
          </div>
        </div>
        <div
          onClick={() => setIsTipsModalOpen((prev) => !prev)}
          className="flex items-center gap-2 pr-2"
        >
          <span className="text-[16px] leading-[25px]">{post.price}</span>
          <CostIcon />
        </div>
      </div>
      <CommentSection
        postId={post.id}
        visible={showCommentSection}
        updateEngagement={updateEngagement}
      />
      <TipsModal
        isOpen={isTipsModalOpen}
        postId={post.id}
        setOpen={setIsTipsModalOpen}
      />
    </div>
  )
}

export const CommentSection = ({
  postId = "",
  visible = false,
  updateEngagement
}) => {
  const [isLoadingComments, setLoadingComments] = useState(false)
  const [comments, setComments] = useState([])
  const { register, getValues, setValue } = useForm()

  const getComments = useCallback(async () => {
    try {
      setLoadingComments(true)
      const api = wrapApi(CommentApi)

      const response = await api.commentFindCommentsForPost({
        id: postId
      })

      setComments(response.comments)
    } catch (error) {
      console.log(error)
      toast.error(error)
    } finally {
      setLoadingComments(false)
    }
  }, [postId])

  useEffect(() => {
    if (visible) {
      getComments()
    }
  }, [getComments, visible])

  async function postComment() {
    try {
      const content = getValues("comment")
      if (content.length === 0) return

      const api = wrapApi(CommentApi)

      const response = await api.commentCreate({
        createCommentDto: {
          content,
          postId: postId
        }
      })

      setComments((prev) => [...prev, { ...response, createdAt: new Date() }])
      setValue("comment", "")
      setTimeout(updateEngagement, 1000)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  return (
    <div
      className={classNames(
        "mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10",
        !visible && "hidden"
      )}
    >
      {isLoadingComments ? (
        <div className="flex w-full items-center justify-center">
          <span className="h-7 w-7 animate-spin rounded-[50%] border-4 border-t-4 border-gray-400 border-t-white" />
        </div>
      ) : (
        comments.map((comment) => (
          <Comment comment={comment} key={comment.commentId} />
        ))
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          postComment()
        }}
        className="flex w-full flex-row items-center pt-5"
      >
        <FormInput
          className="hide-scroll flex flex-1 resize-none overflow-auto overflow-y-visible rounded-lg bg-black/10 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]"
          type="text-area"
          name="comment"
          placeholder="Type a comment..."
          register={register}
        />
        <Button
          tag="button"
          type="submit"
          variant="pink"
          className="ml-4 h-[40px] w-[10%] min-w-[70px]"
        >
          Post
        </Button>
      </form>
    </div>
  )
}

export const Comment = ({ comment }) => {
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
          {comment?.commenterUsername ?? "Fan"}
        </Text>
        <Text
          fontSize={14}
          className="break-normal break-all text-start font-light"
        >
          {comment?.content}
        </Text>
      </div>
    </div>
  )
}
export const FundraiserMedia = ({ images }) => {
  const mediaGridLayout = (length, index) => {
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
    <div className="relative w-full bg-transparent ">
      <div className="grid h-full grid-cols-12 gap-4">
        {images.length > 0 &&
          images.map((image, index) => (
            <div
              key={`media_${index}`}
              className={mediaGridLayout(images.length, index)}
            >
              <img // eslint-disable-line @next/next/no-img-element
                src={image}
                alt={`media_${index}`}
                className="rounded-[23px] object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export const FundraiserTab = ({ post }) => {
  const [goal] = useState(post?.goal || 100)
  const [amountCollected, setAmountColleted] = useState(
    post?.collectedAmount || 0
  )
  const [numberOfDonations, setNumberOfDonations] = useState(
    post?.numberOfDonations || 0
  )

  const onDonate = (amount) => {
    setNumberOfDonations(numberOfDonations + 1)
    setAmountColleted(amountCollected + amount)
  }

  let progressPercentage = Math.min(
    100,
    Math.floor((amountCollected / goal) * 100)
  )
  return (
    <div className="flex w-full flex-col items-start rounded-md bg-[#1b141d]/80 px-4 py-4 backdrop-blur-[10px]">
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center">
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
        <div className="self-end text-xs tracking-[0.003em]">
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
        {post.donationTypes.map((amount, index) => (
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

export const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-[6px] bg-[#FFFFFF]">
      <div
        style={{ width: `${progressPercentage}%` }}
        className="h-full bg-[#EE53C3] "
      ></div>
    </div>
  )
}
