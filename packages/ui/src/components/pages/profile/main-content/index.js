import BellIcon from "public/icons/profile-bell-icon.svg"
import React from "react"
import { CoverButton } from "src/components/common/Buttons"

import { NewPost } from "./NewPost"
import { Post } from "./Post"

const MainContent = ({ profile }) => (
  <div className="col-span-12 w-full space-y-6 lg:col-span-8 lg:max-w-[680px]">
    <div className="flex flex-col justify-center rounded-[20px] border border-[#ffffff]/10 backdrop-blur-[100px] ">
      <div
        className={`flex min-h-[134px] items-center justify-center rounded-t-[20px] bg-[url('/pages/profile/profile-cover-photo.png')] bg-cover bg-center bg-no-repeat`}
      >
        <div className="text-center text-[36px] font-black leading-[22px] opacity-50">
          {profile.coverTitle}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-8 py-6">
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-normal text-[#ffffff]/30">
            About me
          </span>
          <span className="text-base font-medium">
            {profile.coverDescription}
          </span>
        </div>
        <div className="flex items-start gap-3 p-0 pt-10">
          <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full border border-[#ffffff]/10 bg-[#1b141d]/10 ">
            <BellIcon />
          </span>
          <span className="flex w-24 items-center justify-center">
            <CoverButton name="Chat" />
          </span>
          <span className="flex w-24 items-center justify-center">
            <CoverButton name="Follow" />
          </span>
          <span className="flex w-24 items-center justify-center">
            <CoverButton name="Tip" />
          </span>
        </div>
      </div>
    </div>
    <div className="min-h-12 flex items-center justify-between rounded-[20px] border border-[#ffffff]/10 px-8 py-6 backdrop-blur-[100px]">
      <div className="flex flex-1 cursor-pointer space-x-12">
        <span>About</span>
        <span>Posts</span>
        <span>Fan Wall</span>
        <span>Events</span>
      </div>
      <div className="pl-20">New Pass</div>
    </div>
    <NewPost />

    <Post />
  </div>
)

export default MainContent
