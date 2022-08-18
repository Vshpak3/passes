import React, { useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "./post"

const mockPost = {
  profile: {
    fullName: "Fan L",
    userId: "@fanL",
    profileImageUrl:
      "https://images.unsplash.com/photo-1582758420652-97455135fb09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
  },
  likesCount: 1400,
  commentsCount: 338,
  sharesCount: 220,
  locked: false,
  price: 32,
  date: "2022-04-23T19:00:00.000Z",
  caption: "Hello Alex Drachnik",
  imgUrl:
    "https://images.unsplash.com/photo-1582758420652-97455135fb09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
}

const MOCKED_FANWALL_POSTS = [
  {
    profile: {
      fullName: "Fan Limani",
      userId: "@alexfan",
      profileImageUrl:
        "https://images.unsplash.com/photo-1535189005916-e5e47dc88316?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3131&q=80"
    },
    likesCount: 1400,
    commentsCount: 338,
    sharesCount: 220,
    locked: false,
    price: 32,
    date: "2022-06-21T19:00:00.000Z",
    caption:
      "I’m so excited to share EXACTLY how I made these TikToks for Insomniac go viral. I show how I experimented, the videos, and explain the process for making engaged Tiktoks.",
    imgUrl: "/pages/profile/profile-post-photo.png"
  },
  {
    profile: {
      fullName: "Alex Drachnik Fan",
      userId: "@drach",
      profileImageUrl:
        "https://images.unsplash.com/photo-1654850900859-be34bd2e217c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
    },
    likesCount: 1400,
    commentsCount: 338,
    sharesCount: 220,
    locked: false,
    price: 32,
    date: "2022-05-23T19:00:00.000Z",
    caption: "Peace",
    imgUrl:
      "https://images.unsplash.com/photo-1555415859-4b0d889d8239?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80"
  }
]

const FanWallFeed = () => {
  const [posts, setPosts] = useState(MOCKED_FANWALL_POSTS)
  const [hasMore] = useState(true)

  const getMorePost = async () => {
    const newPosts = new Array(10).fill(1).map(() => mockPost)
    setPosts((post) => [...post, ...newPosts])
  }

  return (
    <div className="flex overflow-y-auto md:h-[1150px]">
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePost}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {posts.map((post, index) => (
          <div key={index} className="flex py-3">
            <Post key={`post_${index}`} profile={post?.profile} post={post} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default FanWallFeed
