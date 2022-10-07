import { GetFeedResponseDto, PostDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { toast } from "react-toastify"
import { Post } from "src/components/organisms/profile/post/Post"
import { usePayinMethod, useUser } from "src/hooks"
import { KeyedMutator } from "swr"

interface CreatorContentFeedProps {
  posts: PostDto[]
  ownsProfile: boolean
  removePost?: (postId: string) => void
  mutatePosts?: KeyedMutator<GetFeedResponseDto | undefined>
}

// TODO: implement pagination with infinite scroll, and loading state
const GeneralContentFeed = ({
  posts: existingPosts,
  ownsProfile,
  removePost,
  mutatePosts
}: CreatorContentFeedProps) => {
  const { user } = useUser()
  const { defaultPayinMethod, cards } = usePayinMethod()

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
              cards={cards}
              defaultPayinMethod={defaultPayinMethod}
              ownsProfile={ownsProfile}
              post={post}
              removePost={removePost}
              setIsPayed={setIsPayed}
              userId={user?.id}
            />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default GeneralContentFeed
