import BellIcon from "public/icons/profile-bell-icon.svg"
import React, { useState } from "react"
import { CoverButton } from "src/components/atoms"

import { NewPost } from "./new-post"
import NewsFeedNavigation from "./new-post/navigation"
import CreatorContentFeed from "./news-feed/creator-content-feed"

const MainContent = ({ profile }) => {
  const [followed, setFollowed] = useState(false)
  return (
    <>
      <div className="hidden justify-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/30 backdrop-blur-[100px] md:flex md:flex-col ">
        <div className="relative flex max-h-[134px] items-center justify-center rounded-t-[20px]">
          <img // eslint-disable-line @next/next/no-img-element
            src={profile.profileCoverImageUrl}
            alt={profile.displayName}
            className="h-[134px] w-full rounded-t-[20px] object-cover"
          />
          <div className="absolute text-center text-4xl font-black  opacity-50">
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
              <CoverButton name="Chat" />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton
                name={followed ? "Unfollow" : "Follow"}
                onClick={() => setFollowed(!followed)}
              />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton name="Tip" />
            </span>
          </div>
        </div>
      </div>
      <div className="min-h-12 hidden sm:flex  ">
        <NewsFeedNavigation />
      </div>
      <NewPost passes={profile?.passes} />
      {profile?.posts && (
        <CreatorContentFeed profile={profile} existingPosts={profile.posts} />
      )}
    </>
  )
}

export default MainContent
