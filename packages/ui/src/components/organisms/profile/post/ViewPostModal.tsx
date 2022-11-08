import { PostDto } from "@passes/api-client"
import classnames from "classnames"
import MessageIcon from "public/icons/message-dots-square.svg"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import TimeAgo from "react-timeago"

import { ContentUnlockButton } from "src/components/atoms/button/ContentUnlockButton"
import { LikeButton } from "src/components/molecules/post/LikeButton"
import { TipButton } from "src/components/molecules/post/TipButton"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { Dialog } from "src/components/organisms/Dialog"
import {
  Dropdown,
  DropdownOption
} from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownCopyLink,
  DropDownGeneral,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { CommentFeed } from "src/components/organisms/profile/post/CommentFeed"
import { ContentService } from "src/helpers/content"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import {
  compactNumberFormatter,
  formatCurrency,
  formatText
} from "src/helpers/formatters"
import { plural } from "src/helpers/plural"
import { useBuyPostModal } from "src/hooks/context/useBuyPostModal"
import { usePost } from "src/hooks/profile/usePost"

interface ViewPostModalProps {
  post: PostDto & { setIsRemoved?: Dispatch<SetStateAction<boolean>> }
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ViewPostModal: FC<ViewPostModalProps> = ({ post, setPost }) => {
  const { images, video } = contentTypeCounter(post.contents)
  const { setPost: setBuyPost } = useBuyPostModal()
  // const { viewPostActiveIndex } = useViewPostModal()
  const { removePost } = usePost()

  const [imageToShow, setImageToShow] = useState<null | string>(null)

  // Set image if it exists in post
  useEffect(() => {
    if (post.contents?.[0]?.contentType === "image") {
      setImageToShow(ContentService.userContentMediaPath(post.contents[0]))
    }
  }, [post.contents])

  const postUnlocked = !post.purchasable

  const { isLiked, numLikes, postId, userId, username, displayName } = post
  const user = { userId, username, displayName }

  const dropdownOptions: DropdownOption[] = [
    ...DropDownReport(!post.isOwner, {
      username: username,
      userId: userId
    }),
    ...DropDownGeneral("Delete", post.isOwner, async () => {
      await removePost(postId)
      post.setIsRemoved?.(true)
      setPost(null)
    }),
    ...DropDownCopyLink(true, username, postId)
  ]

  return (
    <Dialog className="z-10" onClose={() => setPost(null)} open>
      <div className="relative flex max-h-screen min-h-[85vh] w-[90vw] max-w-[1285px] flex-col overflow-auto rounded-[15px] border border-white/[0.15] bg-[#12070E]/40 p-6 pl-5 backdrop-blur-3xl lg:flex-row">
        <div className="relative flex flex-1">
          {!postUnlocked && imageToShow && (
            <div className="absolute h-[80%] w-[80%] translate-x-[10%] translate-y-[10%] [filter:blur(15px)]">
              <img alt="post" src={imageToShow} />
            </div>
          )}
          <div className="relative mr-[27px] flex h-96 flex-1 flex-col space-y-[35px] rounded-[15px] border border-white/20 bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px] lg:h-auto">
            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[15px]">
              {postUnlocked &&
                post.contents &&
                post.contents.length === 1 &&
                imageToShow && <img alt="post" src={imageToShow} />}
              <div className="relative mt-3 flex h-[500px] w-[600px] flex-row items-center justify-center bg-transparent">
                {/* {postUnlocked && post.contents && post.contents.length > 1 && (
                  <ContentCarousel
                    contents={post.contents}
                    activeIndex={
                      (viewPostActiveIndex.current &&
                        viewPostActiveIndex.current[post.postId]) ||
                      0
                    }
                  />
                )} */}
              </div>
              {!postUnlocked && (
                <>
                  <ContentUnlockButton
                    className="w-auto !px-[30px] !py-2.5"
                    name={`Unlock Post For ${formatCurrency(post.price ?? 0)}`}
                    onClick={() => setBuyPost(post)}
                  />
                  <p className="mt-[17px] text-base font-medium">
                    <span>
                      UNLOCK {video ? `${plural("video", video)},` : ""}{" "}
                      {plural("photo", images)}!
                    </span>
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-between">
              <LikeButton
                isLiked={isLiked}
                numLikes={numLikes}
                postId={postId}
              />
              <TipButton post={post} />
            </div>
          </div>
        </div>
        <div className="w-full pt-3 pb-[70px] lg:w-[348px]">
          <div className="flex items-center justify-between pl-0.5 pr-1.5">
            <div className="flex max-w-[80%] items-center space-x-2.5">
              {post.createdAt && (
                <span
                  className={classnames(
                    "shrink text-start text-xs text-white/50"
                  )}
                >
                  <TimeAgo
                    date={post.createdAt}
                    key={post.postId}
                    minPeriod={30}
                  />
                </span>
              )}
              {/* {post.isOwner && (
                <PostStatisticsButton
                  numLikes={numLikes}
                  earningsPurchases={earningsPurchases}
                  createdAt={createdAt}
                  numPurchases={numPurchases}
                  numComments={numComments}
                  totalTipAmount={totalTipAmount}
                />
              )} */}
            </div>
            <Dropdown items={dropdownOptions} />
          </div>
          <div className="mt-[50px] flex space-x-4 overflow-x-hidden">
            <ProfileWidget user={user} />
          </div>
          <p className="passes-break mt-7 text-justify text-base font-medium">
            {formatText(post.text)}
          </p>
          <div className="mt-8 flex items-center justify-start space-x-1.5 border-b border-[#727272] pb-2 text-xs font-medium text-passes-gray-100">
            <MessageIcon />
            <span>{compactNumberFormatter(post.numComments)}</span>
          </div>
          <div className="max-h-[380px] overflow-auto">
            <CommentFeed
              // TODO: add this
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              decrementNumComments={() => {}}
              ownsPost={post.isOwner}
              postId={post.postId}
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
