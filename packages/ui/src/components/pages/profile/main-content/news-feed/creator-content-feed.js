import React, { Fragment, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "./post"

const mockPost = {
  numLikes: 1400,
  numComments: 338,
  sharesCount: 220,
  locked: true,
  price: 32,
  date: "2022-09-01T11:52:25.712Z",
  caption:
    "I’m so excited to share EXACTLY how I made these TikToks for Insomniac go viral. I show how I experimented, the videos, and explain the process for making engaged Tiktoks.",
  content: [
    { url: "/pages/profile/profile-post-photo.png", type: "image/jpeg" }
  ]
}

const CreatorContentFeed = ({ profile, existingPosts }) => {
  const [posts, setPosts] = useState([...existingPosts])
  const [hasMore] = useState(true)

  const getMorePost = async () => {
    const newPosts = new Array(10).fill(1).map(() => mockPost)
    setPosts((post) => [...post, ...newPosts])
  }

  return (
    <Fragment>
      {/*  Overwrites style library's outer div unaccessible component */}
      <style>
        {`
          .infinite-scroll-component__outerdiv {
            width: 100%;
          }
        `}
      </style>

      <div className="flex w-full overflow-y-auto md:h-[1150px]">
        <InfiniteScroll
          dataLength={posts.length}
          next={getMorePost}
          hasMore={hasMore}
          loader={<h3> Loading...</h3>}
          endMessage={<h4>Nothing more to show</h4>}
          className="w-full"
          style={{ width: "100%" }}
        >
          {posts.map((post, index) => (
            <div key={index} className="flex w-full py-3">
              <Post key={`post_${index}`} profile={profile} post={post} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </Fragment>
  )
}

export default CreatorContentFeed
