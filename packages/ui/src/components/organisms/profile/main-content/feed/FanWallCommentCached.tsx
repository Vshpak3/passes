import { FanWallCommentDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { useFanWallComment } from "src/hooks/entities/useFanwallComment"
import { FanWallComment } from "./FanWallComment"

export interface FanwallCommentCachedProps {
  fanWallComment: FanWallCommentDto
  ownsProfile: boolean
}

export const FanWallCommentCached: FC<FanwallCommentCachedProps> = ({
  fanWallComment,
  ...res
}: FanwallCommentCachedProps) => {
  const { fanWallComment: cachedFanWallComment, update } = useFanWallComment(
    fanWallComment.fanWallCommentId
  )
  useEffect(() => {
    if (!cachedFanWallComment) {
      update(fanWallComment)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fanWallComment])

  return (
    <FanWallComment
      fanWallComment={cachedFanWallComment ?? fanWallComment}
      {...res}
      update={update}
    />
  )
}
