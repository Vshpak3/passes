import {
  CreatePostRequestDto,
  FanWallApi,
  FeedApi,
  GetFanWallResponseDto,
  GetFeedResponseDto,
  GetProfileResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useCreatePost } from "src/hooks"
import usePost from "src/hooks/usePost"
import { KeyedMutator, useSWRConfig } from "swr"

import ProfileContentFeed from "./feed/ProfileContentFeed"
import ProfileNavigation from "./ProfileNavigation"

export interface MainContentProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
  posts: PostDto[]
  fanWallPosts?: GetFanWallResponseDto
  mutatePosts: KeyedMutator<GetFeedResponseDto | undefined>
}

const ProfileContent: FC<MainContentProps> = ({
  profile,
  ownsProfile,
  posts,
  fanWallPosts,
  profileUsername,
  mutatePosts
}) => {
  const [activeTab, setActiveTab] = useState("post")
  const { mutate } = useSWRConfig()
  const { createPost } = useCreatePost()
  const { removePost } = usePost()
  const [isDeletedPost, setIsDeletedPost] = useState(false)

  useEffect(() => {
    if (isDeletedPost) {
      mutatePosts()
      return setIsDeletedPost(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletedPost])

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
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed
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

export default ProfileContent
