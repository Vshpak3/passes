import { PostDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import {
  BlockModal,
  FormContainer,
  ReportModal
} from "src/components/organisms"
import { PostPaymentProps } from "src/components/organisms/payment/PaymentProps"

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

interface PostProps extends PostPaymentProps {
  ownsProfile: boolean
  removePost?: (postId: string) => void
  userId: string | undefined
}

export const Post = ({
  cards,
  defaultPayinMethod,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ownsProfile,
  post,
  removePost,
  setIsPayed,
  userId
}: PostProps) => {
  const [postUnlocked, setPostUnlocked] = useState(!post.paywall)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
  const [currentPost, setCurrentPost] = useState<PostDto | null>(null)
  const [showcaseImg, setShowcaseImg] = useState<null | string>(null)

  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setUserReportModal(true)
    },
    {
      text: "Block",
      onClick: () => setUserBlockModal(true)
    },
    ...(post.userId === userId
      ? [
          {
            text: "Delete",
            onClick: () => {
              removePost && removePost(post.postId)
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
    <>
      {currentPost && (
        <PostViewModal
          cards={cards}
          defaultPayinMethod={defaultPayinMethod}
          dropdownItems={dropdownOptions}
          isOpen
          onClose={() => setCurrentPost(null)}
          post={currentPost}
          postUnlocked={!postUnlocked}
          setIsPayed={setIsPayed}
          showcaseImg={showcaseImg}
        />
      )}
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar post={post} dropdownItems={dropdownOptions} />
        <BlockModal
          isOpen={userBlockModal}
          setOpen={setUserBlockModal}
          userId={userId ?? ""}
        />
        <ReportModal
          isOpen={userReportModal}
          setOpen={setUserReportModal}
          userId={userId ?? ""}
        />
        <div className="cursor-pointer" onClick={() => setCurrentPost(post)}>
          <PostTextContent post={post} />
          {postUnlocked && <PostMedia post={post} />}
        </div>
        {!postUnlocked && (
          <LockedMedia
            cards={cards}
            defaultPayinMethod={defaultPayinMethod}
            post={post}
            setIsPayed={setIsPayed}
            setPostUnlocked={setPostUnlocked}
            showcaseImg={showcaseImg}
          />
        )}
        <PostEngagement
          cards={cards}
          defaultPayinMethod={defaultPayinMethod}
          post={post}
          postUnlocked={postUnlocked}
        />
      </FormContainer>
    </>
  )
}
