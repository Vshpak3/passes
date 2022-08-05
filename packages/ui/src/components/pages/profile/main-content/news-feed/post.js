import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import FundraiserCoinIcon from "public/icons/post-fundraiser-coin-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import PostOptionsIcon from "public/icons/post-options-icon.svg"
import PinnedActive from "public/icons/post-pinned-active.svg"
import PinnedInactive from "public/icons/post-pinned-inactive.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import VerifiedSmall from "public/icons/post-verified-small-icon.svg"
import React, { useState } from "react"
import { PostUnlockButton } from "src/components/atoms"
import { FormContainer } from "src/components/organisms"
import { classNames, compactNumberFormatter, formatCurrency } from "src/helpers"
export const Post = ({ profile, post }) => {
  const [postUnlocked, setPostUnlocked] = useState(!post.locked)
  const [postPinned, setPostPinned] = useState(false)
  return (
    //this is the rounded container
    <FormContainer>
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
      <PostEngagement post={post} />
      {post.fundraiser && <FundraiserTab post={post} />}
    </FormContainer>
  )
}

export const PostProfileAvatar = ({ profile, postPinned, setPostPinned }) => (
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
        <div
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
        </div>
        <div>
          <PostOptionsIcon className="cursor-pointer stroke-[#868487] hover:stroke-white" />
        </div>
      </div>
    </div>
  </div>
)

export const PostTextContent = ({ post }) => (
  <div className="flex flex-col items-start">
    <p className="text-start text-base font-medium md:pl-[78px] md:pr-[30px]">
      {post.caption}
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

export const LockedMedia = ({ postUnlocked, setPostUnlocked, post }) => (
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
            onClick={() => setPostUnlocked(!postUnlocked)}
            value={postUnlocked}
            icon
            name={`Unlock Post For ${formatCurrency(post.price)}`}
          />
          <div className="flex items-center justify-center pt-4">
            <span>UNLOCK 4 videos, 20 photos</span>
          </div>
        </div>
      )}
    </div>
    <img // eslint-disable-line @next/next/no-img-element
      src={post.imgUrl}
      alt=""
      className="w-full rounded-[20px] object-cover shadow-xl"
    />
  </div>
)

export const PostEngagement = ({ post }) => (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-start gap-[45px] p-0">
      <div className="flex cursor-pointer items-center gap-[5px] p-0">
        <HeartIcon />
        <span className="text-[12px] leading-[15px] text-[#A09FA6]">
          {compactNumberFormatter(post.likesCount)}
        </span>
      </div>
      <div className="flex cursor-pointer items-center gap-[5px] p-0">
        <MessagesIcon />
        <span className="text-[12px] leading-[15px] text-[#A09FA6]">
          {compactNumberFormatter(post.commentsCount)}
        </span>
      </div>
      <div className="flex cursor-pointer items-center gap-[5px] p-0">
        <ShareIcon />
        <span className="text-[12px] leading-[15px] text-[#A09FA6]">
          {compactNumberFormatter(post.sharesCount)}
        </span>
      </div>
    </div>
    {post.price > 0 && (
      <div className="flex items-center gap-2 pr-2">
        <CostIcon />
        <span className="text-[16px] leading-[25px]">{post.price}</span>
      </div>
    )}
  </div>
)

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
            className="flex items-start gap-[10px] rounded-[56px] bg-[#0E0A0F] py-[10px] px-[18px] text-base font-bold leading-[25px] text-[#ffff]/90 hover:bg-[#bf7af0]/10"
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
