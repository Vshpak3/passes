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
import { BlockModal, ReportModal } from "src/components/organisms"
import { useSWRConfig } from "swr"

import { FanWallComment } from "./FanWallComment"

interface FanWallFeedProps {
  creatorId: string
  fanWallPosts: GetFanWallResponseDto
  ownsProfile: boolean
  profileUsername: string
}

const FanWallFeed: FC<FanWallFeedProps> = ({
  fanWallPosts,
  ownsProfile,
  profileUsername
}) => {
  const [comments, setComments] = useState(fanWallPosts.data)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
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
        onClick: () => setUserReportModal(true)
      },
      {
        text: "Block",
        onClick: () => setUserBlockModal(true)
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
      <BlockModal
        isOpen={userBlockModal}
        setOpen={setUserBlockModal}
        userId={""} // TODO: fix
      />
      <ReportModal
        isOpen={userReportModal}
        setOpen={setUserReportModal}
        userId={""} // TODO: fix
      />
      {comments?.length > 0 && (
        <InfiniteScrollPagination<FanWallCommentDto, GetFanWallResponseDto>
          fetch={async (req: GetFanWallRequestDto) => {
            const api = new FanWallApi()
            return await api.getFanWallForCreator({ getFanWallRequestDto: req })
          }}
          loader={<h3>Loading...</h3>} // TODO: add a better message
          endMessage={<h3>No more comments</h3>} // TODO: add a better message
          KeyedComponent={({ arg }: ComponentArg<FanWallCommentDto>) => {
            return (
              <div className="flex py-3">
                <FanWallComment
                  post={
                    {
                      text: arg.text,
                      userId: arg.commenterId,
                      displayName: arg.commenterDisplayName,
                      username: arg.commenterUsername
                    } as PostDto
                  }
                  dropdownItems={getDropdownOptions(arg)}
                />
              </div>
            )
          }}
          initProps={{}}
        />
      )}
    </div>
  )
}

export default FanWallFeed
