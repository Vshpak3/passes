import CostIcon from "public/icons/post-cost-icon.svg"
import HeartIcon from "public/icons/post-heart-icon.svg"
import MessagesIcon from "public/icons/post-messages-icon.svg"
import PostOptionsIcon from "public/icons/post-options-icon.svg"
import PinnedActive from "public/icons/post-pinned-active.svg"
import PinnedInactive from "public/icons/post-pinned-inactive.svg"
import ShareIcon from "public/icons/post-share-icon.svg"
import VerifiedSmall from "public/icons/profile-verified-small-icon.svg"
import React, { useState } from "react"
import { PostUnlockButton } from "src/components/common/Buttons"
import { classNames } from "src/helpers/classNames"

export const Post = ({ profile }) => {
  const [postUnlocked, setPostUnlocked] = useState(false)
  const [postPinned, setPostPinned] = useState(false)
  return (
    <div className="flex flex-col items-start gap-4 rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-5 pt-8 pb-5 backdrop-blur-[100px]  ">
      <PostProfileAvatar
        profile={profile}
        postPinned={postPinned}
        setPostPinned={setPostPinned}
      />
      <PostTextContent />
      <LockedMedia
        postUnlocked={postUnlocked}
        setPostUnlocked={setPostUnlocked}
      />
      <PostEngagement />
    </div>
  )
}

export const PostProfileAvatar = ({ profile, postPinned, setPostPinned }) => (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-center space-x-4 pl-3">
      <img // eslint-disable-line @next/next/no-img-element
        className="h-12 w-12 rounded-full"
        src={profile.profileImageUrl}
        alt={profile.fullName}
      />
      <div className="space-y-1 font-medium dark:text-white">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] font-medium leading-[22px]">
            {profile.fullName}
          </span>
          <span className="flex items-center">
            <VerifiedSmall />
            <span className="text-[12px] font-medium leading-[15px] text-[#FFFFFF]/50">
              Verified
            </span>
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {profile.userId}
        </div>
      </div>
    </div>
    <div className="-mt-[21px] flex items-center gap-2">
      <div className="leading=[22px] text-[12px] font-medium tracking-[1px] text-[#FFFFFF]/50">
        2 DAYS AGO
      </div>
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
)

export const PostTextContent = () => (
  <div className="flex items-center">
    <p className="pl-[78px] pr-[30px] text-start text-base font-medium">
      I’m so excited to share EXACTLY how I made these TikToks for Insomniac go
      viral. I show how I experimented, the videos, and explain the process for
      making engaged Tiktoks.
    </p>
  </div>
)

export const LockedMedia = ({ postUnlocked, setPostUnlocked }) => (
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
            name="Unlock Post For $32"
          />
          <div className="flex items-center justify-center pt-4">
            <span>UNLOCK 4 videos, 20 photos</span>
          </div>
        </div>
      )}
    </div>
    <img // eslint-disable-line @next/next/no-img-element
      src="/pages/profile/profile-post-photo.png"
      alt=""
      className="w-full rounded-[20px] object-cover shadow-xl"
    />
  </div>
)

export const PostEngagement = () => (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-start gap-[45px] p-0">
      <div className="flex cursor-pointer items-center gap-[5px] p-0">
        <HeartIcon />
        <span className="text-[12px] leading-[15px] text-[#A09FA6]">1.4k</span>
      </div>
      <div className="flex cursor-pointer items-center gap-[5px] p-0">
        <MessagesIcon />
        <span className="text-[12px] leading-[15px] text-[#A09FA6]">338</span>
      </div>
      <div className="flex cursor-pointer items-center gap-[5px] p-0">
        <ShareIcon />
        <span className="text-[12px] leading-[15px] text-[#A09FA6]">220</span>
      </div>
    </div>
    <div className="flex items-center gap-2 pr-2">
      <CostIcon />
      <span className="text-[16px] leading-[25px]">32</span>
    </div>
  </div>
)
