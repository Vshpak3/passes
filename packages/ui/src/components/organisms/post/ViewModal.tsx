import { CommentApi, PostDto } from "@passes/api-client"
import cn from "classnames"
import Image from "next/image"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import HeartIcon from "public/icons/heart-gray.svg"
import MenuIcon from "public/icons/menu.svg"
import MessageIcon from "public/icons/message-dots-square.svg"
import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import LockIcon from "public/icons/profile-unlock-lock-icon.svg"
import ShareIcon from "public/icons/share-outline.svg"
import SharePinkIcon from "public/icons/share-outline-pink.svg"
import React from "react"
import TimeAgo from "react-timeago"
import { Button } from "src/components/atoms"
import PostStaticsButton from "src/components/molecules/post/PostStaticsButton"
import { Dialog } from "src/components/organisms"
import useSWR from "swr"

interface IViewProps {
  isOpen: boolean
  onClose: () => void
  view?: "fan" | "creator"
  post: PostDto
}

const ViewModal: React.FC<IViewProps> = ({
  isOpen,
  onClose,
  post,
  view = "fan"
}) => {
  const api = new CommentApi()
  const { data } = useSWR(["/comments", post.postId], () =>
    api.findCommentsForPost({
      getCommentsForPostRequestDto: {
        postId: post.postId
      }
    })
  )
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="relative flex min-h-[85vh] w-[90vw] max-w-[1285px] rounded-[20px] border border-white/[0.15] bg-[#1B141D]/40 p-6 pl-5 backdrop-blur-[50px]">
        {view === "fan" && (
          <div className="absolute top-[67px] left-[113px] h-[690px] w-[826px] [filter:blur(15px)]">
            <Image
              src="/pages/profile/post.png"
              layout="fill"
              alt="post"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        )}

        <div className="relative mr-[27px] flex flex-1 flex-col space-y-[35px] rounded-[20px] border border-white/20 bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px]">
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[20px]">
            {view === "fan" ? (
              <>
                <Button
                  tag="button"
                  variant="pink"
                  className="w-auto !px-[30px] !py-2.5"
                  icon={<LockIcon width={24} height={24} />}
                >
                  Unlock for ${post.price || 0}
                </Button>
                <p className="mt-[17px] text-base font-medium">
                  UNLOCK 4 videos, 20 photos
                </p>
              </>
            ) : (
              <Image
                src="/pages/profile/post.png"
                layout="fill"
                alt="post"
                objectFit="cover"
                objectPosition="center"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-[5px]">
              <HeartIcon />
              <p className="text-xs font-medium leading-[14px] text-passes-gray-100">
                {post.numLikes}
              </p>
            </div>
            <div className="flex items-center space-x-[5px]">
              <DollarIcon />
              <p className="text-label">{post.price || 0}</p>
            </div>
          </div>
        </div>
        <div className="w-[248px] pt-3 pb-[70px]">
          <div className="flex items-center justify-between pl-0.5 pr-1.5">
            <div className="flex max-w-[80%] items-center space-x-2.5">
              {post.createdAt && (
                <span
                  className={cn("flex-shrink text-start text-xs text-white/50")}
                >
                  <TimeAgo date={post.createdAt} minPeriod={30} />
                </span>
              )}
              {view === "creator" && <PostStaticsButton />}
            </div>
            <button>
              <MenuIcon color="#868487" />
            </button>
          </div>
          <div className="mt-[50px] flex space-x-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/img/default-profile-img.png"
                layout="fill"
                alt="profile"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="mr-1.5 text-base font-medium leading-[22px]">
                  {post.displayName}
                </h4>
                <VerifiedIcon />
                <span className="ml-0.5 text-xs font-medium text-white/50">
                  Verified
                </span>
              </div>
              <p className="text-start text-xs font-medium leading-[22px] text-white/50">
                @{post.username}
              </p>
            </div>
          </div>
          <p className="mt-7 text-justify text-base font-medium">{post.text}</p>

          <div className="mt-8 flex items-center justify-between border-b border-[#727272] pb-6 text-xs font-medium leading-[15px] text-passes-gray-100">
            <div className="flex items-center space-x-1.5">
              <MessageIcon />
              <span>{post.numComments}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShareIcon />
              <span>338</span>
            </div>
          </div>

          <div className="mt-8 max-h-[380px] space-y-[34px] overflow-y-scroll">
            {data?.comments.map(({ commentId, commenterDisplayName, text }) => (
              <div key={commentId}>
                <div className="flex items-center space-x-3.5">
                  <span className="h-[30px] w-[30px] flex-shrink-0 rounded-full bg-[#BB5454]" />
                  <h6 className="text-sm font-medium leading-[22px]">
                    {commenterDisplayName}
                  </h6>
                </div>
                <p className="mt-2.5 text-start text-sm leading-6 text-white/60">
                  {text}
                </p>

                <button className="ml-auto mt-[-11px] flex items-center space-x-0.5">
                  <SharePinkIcon />
                  <span className="text-xs font-medium leading-[22px] text-passes-pink-100">
                    Reply
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ViewModal
