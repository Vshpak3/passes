import {
  FanWallApi,
  FanWallCommentDto,
  GetFanWallRequestDto,
  GetFanWallResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useState } from "react"
import InfiniteScrollPagination, {
  ComponentArg
} from "src/components/atoms/InfiniteScroll"
import { PostDataContext } from "src/contexts/PostData"
import { useCreatorProfile } from "src/hooks"
import { useBlockModal } from "src/hooks/useBlockModal"
import useFanWall from "src/hooks/useFanWall"
import { useReportModal } from "src/hooks/useReportModal"
import { useSWRConfig } from "swr"

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

const FanWallFeed: FC = () => {
  const { ownsProfile, profile, profileUsername } = useCreatorProfile()
  const { fanWallPosts } = useFanWall(profile?.userId || "")
  const [comments, setComments] = useState(fanWallPosts?.data || [])
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()
  const api = new FanWallApi()
  const { mutate } = useSWRConfig()
  const deleteComment = async (id: any) => {
    const result = await mutate(
      ["/fan-wall/creator", profileUsername],
      api.deleteFanWallComment({ fanWallCommentId: id }),
      {
        populateCache: () => {
          return {
            comments: comments.filter(
              (post: any) => post.fanWallCommentId !== id
            )
          }
        }
      }
    )

    if (result.comments) {
      setComments(result.comments)
    }
  }
  const hideComment = async (id: any) => {
    const result = await mutate(
      ["/fan-wall/creator", profileUsername],
      api.hideFanWallComment({ fanWallCommentId: id }),
      {
        populateCache: () => {
          return {
            comments: comments.filter(
              (post: any) => post.fanWallCommentId !== id
            )
          }
        }
      }
    )

    if (result.comments) {
      setComments(result.comments)
    }
  }
  const getDropdownOptions = (comment: FanWallCommentDto) => {
    return [
      {
        text: "Report",
        onClick: () => setIsReportModalOpen(true)
      },
      {
        text: "Block",
        onClick: () => setIsBlockModalOpen(true)
      },
      ...(comment.commenterUsername === profileUsername
        ? [
            {
              text: "Delete comment",
              onClick: () => deleteComment(comment.fanWallCommentId)
            }
          ]
        : []),
      ...(ownsProfile && comment.commenterUsername !== profileUsername
        ? [
            {
              text: "Hide comment",
              onClick: () => hideComment(comment.fanWallCommentId)
            }
          ]
        : [])
    ]
  }
  return (
    <div>
      {comments?.length > 0 && (
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
                <PostDataContext.Provider
                  value={
                    {
                      text: arg.text,
                      userId: arg.commenterId,
                      displayName: arg.commenterDisplayName,
                      username: arg.commenterUsername
                    } as PostDto
                  }
                >
                  <FanWallComment dropdownOptions={getDropdownOptions(arg)} />
                </PostDataContext.Provider>
              </div>
            )
          }}
        />
      )}
    </div>
  )
}

export default FanWallFeed
