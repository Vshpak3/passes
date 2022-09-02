import React, { useState } from "react"

import { NewPost } from "../new-post"
import CreatorContentFeed from "./creator-content-feed"
import EventsFeed from "./events-feed"
import FanWallFeed from "./fan-wall-feed"
import PassesFeed from "./passes-feed"

const MOCKED_FANWALL_POSTS = [
  {
    profile: {
      fullName: "Fan Limani",
      userId: "@alexfan",
      profileImageUrl:
        "https://images.unsplash.com/photo-1535189005916-e5e47dc88316?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3131&q=80"
    },
    numLikes: 1400,
    numComments: 338,
    sharesCount: 220,
    locked: false,
    price: 32,
    date: "2022-06-21T19:00:00.000Z",
    caption:
      "I’m so excited to share EXACTLY how I made these TikToks for Insomniac go viral. I show how I experimented, the videos, and explain the process for making engaged Tiktoks.",
    imgUrl: "/pages/profile/profile-post-photo.png"
  },
  {
    profile: {
      fullName: "Alex Drachnik Fan",
      userId: "@drach",
      profileImageUrl:
        "https://images.unsplash.com/photo-1654850900859-be34bd2e217c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
    },
    numLikes: 1400,
    numComments: 338,
    sharesCount: 220,
    locked: false,
    price: 32,
    date: "2022-05-23T19:00:00.000Z",
    caption: "Peace",
    imgUrl:
      "https://images.unsplash.com/photo-1555415859-4b0d889d8239?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80"
  }
]

const NewsFeedContent = ({
  profile,
  activeTab,
  ownsProfile,
  posts,
  createPost
}) => {
  const [fanWallPosts, setFanWallPosts] = useState(MOCKED_FANWALL_POSTS)
  const writeToWall = ({ text }) => {
    const newPost = {
      profile: {
        fullName: "Alex Drachnik Fan",
        userId: "@drach",
        profileImageUrl:
          "https://images.unsplash.com/photo-1654850900859-be34bd2e217c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
      },
      numLikes: 0,
      numComments: 0,
      sharesCount: 0,
      locked: false,
      price: 32,
      date: Date.now(),
      caption: text,
      imgUrl:
        "https://images.unsplash.com/photo-1555415859-4b0d889d8239?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80"
    }

    setFanWallPosts((fanWallPosts) => [newPost, ...fanWallPosts])
  }

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
          {posts?.length > 0 && (
            <CreatorContentFeed profile={profile} existingPosts={posts} />
          )}
        </>
      )
    case "fanWall":
      return (
        <>
          <NewPost
            passes={profile?.passes}
            placeholder={`Write something${
              profile?.displayName ? ` to ${profile?.displayName}...` : "..."
            }`}
            onlyText
            createPost={writeToWall}
          />
          <FanWallFeed fanWallposts={fanWallPosts} />
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
