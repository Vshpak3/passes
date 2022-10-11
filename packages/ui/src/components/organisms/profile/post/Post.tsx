import { PostApi } from "@passes/api-client"
import { toast } from "react-toastify"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import { FormContainer } from "src/components/organisms"
import { useBlockModal } from "src/hooks/useBlockModal"
import { usePostData } from "src/hooks/usePostData"
import { useReportModal } from "src/hooks/useReportModal"
import { useViewPostModal } from "src/hooks/useViewPostModal"

import { LockedMedia } from "./LockedMedia"
import { DropdownOption } from "./PostDropdown"
import { PostEngagement } from "./PostEngagement"
import PostMedia from "./PostMedia"
import { PostProfileAvatar } from "./PostProfileAvatar"
import { PostTextContent } from "./PostTextContent"

export const Post: React.FC = () => {
  const post = usePostData()
  const { setPost } = useViewPostModal()
  const { setIsReportModalOpen } = useReportModal()
  const { setIsBlockModalOpen } = useBlockModal()

  const { paywall, isRemoved, setIsRemoved } = post

  const dropdownOptions: DropdownOption[] = [
    {
      text: "Report",
      onClick: () => setIsReportModalOpen(true)
    },
    {
      text: "Block",
      onClick: () => setIsBlockModalOpen(true)
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
              if (setIsRemoved) {
                setIsRemoved(true)
              }
            }
          }
        ]
      : [])
  ]

  return (
    <ConditionRendering condition={!isRemoved}>
      <FormContainer className="!min-h-[10px] w-full rounded-[20px] border border-[#ffffff]/10 px-5 pt-5">
        <PostProfileAvatar dropdownOptions={dropdownOptions} />
        <div
          className="cursor-pointer"
          onClick={() => {
            setPost({ ...post, setIsRemoved })
          }}
        >
          <PostTextContent />
          {!paywall && <PostMedia />}
        </div>
        {paywall && <LockedMedia />}
        <PostEngagement />
      </FormContainer>
    </ConditionRendering>
  )
}
