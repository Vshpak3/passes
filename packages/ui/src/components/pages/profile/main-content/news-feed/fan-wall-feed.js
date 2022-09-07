import { FanWallApi } from "@passes/api-client"
import React, { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { wrapApi } from "src/helpers/wrapApi"
import { useSWRConfig } from "swr"

import { Comment } from "./comment"

const FanWallFeed = ({ fanWallPosts, ownsProfile, profile }) => {
  const [posts, setPosts] = useState(fanWallPosts.comments)
  const api = wrapApi(FanWallApi)
  const { mutate } = useSWRConfig()

  const deleteComment = async (id) => {
    const result = await mutate(
      ["/fan-wall/creator", profile.username],
      api.deleteFanWallComment({ id }),
      {
        populateCache: () => {
          return {
            comments: posts.filter((post) => post.fanWallCommentId !== id)
          }
        }
      }
    )

    if (result.comments) {
      setPosts(result.comments)
    }
  }
  const hideComment = async (id) => {
    const result = await mutate(
      ["/fan-wall/creator", profile.username],
      api.hideFanWallComment({ id }),
      {
        populateCache: () => {
          return {
            comments: posts.filter((post) => post.fanWallCommentId !== id)
          }
        }
      }
    )

    if (result.comments) {
      setPosts(result.comments)
    }
  }
  const getDropdownOptions = (post) => {
    return [
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
    <div className="overflow-y-auto md:h-[1150px]">
      {posts?.length > 0 && (
        <InfiniteScroll dataLength={posts.length} loader={<h3> Loading...</h3>}>
          {posts.map((post, index) => (
            <div key={index} className="flex py-3">
              <Comment
                key={`post_${index}`}
                profile={{
                  userId: post.commenterUsername,
                  profileImageUrl: "",
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
