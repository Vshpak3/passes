import { FanWallApi } from "@passes/api-client"
import React, { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { BlockModal, ReportModal } from "src/components/organisms"
import { useSWRConfig } from "swr"

import { Comment } from "./comment"

const FanWallFeed = ({ fanWallPosts, ownsProfile, profile }: any) => {
  const [posts, setPosts] = useState(fanWallPosts.comments)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
  const api = new FanWallApi()
  const { mutate } = useSWRConfig()

  const deleteComment = async (id: any) => {
    const result = await mutate(
      ["/fan-wall/creator", profile.username],
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
      ["/fan-wall/creator", profile.username],
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
  const getDropdownOptions = (post: any) => {
    return [
      {
        text: "Report",
        onClick: () => setUserReportModal(true)
      },
      {
        text: "Block",
        onClick: () => setUserBlockModal(true)
      },
      ...(post.commenterId === profile.userId
        ? [
            {
              text: "Delete comment",
              onClick: () => deleteComment(post.fanWallCommentId)
            }
          ]
        : []),
      ...(ownsProfile && post.commenterId !== profile.userId
        ? [
            {
              text: "Hide comment",
              onClick: () => hideComment(post.fanWallCommentId)
            }
          ]
        : [])
    ]
  }

  useEffect(() => {
    if (fanWallPosts.comments) {
      setPosts(fanWallPosts.comments)
    }
  }, [fanWallPosts])

  return (
    <div>
      <BlockModal
        isOpen={userBlockModal}
        setOpen={setUserBlockModal}
        userId={profile.userId}
      />
      <ReportModal
        isOpen={userReportModal}
        setOpen={setUserReportModal}
        userId={profile.userId}
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
          {posts.map((post: any, index: any) => (
            <div key={index} className="flex py-3">
              <Comment
                key={`post_${index}`}
                profile={{
                  userId: post.userId,
                  fullName: post.commenterDisplayName
                }}
                post={post}
                dropdownItems={getDropdownOptions(post)}
              />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  )
}

export default FanWallFeed
