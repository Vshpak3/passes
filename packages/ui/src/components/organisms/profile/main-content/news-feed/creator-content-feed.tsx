import { PostDto } from "@passes/api-client"
import { Fragment, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "./post"

interface CreatorContentFeedProps {
  posts: PostDto[]
  ownsProfile: boolean
  removePost?: (postId: string) => void
}

const CreatorContentFeed = ({
  posts: existingPosts,
  ownsProfile,
  removePost
}: CreatorContentFeedProps) => {
  // TODO: implement pagination with infinite scroll, and loading state
  const [posts] = useState([...existingPosts])

  return (
    <Fragment>
      <div className="w-full">
        <InfiniteScroll
          dataLength={posts.length}
          className="w-full"
          style={{ width: "100%" }}
          next={function () {
            throw new Error("Function not implemented.")
          }}
          hasMore={false}
          loader={undefined}
        >
          {posts.map((post, index) => (
            <div key={index} className="flex w-full py-3">
              <Post
                key={`post_${index}`}
                post={post}
                ownsProfile={ownsProfile}
                removePost={removePost}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </Fragment>
  )
}

export default CreatorContentFeed
