import BellIcon from "public/icons/profile-bell-icon.svg"
import React, { useState } from "react"
import { CoverButton } from "src/components/common/Buttons"

import { NewPost } from "./new-post"
import NewsFeedNavigation from "./new-post/navigation"
import { Post } from "./news-feed/post"

const MainContent = ({ profile }) => {
  const [followed, setFollowed] = useState(false)
  return (
    <>
      <div className="flex flex-col justify-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/30 backdrop-blur-[100px] ">
        <div className="relative flex max-h-[134px] items-center justify-center rounded-t-[20px]">
          <img // eslint-disable-line @next/next/no-img-element
            src={profile.profileCoverImageUrl}
            alt={profile.fullName}
            className="h-[134px] w-full rounded-t-[20px] object-cover"
          />
          <div className="absolute text-center text-[36px] font-black leading-[22px] opacity-50">
            {profile.coverTitle}
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col pl-[26px] pr-3 pt-5">
            <span className="text-sm font-normal text-[#ffffff]/30">
              About me
            </span>
            <span className="text-base font-medium">
              {profile.coverDescription}
            </span>
          </div>
          <div className="flex items-start gap-3 p-0 pt-10 pl-5 pb-4">
            <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full border border-[#ffffff]/10 bg-[#1b141d]/10 ">
              <BellIcon />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton name="Chat" onClick={() => null} />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton
                name={followed ? "Unfollow" : "Follow"}
                onClick={() => setFollowed(!followed)}
              />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton name="Tip" onClick={() => null} />
            </span>
          </div>
        </div>
      </div>
      <div className="min-h-12 hidden sm:flex  ">
        <NewsFeedNavigation />
      </div>
      <NewPost passes={profile?.passes} />
      {profile?.posts?.map((post, index) => (
        <Post key={`post_${index}`} profile={profile} post={post} />
      ))}
    </>
  )
}

export default MainContent
