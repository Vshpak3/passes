import { PostDto } from "@passes/api-client"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { useEffect, useMemo } from "react"
import CreatorContentFeed from "src/components/pages/profile/main-content/news-feed/creator-content-feed"
import { useFeed, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Home = () => {
  const { isLoadingPosts, feed } = useFeed()
  const { mutate } = useUser()

  const collatedFeed = useMemo(() => {
    const ans: PostDto[] = []

    if (!feed) {
      return ans
    }

    for (let i = 0; i < feed?.length; i++) {
      ans.push(...feed[i].posts)
    }

    return ans
  }, [feed])

  useEffect(() => {
    mutate()
  }, [mutate])

  return (
    <>
      {isLoadingPosts && <div className="mx-auto">Loading...</div>}
      {collatedFeed.length > 0 ? (
        <div className="w-full bg-black">
          <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
            <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
              <CreatorContentFeed posts={collatedFeed} ownsProfile={false} />
            </div>
          </div>
        </div>
      ) : (
        <div className="my-4 mx-auto flex flex-row items-center justify-center rounded-sm border border-gray-800 bg-gradient-to-r from-[#3D224A] px-3 py-2 text-center">
          <InfoIcon className="mr-2" />
          Posts of the creators you follow will be shown here.
        </div>
      )}
    </>
  )
}

export default withPageLayout(Home)
