import { PostApi } from "@passes/api-client"
import { PostDto } from "@passes/api-client/src/models/PostDto"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import {
  BlockModal,
  FormContainer,
  ReportModal
} from "src/components/organisms"
import BuyPostModal from "src/components/organisms/payment/BuyPostModal"

import { LockedMedia } from "./LockedMedia"
import { PostEngagement } from "./PostEngagement"
import PostMedia from "./PostMedia"
import { PostProfileAvatar } from "./PostProfileAvatar"
import { PostTextContent } from "./PostTextContent"

const PostViewModal = dynamic(
  () => import("src/components/organisms/profile/post/ViewModal"),
  { ssr: false }
)

export interface DropdownOption {
  readonly text: string
  readonly onClick: () => void
}

interface PostProps {
  post: PostDto
  removable?: boolean
}

export const Post = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  post,
  removable
}: PostProps) => {
  const [currentPost, setCurrentPost] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [postUnlocked, setPostUnlocked] = useState(!post.paywall)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
  const [showcaseImg, setShowcaseImg] = useState<null | string>(null)
  const [openBuyPostModal, setOpenBuyPostModal] = useState<boolean>(false)
  const [removed, setRemoved] = useState<boolean>(false)
  //TODO: grab whether or not you are currentl paying for post from global pending payments hook
  // const [isPayin, setIsPayin] = useState(false)

  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setUserReportModal(true)
    },
    {
      text: "Block",
      onClick: () => setUserBlockModal(true)
    },
    ...(post.isOwner
      ? [
          {
            text: "Delete",
            onClick: async () => {
              const api = new PostApi()
              await api
                .removePost({ postId: post.postId })
                .catch((error) => toast(error))
              if (removable) {
                setRemoved(true)
              }
            }
          }
        ]
      : [])
  ]

  // Set image if it exists in post
  useEffect(() => {
    if (post.content?.[0]?.contentType === "image") {
      setShowcaseImg(post.content[0].signedUrl as string)
    }
  }, [post.content])

  return (
    <ConditionRendering condition={!removed}>
      {currentPost && openBuyPostModal && (
        <PostViewModal
          dropdownItems={dropdownOptions}
          isOpen
          onClose={() => setCurrentPost(false)}
          post={post}
          postUnlocked={!postUnlocked} // TODO: change
          showcaseImg={showcaseImg}
          setOpenBuyPostModal={setOpenBuyPostModal}
        />
      )}
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar post={post} dropdownItems={dropdownOptions} />
        <BlockModal
          isOpen={userBlockModal}
          setOpen={setUserBlockModal}
          userId={post.userId ?? ""}
        />
        <ReportModal
          isOpen={userReportModal}
          setOpen={setUserReportModal}
          userId={post.userId ?? ""}
        />
        <div className="cursor-pointer" onClick={() => setCurrentPost(true)}>
          <PostTextContent post={post} />
          {postUnlocked && <PostMedia post={post} />}
        </div>
        {!postUnlocked && (
          <LockedMedia
            post={post}
            showcaseImg={showcaseImg}
            setOpenBuyPostModal={setOpenBuyPostModal}
          />
        )}
        <PostEngagement post={post} postUnlocked={postUnlocked} />
        {!openBuyPostModal && (
          <BuyPostModal
            isOpen={openBuyPostModal}
            post={post}
            setOpen={setOpenBuyPostModal}
          />
        )}
      </FormContainer>
    </ConditionRendering>
  )
}
