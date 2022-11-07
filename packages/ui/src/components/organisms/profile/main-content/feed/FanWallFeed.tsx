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
import { useUser } from "src/hooks/useUser"
import { FanWallComment } from "./FanWallComment"

const FallWallFeedLoader = (
  <div className="my-[40px] flex justify-center">
    <Loader />
  </div>
)

const FanWallFeedEnd = (
  <div className="my-[40px] flex justify-center">
    <div className="bg-[#12070E]/50 px-10 py-5" role="alert">
      <span className="font-medium">There are no more fan wall comments.</span>
    </div>
  </div>
)

interface FanWallFeedProps {
  profileUserId: string
  ownsProfile: boolean
}

export const FanWallFeed: FC<FanWallFeedProps> = ({
  profileUserId,
  ownsProfile
}) => {
  const { accessToken } = useUser()

  return (
    <InfiniteScrollPagination<FanWallCommentDto, GetFanWallResponseDto>
      KeyedComponent={({ arg }: ComponentArg<FanWallCommentDto>) => {
        return <FanWallComment comment={arg} ownsProfile={ownsProfile} />
      }}
      emptyElement={FanWallFeedEnd}
      endElement={FanWallFeedEnd}
      fetch={async (req: GetFanWallRequestDto) => {
        const api = new FanWallApi()
        return await api.getFanWallForCreator({
          getFanWallRequestDto: req
        })
      }}
      fetchProps={{ creatorId: profileUserId }}
      keyValue={`/fanwall/${profileUserId}`}
      loadingElement={FallWallFeedLoader}
    >
      {!!accessToken.length && (
        <NewFanwallPosts
          ownsProfile={ownsProfile}
          profileUserId={profileUserId}
        />
      )}
    </InfiniteScrollPagination>
  )
}
