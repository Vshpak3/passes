import {
  FanWallApi,
  FanWallCommentDto,
  GetFanWallResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { BlockModal, ReportModal } from "src/components/organisms"
import { useSWRConfig } from "swr"

import { Comment } from "./comment"

interface FanWallFeedProps {
  fanWallPosts?: GetFanWallResponseDto
  ownsProfile: boolean
  profileUsername: string
}

const FanWallFeed: FC<FanWallFeedProps> = ({
  fanWallPosts,
  ownsProfile,
  profileUsername
}) => {
  const [posts, setPosts] = useState(fanWallPosts?.comments ?? [])
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
            comments: posts.filter((post: any) => post.fanWallCommentId !== id)
          }
        }
      }
    )

    if (result.comments) {
      setPosts(result.comments)
    }
  }
  const hideComment = async (id: any) => {
    const result = await mutate(
      ["/fan-wall/creator", profileUsername],
      api.hideFanWallComment({ fanWallCommentId: id }),
      {
        populateCache: () => {
          return {
            comments: posts.filter((post: any) => post.fanWallCommentId !== id)
          }
        }
      }
    )

    if (result.comments) {
      setPosts(result.comments)
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
      setPosts(fanWallPosts.comments)
    }
  }, [fanWallPosts])

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
      {posts?.length > 0 && (
        <InfiniteScroll
          dataLength={posts.length}
          loader={<h3> Loading...</h3>}
          next={function () {
            throw new Error("Function not implemented.")
          }}
          hasMore={false}
        >
          {posts.map((comment: FanWallCommentDto, index: number) => (
            <div key={index} className="flex py-3">
              <Comment
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
        </InfiniteScroll>
      )}
    </div>
  )
}

export default FanWallFeed
