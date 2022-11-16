import {
  FanWallApi,
  FanWallCommentDto,
  GetFanWallRequestDto,
  GetFanWallResponseDto
} from "@passes/api-client"
import { FC, useMemo } from "react"

import { FeedEnd } from "src/components/atoms/feed/FeedEnd"
import { FeedLoader } from "src/components/atoms/feed/FeedLoader"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { NewFanwallPosts } from "src/components/organisms/profile/main-content/new-post/NewFanwallPosts"
import { useUser } from "src/hooks/useUser"
import { FanWallCommentCached } from "./FanWallCommentCached"

interface FanWallFeedProps {
  profileUserId: string
  ownsProfile: boolean
}

export const FanWallFeed: FC<FanWallFeedProps> = ({
  profileUserId,
  ownsProfile
}) => {
  const { accessToken } = useUser()
  const fetchProps = useMemo(() => {
    return { creatorId: profileUserId }
  }, [profileUserId])
  return (
    <InfiniteScrollPagination<FanWallCommentDto, GetFanWallResponseDto>
      KeyedComponent={({ arg }: ComponentArg<FanWallCommentDto>) => {
        return (
          <FanWallCommentCached
            fanWallComment={arg}
            ownsProfile={ownsProfile}
          />
        )
      }}
      emptyElement={<FeedEnd message="There are no fan wall comments yet" />}
      endElement={<FeedEnd message="There are no more fan wall comments" />}
      fetch={async (req: GetFanWallRequestDto) => {
        const api = new FanWallApi()
        return await api.getFanWallForCreator({
          getFanWallRequestDto: req
        })
      }}
      fetchProps={fetchProps}
      keySelector="fanWallCommentId"
      keyValue={`/pages/fanwall/${profileUserId}`}
      loadingElement={FeedLoader}
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
