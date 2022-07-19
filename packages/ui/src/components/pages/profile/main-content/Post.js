import VerifiedSmall from "public/icons/profile-verified-small-icon.svg"
import React, { useState } from "react"
import { PostUnlockButton } from "src/components/common/Buttons"
import { classNames } from "src/helpers/classNames"

export const Post = () => {
  const [postUnlocked, setPostUnlocked] = useState(false)
  return (
    <div className="flex flex-col items-center gap-4 rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-5 pt-8 pb-5 backdrop-blur-[100px]  ">
      <div className="flex w-full justify-between">
        <div className="flex items-center space-x-4 pl-3">
          <img // eslint-disable-line @next/next/no-img-element
            className="h-12 w-12 rounded-full"
            src="/pages/profile/profile-photo-small.png"
            alt=""
          />
          <div className="space-y-1 font-medium dark:text-white">
            <div className="flex items-center gap-[6px]">
              <span className="text-[16px] font-medium leading-[22px]">
                Alex Drachnik
              </span>
              <span className="flex items-center">
                <VerifiedSmall />
                <span className="text-[12px] font-medium leading-[15px] text-[#FFFFFF]/50">
                  Verified
                </span>
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              @drachnik
            </div>
          </div>
        </div>
        <div className="leading=[22px] text-[12px] font-medium tracking-[1px] text-[#FFFFFF]/50">
          2 DAYS AGO
        </div>
      </div>
      <div className="flex items-center">
        <p className="pl-[78px] pr-[30px] text-start text-base font-medium">
          I’m so excited to share EXACTLY how I made these TikToks for Insomniac
          go viral. I show how I experimented, the videos, and explain the
          process for making engaged Tiktoks.
        </p>
      </div>
      <div className="relative w-full bg-transparent ">
        <div
          className={classNames(
            postUnlocked ? "" : "bg-[#1B141D]/50 backdrop-blur-[40px]",
            "absolute flex h-full w-full items-center justify-center rounded-[20px]"
          )}
        >
          {!postUnlocked && (
            <div className="flex-center h-45 flex w-[245px] ">
              <PostUnlockButton
                onClick={() => setPostUnlocked(!postUnlocked)}
                value={postUnlocked}
                icon
                name="Unlock Post For $32"
              />
            </div>
          )}
        </div>

        <img // eslint-disable-line @next/next/no-img-element
          src="/pages/profile/profile-post-photo.png"
          alt=""
          className="w-full rounded-[20px] object-cover shadow-xl"
        />
      </div>
      <div className="flex items-center justify-center">
        <span>UNLOCK 4 VIDEOS</span>
      </div>
    </div>
  )
}
