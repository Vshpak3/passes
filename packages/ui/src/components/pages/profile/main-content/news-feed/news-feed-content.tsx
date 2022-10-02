import { NewPost } from "src/components/pages/profile/main-content/new-post"

import CreatorContentFeed from "./creator-content-feed"
import EventsFeed from "./events-feed"
import FanWallFeed from "./fan-wall-feed"
import PassesFeed from "./passes-feed"

const NewsFeedContent = ({
  profile,
  activeTab,
  ownsProfile,
  posts,
  fanWallPosts,
  createPost,
  writeToFanWall
}: any) => {
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
            <CreatorContentFeed
              profile={profile}
              posts={posts}
              ownsProfile={ownsProfile}
            />
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
            createPost={writeToFanWall}
          />
          <FanWallFeed
            fanWallPosts={fanWallPosts}
            ownsProfile={ownsProfile}
            profile={profile}
          />
        </>
      )
    case "events":
      return <EventsFeed />
    case "passes":
      return <PassesFeed profile={profile} />
    default:
      return <></>
  }
}

export default NewsFeedContent
