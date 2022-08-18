import React from "react"

import { NewPost } from "../new-post"
import CreatorContentFeed from "./creator-content-feed"
import EventsFeed from "./events-feed"
import FanWallFeed from "./fan-wall-feed"
import PassesFeed from "./passes-feed"

const NewsFeedContent = ({
  profile,
  activeTab,
  ownsProfile,
  posts,
  createPost
}) => {
  switch (activeTab) {
    case "post":
      return (
        <>
          {ownsProfile && (
            <NewPost
              passes={profile?.passes}
              createPost={createPost}
              placeholder="What’s on your mind?"
            />
          )}
          {posts?.posts?.length > 0 && (
            <CreatorContentFeed profile={profile} existingPosts={posts.posts} />
          )}
        </>
      )
    case "fanWall":
      return (
        <>
          <NewPost
            passes={profile?.passes}
            placeholder={`Write something to ${profile?.displayName}...`}
          />
          <FanWallFeed />
        </>
      )
    case "events":
      return <EventsFeed />
    case "passes":
      return <PassesFeed />
    default:
      return <></>
  }
}

export default NewsFeedContent
