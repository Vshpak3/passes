import { FeedApi } from "@passes/api-client"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { FC } from "react"
import useSWR from "swr"

import GeneralContentFeed from "./profile/main-content/feed/GeneralContentFeed"

const HomeContentFeed: FC = () => {
  const { data, isValidating } = useSWR(["/home"], async () => {
    const api = new FeedApi()
    return await api.getFeed({ getFeedRequestDto: {} })
  })

  return (
    <>
      {!isValidating && data?.posts.length ? (
        <div className="w-full bg-black">
          <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
            <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
              <GeneralContentFeed feed={data} ownsProfile={false} />
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

export default HomeContentFeed
