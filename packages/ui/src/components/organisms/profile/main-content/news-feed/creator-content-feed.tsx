import { GetFeedResponseDto, PostDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { toast } from "react-toastify"
import { Post } from "src/components/organisms/profile/post/Post"
import { KeyedMutator } from "swr"

interface CreatorContentFeedProps {
  posts: PostDto[]
  ownsProfile: boolean
  removePost?: (postId: string) => void
  mutatePosts?: KeyedMutator<GetFeedResponseDto | undefined>
}

const CreatorContentFeed = ({
  posts: existingPosts,
  ownsProfile,
  removePost,
  mutatePosts
}: CreatorContentFeedProps) => {
  // TODO: implement pagination with infinite scroll, and loading state

  const [posts, setPosts] = useState([...existingPosts])
  const [isPayed, setIsPayed] = useState(false)

  useEffect(() => {
    setPosts(existingPosts)
  }, [existingPosts])

  useEffect(() => {
    if (isPayed && mutatePosts) {
      mutatePosts().catch((error) => toast(error))

      return () => setIsPayed(false)
    }
  }, [isPayed, mutatePosts])

  return (
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
          <div key={post.postId} className="flex w-full py-3">
            <Post
              key={`post_${index}`}
              post={post}
              ownsProfile={ownsProfile}
              removePost={removePost}
              setIsPayed={setIsPayed}
            />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default CreatorContentFeed
