import {
  CreatePostRequestDto,
  FanWallApi,
  FeedApi,
  GetFanWallResponseDto,
  GetFeedResponseDto,
  GetProfileResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useState } from "react"
import { toast } from "react-toastify"
import { useCreatePost } from "src/hooks"
import usePost from "src/hooks/usePost"
import { KeyedMutator, useSWRConfig } from "swr"

import NewsFeedNavigation from "./new-post/navigation"
import NewsFeedContent from "./news-feed/news-feed-content"

export interface MainContentProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
  posts: PostDto[]
  fanWallPosts?: GetFanWallResponseDto
  setIsDeletedPost?: (value: boolean) => void
  mutatePosts?: KeyedMutator<GetFeedResponseDto | undefined>
}

const MainContent: FC<MainContentProps> = ({
  profile,
  ownsProfile,
  posts,
  fanWallPosts,
  profileUsername,
  setIsDeletedPost,
  mutatePosts
}) => {
  const [activeTab, setActiveTab] = useState("post")
  const { mutate } = useSWRConfig()
  const { createPost } = useCreatePost()
  const { removePost } = usePost()

  const removePostHandler = (postId: string) => {
    removePost(postId)
      .then(() => setIsDeletedPost && setIsDeletedPost(true))
      .catch((error) => toast(error))
  }

  const handleCreatePost = (values: CreatePostRequestDto) => {
    mutate(
      ["/post/creator/", profileUsername],
      async () => createPost(values),
      {
        populateCache: async (post, previousPosts) => {
          const api = new FeedApi()
          const { posts } = await api.getFeedForCreator({
            getProfileFeedRequestDto: { creatorId: profile.userId }
          })

          if (!previousPosts) {
            return {
              count: 1,
              cursor: profileUsername,
              posts
            }
          } else {
            return {
              count: previousPosts.count + 1,
              cursor: previousPosts.cursor,
              posts
            }
          }
        },
        revalidate: true
      }
    )
  }
  const writeToFanWall = async (values: CreatePostRequestDto) => {
    const api = new FanWallApi()

    mutate(
      ["/fan-wall/creator/", profileUsername],
      async () =>
        await api.createFanWallComment({
          createFanWallCommentRequestDto: {
            creatorId: profile.userId,
            text: values.text,
            tags: values.tags
          }
        }),
      {
        populateCache: async () => {
          const api = new FanWallApi()
          const { comments } = await api.getFanWallForCreator({
            getFanWallRequestDto: { creatorId: profile.userId }
          })
          return {
            comments: comments
          }
        },
        revalidate: true
      }
    )
  }

  return (
    <>
      <div className="flex md:min-h-12">
        <NewsFeedNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <NewsFeedContent
        profile={profile}
        profileUsername={profileUsername}
        activeTab={activeTab}
        ownsProfile={ownsProfile}
        posts={posts}
        fanWallPosts={fanWallPosts}
        createPost={handleCreatePost}
        removePost={removePostHandler}
        mutatePosts={mutatePosts}
        writeToFanWall={writeToFanWall}
      />
    </>
  )
}

export default MainContent
