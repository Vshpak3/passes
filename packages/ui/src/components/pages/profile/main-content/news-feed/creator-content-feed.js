import React, { Fragment, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "./post"

const CreatorContentFeed = ({ existingPosts, ownsProfile }) => {
  // TODO: implement pagination with infinite scroll, and loading state
  const [posts] = useState([...existingPosts])

  return (
    <Fragment>
      <div className="w-full">
        <InfiniteScroll
          dataLength={posts.length}
          className="w-full"
          style={{ width: "100%" }}
        >
          {posts.map((post, index) => (
            <div key={index} className="flex w-full py-3">
              <Post
                key={`post_${index}`}
                profile={{
                  username: post.username,
                  profileImageUrl: "",
                  fullName: post.displayName
                }}
                post={post}
                ownsProfile={ownsProfile}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </Fragment>
  )
}

export default CreatorContentFeed
