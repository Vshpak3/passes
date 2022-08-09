import React, { useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "./post"

const mockPost = {
  likesCount: 1400,
  commentsCount: 338,
  sharesCount: 220,
  locked: true,
  price: 32,
  date: "2022-07-23T19:00:00.000Z",
  caption:
    "I’m so excited to share EXACTLY how I made these TikToks for Insomniac go viral. I show how I experimented, the videos, and explain the process for making engaged Tiktoks.",
  imgUrl: "/pages/profile/profile-post-photo.png"
}

const CreatorContentFeed = ({ profile, existingPosts }) => {
  const [posts, setPosts] = useState([...existingPosts])
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
            <Post key={`post_${index}`} profile={profile} post={post} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default CreatorContentFeed
