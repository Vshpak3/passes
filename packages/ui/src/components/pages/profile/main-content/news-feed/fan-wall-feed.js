import React, { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "./post"

const mockPost = {
  profile: {
    fullName: "Fan L",
    userId: "@fanL",
    profileImageUrl:
      "https://images.unsplash.com/photo-1582758420652-97455135fb09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
  },
  numLikes: 1400,
  numComments: 338,
  sharesCount: 220,
  locked: false,
  price: 32,
  date: "2022-04-23T19:00:00.000Z",
  caption: "Hello Alex Drachnik",
  imgUrl:
    "https://images.unsplash.com/photo-1582758420652-97455135fb09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
}

const FanWallFeed = ({ fanWallposts }) => {
  const [posts, setPosts] = useState(fanWallposts)
  const [hasMore] = useState(true)

  const getMorePost = async () => {
    const newPosts = new Array(10).fill(1).map(() => mockPost)
    setPosts((post) => [...post, ...newPosts])
  }

  useEffect(() => {
    setPosts(fanWallposts)
  }, [fanWallposts])

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
