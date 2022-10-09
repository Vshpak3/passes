import { FeedApi, GetFeedResponseDto, PostDto } from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import { toast } from "react-toastify"
import {
  FetchResultProps,
  InfiniteScrollComponent
} from "src/components/atoms/InfiniteScroll"
import { Post } from "src/components/organisms/profile/post/Post"
import { usePayinMethod, useUser } from "src/hooks"
import { KeyedMutator } from "swr"

interface CreatorContentFeedProps {
  creatorId?: string
  feed: GetFeedResponseDto
  ownsProfile: boolean
  removePost?: (postId: string) => void
  mutatePosts?: KeyedMutator<GetFeedResponseDto>
}

const GeneralContentFeed: FC<CreatorContentFeedProps> = ({
  creatorId,
  feed,
  ownsProfile,
  removePost,
  mutatePosts
}) => {
  const { user } = useUser()
  const { defaultPayinMethod, cards } = usePayinMethod()

  const [posts, setPosts] = useState<PostDto[]>([])
  const [isPayed, setIsPayed] = useState(false)

  const api = new FeedApi()

  useEffect(() => {
    setPosts(feed.posts)
  }, [feed])

  useEffect(() => {
    if (isPayed && mutatePosts) {
      mutatePosts().catch((error) => toast(error))

      return () => setIsPayed(false)
    }
  }, [isPayed, mutatePosts])

  const fetchPosts = async (
    lastId?: string,
    createdAt?: Date
  ): Promise<FetchResultProps> => {
    const res = creatorId
      ? await api.getFeedForCreator({
          getProfileFeedRequestDto: { creatorId, lastId, createdAt }
        })
      : await api.getFeed({
          getFeedRequestDto: { lastId, createdAt }
        })
    setPosts([...posts, ...res.posts])
    return {
      lastId: res.lastId,
      createdAt: res.createdAt,
      count: res.count
    }
  }

  return (
    <InfiniteScrollComponent
      initialFetch={{
        lastId: feed.lastId,
        createdAt: feed.createdAt,
        count: feed.count
      }}
      fetch={fetchPosts}
      loader={<h3>Loading...</h3>} // TODO: add a better message
      endMessage={<h3>No more posts</h3>} // TODO: add a better message
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
    </InfiniteScrollComponent>
  )
}

export default GeneralContentFeed
