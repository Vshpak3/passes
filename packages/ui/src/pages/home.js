import CreatorContentFeed from "src/components/pages/profile/main-content/news-feed/creator-content-feed"
import { useFeed } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const profile = {
  profileImageUrl: "https://www.w3schools.com/w3images/avatar2.png",
  fullName: "Test User",
  userId: "testUser",
  passes: []
}
const Home = () => {
  const { posts = [] } = useFeed()

  return (
    <>
      {posts?.length > 0 ? (
        <div className="w-full bg-black">
          <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
            <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
              <CreatorContentFeed
                profile={profile}
                existingPosts={posts[0]?.posts}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[200px] w-full content-center bg-black text-center">
          Follow creators to see posts
        </div>
      )}
    </>
  )
}

export default withPageLayout(Home)
