import { PostDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import {
  BlockModal,
  FormContainer,
  ReportModal
} from "src/components/organisms"
import { useUser } from "src/hooks"

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
  ownsProfile: boolean
  removePost?: (postId: string) => void
  setIsPayed?: (value: boolean) => void
}

export const Post = ({
  post,
  ownsProfile,
  removePost,
  setIsPayed
}: PostProps) => {
  const [postUnlocked, setPostUnlocked] = useState(!post.paywall)
  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)
  const [currentPost, setCurrentPost] = useState<PostDto | null>(null)
  const { user } = useUser()
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
    ...(post.userId === user?.id
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
          post={currentPost}
          isOpen
          onClose={() => setCurrentPost(null)}
          postUnlocked={!postUnlocked}
          dropdownItems={dropdownOptions}
          showcaseImg={showcaseImg}
        />
      )}
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar post={post} dropdownItems={dropdownOptions} />
        <BlockModal
          isOpen={userBlockModal}
          setOpen={setUserBlockModal}
          userId={user?.id ?? ""}
        />
        <ReportModal
          isOpen={userReportModal}
          setOpen={setUserReportModal}
          userId={user?.id ?? ""}
        />
        <div className="cursor-pointer" onClick={() => setCurrentPost(post)}>
          <PostTextContent post={post} />
          {!postUnlocked && (
            <LockedMedia
              post={post}
              setPostUnlocked={setPostUnlocked}
              setIsPayed={setIsPayed}
              showcaseImg={showcaseImg}
            />
          )}
          {postUnlocked && <PostMedia post={post} />}
        </div>
        <PostEngagement
          post={post}
          postUnlocked={postUnlocked}
          ownsProfile={ownsProfile}
        />
      </FormContainer>
    </>
  )
}
