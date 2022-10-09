import {
  FanWallApi,
  FanWallCommentDto,
  GetFanWallResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import {
  FetchResultProps,
  InfiniteScrollComponent
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
  creatorId,
  fanWallPosts,
  ownsProfile,
  profileUsername
}) => {
  const [comments, setComments] = useState(fanWallPosts.comments)
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

  useEffect(() => {
    if (fanWallPosts?.comments) {
      setComments(fanWallPosts.comments)
    }
  }, [fanWallPosts])

  const fetchPosts = async (
    lastId?: string,
    createdAt?: Date
  ): Promise<FetchResultProps> => {
    const res = await api.getFanWallForCreator({
      getFanWallRequestDto: { creatorId, lastId, createdAt }
    })
    setComments([...comments, ...res.comments])
    return {
      lastId: res.lastId,
      createdAt: res.createdAt,
      count: res.comments.length
    }
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
        <InfiniteScrollComponent
          initialFetch={{
            lastId: fanWallPosts.lastId,
            createdAt: fanWallPosts.createdAt,
            count: fanWallPosts.comments.length
          }}
          fetch={fetchPosts}
          loader={<h3>Loading...</h3>} // TODO: add a better message
          endMessage={<h3>No more comments</h3>} // TODO: add a better message
        >
          {comments.map((comment, index) => (
            <div key={index} className="flex py-3">
              <FanWallComment
                key={`post_${index}`}
                post={
                  {
                    text: comment.text,
                    userId: comment.commenterId,
                    displayName: comment.commenterDisplayName,
                    username: comment.commenterUsername
                  } as PostDto
                }
                dropdownItems={getDropdownOptions(comment)}
              />
            </div>
          ))}
        </InfiniteScrollComponent>
      )}
    </div>
  )
}

export default FanWallFeed
