import BellIcon from "public/icons/profile-bell-icon.svg"
import CalendarIcon from "public/icons/profile-calendar-icon.svg"
import PhotosIcon1 from "public/icons/profile-photos1-icon.svg"
import VideoIcon from "public/icons/profile-video-icon.svg"
import React from "react"
import { CoverButton } from "src/components/common/Buttons"

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
      <div className="flex flex-1 space-x-12">
        <span>About</span>
        <span>Posts</span>
        <span>Fan Wall</span>
        <span>Events</span>
      </div>
      <div className="pl-20">New Pass</div>
    </div>
    <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 px-7 py-5 backdrop-blur-[100px]">
      <textarea
        name="Text1"
        cols="40"
        rows="4"
        className="m-0 w-full resize-none border-transparent bg-transparent p-0 focus:border-transparent focus:ring-0"
        placeholder="What’s on your mind?"
      />
      <div className="flex items-center gap-6">
        <div className="flex items-center">
          <span>
            <PhotosIcon1 className="bg-transparent" />
          </span>
          <span className="pl-2 text-center text-[14px] leading-[17px] text-[#BF7AF0]">
            Photos
          </span>
        </div>
        <div className="flex items-center">
          <span>
            <VideoIcon className="bg-transparent" />
          </span>
          <span className="pl-2 text-center text-[14px] leading-[17px] text-[#BF7AF0]">
            Video
          </span>
        </div>
        <div className="flex items-center">
          <span>
            <CalendarIcon className="bg-transparent" />
          </span>
          <span className="pl-2 text-center text-[14px] leading-[17px] text-[#BF7AF0]">
            Schedule a post
          </span>
        </div>
      </div>
    </div>

    <div className="min-h-12 flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 px-4 pt-3 pb-10 backdrop-blur-[100px] ">
      Main Content
      <p className="p-20"> Main Content</p>
      <p className="p-20"> Main Content</p>
      <p className="p-20"> Main Content</p>
    </div>
  </div>
)

export default MainContent
