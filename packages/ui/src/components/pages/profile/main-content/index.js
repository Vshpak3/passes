import { FanWallApi, FeedApi } from "@passes/api-client"
import React, { useState } from "react"
import { useCreatePost } from "src/hooks"
import { useSWRConfig } from "swr"

import NewsFeedNavigation from "./new-post/navigation"
import NewsFeedContent from "./news-feed/news-feed-content"

const MainContent = ({
  profile,
  ownsProfile,
  posts,
  fanWallPosts,
  username
}) => {
  const [activeTab, setActiveTab] = useState("post")
  const { mutate } = useSWRConfig()
  const { createPost } = useCreatePost()

  const handleCreatePost = (values) => {
    mutate(["/post/creator/", username], async () => createPost(values), {
      populateCache: async (post, previousPosts) => {
        const api = new FeedApi()
        const { posts } = await api.getFeedForCreator({
          getProfileFeedRequestDto: { creatorId: profile.userId }
        })

        if (!previousPosts)
          return {
            count: 1,
            cursor: username,
            posts
          }
        else
          return {
            count: previousPosts.count + 1,
            cursor: previousPosts.cursor,
            posts
          }
      },
      revalidate: true
    })
  }
  const writeToFanWall = async (values) => {
    const api = new FanWallApi()

    mutate(
      ["/fan-wall/creator/", username],
      async () =>
        await api.createFanWallComment({
          createFanWallCommentRequestDto: {
            creatorId: profile.userId,
            text: values.text,
            tags: values.mentions
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
        activeTab={activeTab}
        ownsProfile={ownsProfile}
        posts={posts}
        fanWallPosts={fanWallPosts}
        createPost={handleCreatePost}
        writeToFanWall={writeToFanWall}
      />
    </>
  )
}

export default MainContent
