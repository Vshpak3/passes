import {
  FanWallApi,
  FanWallCommentDto,
  GetFanWallRequestDto,
  GetFanWallResponseDto
} from "@passes/api-client"
import { FC } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Loader } from "src/components/atoms/Loader"
import { NewFanwallPosts } from "src/components/organisms/profile/main-content/new-post/NewFanwallPosts"

import { FanWallComment } from "./FanWallComment"

const FallWallFeedLoader = (
  <div className="my-[40px] flex justify-center">
    <Loader />
  </div>
)

const FanWallFeedEnd = (
  <div className="my-[40px] flex justify-center">
    <div className="bg-[#1b141d]/50 px-10 py-5" role="alert">
      <span className="font-medium">There are no more fan wall comments.</span>
    </div>
  </div>
)

export interface FanWallFeedProps {
  profileUserId: string
}

export const FanWallFeed: FC<FanWallFeedProps> = ({ profileUserId }) => {
  return (
    <InfiniteScrollPagination<FanWallCommentDto, GetFanWallResponseDto>
      keyValue={`/fanwall/${profileUserId}`}
      fetch={async (req: GetFanWallRequestDto) => {
        const api = new FanWallApi()
        return await api.getFanWallForCreator({
          getFanWallRequestDto: req
        })
      }}
      fetchProps={{ creatorId: profileUserId }}
      loadingElement={FallWallFeedLoader}
      endElement={FanWallFeedEnd}
      KeyedComponent={({ arg }: ComponentArg<FanWallCommentDto>) => {
        return (
          <div className="mt-6 flex">
            <FanWallComment comment={arg} />
          </div>
        )
      }}
    >
      <NewFanwallPosts profileUserId={profileUserId} />
    </InfiniteScrollPagination>
  )
}
