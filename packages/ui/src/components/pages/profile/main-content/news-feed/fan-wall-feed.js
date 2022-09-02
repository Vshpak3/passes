import React, { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Comment } from "./comment"

const FanWallFeed = ({ fanWallPosts }) => {
  const [posts, setPosts] = useState(fanWallPosts.comments)

  useEffect(() => {
    if (fanWallPosts.comments) {
      setPosts(fanWallPosts.comments)
    }
  }, [fanWallPosts])

  return (
    <ul className="overflow-y-auto md:h-[1150px]">
      {posts?.length > 0 && (
        <InfiniteScroll dataLength={posts.length} loader={<h3> Loading...</h3>}>
          {posts.map((post, index) => (
            <div key={index} className="flex py-3">
              <Comment
                key={`post_${index}`}
                profile={{
                  userId: post.commenterUsername,
                  profileImageUrl: "",
                  fullName: post.commenterDisplayName
                }}
                post={post}
              />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </ul>
  )
}

export default FanWallFeed
