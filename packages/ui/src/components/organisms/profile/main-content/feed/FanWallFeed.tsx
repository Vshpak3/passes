import {
  FanWallApi,
  FanWallCommentDto,
  GetFanWallRequestDto,
  GetFanWallResponseDto
} from "@passes/api-client"
import { FC } from "react"
import InfiniteScrollPagination, {
  ComponentArg
} from "src/components/atoms/InfiniteScroll"

import { FanWallComment } from "./FanWallComment"

const ContentFeedEmpty = (
  <h3>No fan wall comments</h3> // TODO: add a better message
)

const ContentFeedLoading = (
  <h3>Loading...</h3> // TODO: add a better message
)

const ContentFeedEnd = (
  <h3>No more posts</h3> // TODO: add a better message
)

interface FanWallFeedProps {
  ownsProfile: boolean
}

const FanWallFeed: FC<FanWallFeedProps> = ({ ownsProfile }) => {
  return (
    <div>
      <InfiniteScrollPagination<FanWallCommentDto, GetFanWallResponseDto>
        fetch={async (req: GetFanWallRequestDto) => {
          const api = new FanWallApi()
          return await api.getFanWallForCreator({ getFanWallRequestDto: req })
        }}
        fetchProps={{}}
        emptyElement={ContentFeedEmpty}
        loadingElement={ContentFeedLoading}
        endElement={ContentFeedEnd}
        KeyedComponent={({ arg }: ComponentArg<FanWallCommentDto>) => {
          return (
            <div className="flex py-3">
              <FanWallComment
                comment={arg}
                removable={true}
                ownsProfile={ownsProfile}
              />
            </div>
          )
        }}
      />
    </div>
  )
}

export default FanWallFeed
