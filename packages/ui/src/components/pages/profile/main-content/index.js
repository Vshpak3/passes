import { PostApi } from "@passes/api-client"
import React, { useState } from "react"
import { wrapApi } from "src/helpers/wrapApi"
import { useSWRConfig } from "swr"

import NewsFeedNavigation from "./new-post/navigation"
import NewsFeedContent from "./news-feed/news-feed-content"

const MainContent = ({ profile, ownsProfile, posts, username }) => {
  const [activeTab, setActiveTab] = useState("post")
  const { mutate } = useSWRConfig()
  const createPost = async (values) => {
    const api = wrapApi(PostApi)
    mutate(
      [`/post/creator/`, username],
      async () =>
        await api.postCreate({
          createPostRequestDto: {
            passes: [],
            content: values.content,
            text: values.text,
            _private: true
          }
        }),
      {
        populateCache: (post, previousPosts) => {
          if (!previousPosts)
            return {
              count: 1,
              cursor: username,
              posts: [post]
            }
          else
            return {
              count: previousPosts.count + 1,
              cursor: previousPosts.cursor,
              posts: [post, ...previousPosts.posts]
            }
        },
        // Since the API already gives us the updated information,
        // we don't need to revalidate here.
        revalidate: false
      }
    )
  }

  return (
    <>
      <div className="min-h-12 hidden sm:flex  ">
        <NewsFeedNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <NewsFeedContent
        profile={profile}
        activeTab={activeTab}
        ownsProfile={ownsProfile}
        posts={posts}
        createPost={createPost}
      />
    </>
  )
}

export default MainContent
