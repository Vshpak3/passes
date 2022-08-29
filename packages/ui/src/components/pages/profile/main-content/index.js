import { PostApi } from "@passes/api-client"
import BellIcon from "public/icons/profile-bell-icon.svg"
import React, { useState } from "react"
import { CoverButton } from "src/components/atoms"
import { wrapApi } from "src/helpers/wrapApi"
import { useSWRConfig } from "swr"

import NewsFeedNavigation from "./new-post/navigation"
import NewsFeedContent from "./news-feed/news-feed-content"

const MainContent = ({ profile, ownsProfile, posts, username }) => {
  const [followed, setFollowed] = useState(false)
  const [activeTab, setActiveTab] = useState("post")

  const { mutate } = useSWRConfig()
  const createPost = async (values) => {
    const api = wrapApi(PostApi)
    mutate(
      [`/post/creator/`, username],
      async () =>
        await api.postCreate({
          createPostDto: {
            passes: [],
            content: values.content,
            text: values.text,
            _private: true
          }
        }),
      {
        populateCache: (post, previousPosts) => {
          return {
            count: previousPosts.count + 1,
            cursor: previousPosts.cursor,
            posts: [post, ...previousPosts.posts]
          }
        },
        // Since the API already gives us the updated information,
        // we don't need to revalidate here.
        revalidate: false
      }
    )
  }

  return (
    <>
      <div className="hidden w-full justify-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/30 backdrop-blur-[100px] md:flex md:flex-col ">
        <div className="relative flex max-h-[134px] items-center justify-center rounded-t-[20px]">
          <img // eslint-disable-line @next/next/no-img-element
            src={profile.profileCoverImageUrl}
            alt={profile.displayName}
            className="h-[134px] w-full rounded-t-[20px] object-cover"
          />
          <div className="absolute text-center text-4xl text-[#ffffff]/60 opacity-50">
            {profile.coverTitle}
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col pl-[26px] pr-3 pt-5">
            <span className="text-sm font-normal text-[#ffffff]/40">
              About me
            </span>
            <span className="mt-2 text-base font-medium text-[#ffffff]/60">
              {profile.coverDescription}
            </span>
          </div>
          <div className="flex items-start gap-3 p-0 pt-10 pl-5 pb-4">
            <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full border border-[#ffffff]/10 bg-[#1b141d]/10 ">
              <BellIcon />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton
                name={followed ? "Unfollow" : "Follow"}
                onClick={() => setFollowed(!followed)}
              />
            </span>
            <span className="flex w-24 items-center justify-center">
              <CoverButton name="Chat" />
            </span>
          </div>
        </div>
      </div>
      <div className="min-h-12 hidden sm:flex  ">
        <NewsFeedNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <NewsFeedContent
        profile={profile}
        activeTab={activeTab}
        ownsProfile={ownsProfile}
        posts={posts}
        createPost={createPost}
      />
    </>
  )
}

export default MainContent
