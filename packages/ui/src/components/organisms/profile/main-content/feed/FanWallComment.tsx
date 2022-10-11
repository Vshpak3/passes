import { FanWallApi, FanWallCommentDto } from "@passes/api-client"
import { FC, useState } from "react"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import {
  BlockModal,
  FormContainer,
  ReportModal
} from "src/components/organisms"
import { PostProfileAvatar } from "src/components/organisms/profile/post/PostProfileAvatar"
import { usePostData } from "src/hooks/usePostData"

interface FanWallCommentProps {
  removable: boolean
  comment: FanWallCommentDto
  ownsProfile: boolean
}

export const FanWallComment: FC<FanWallCommentProps> = ({
  ownsProfile,
  comment,
  removable
}) => {
  const postData = usePostData()
  const api = new FanWallApi()

  const [userBlockModal, setUserBlockModal] = useState(false)
  const [userReportModal, setUserReportModal] = useState(false)

  const [removed, setRemoved] = useState<boolean>(false)
  const dropdownItems = [
    {
      text: "Report",
      onClick: () => setUserReportModal(true)
    },
    {
      text: "Block",
      onClick: () => setUserBlockModal(true)
    },
    ...(ownsProfile || comment.isOwner
      ? [
          {
            text: "Delete comment",
            onClick: async () => {
              await api.deleteFanWallComment({
                fanWallCommentId: comment.fanWallCommentId
              })
              if (removable) {
                setRemoved(true)
              }
            }
          }
        ]
      : []), //TODO: add unhide
    ...(ownsProfile && !comment.isOwner
      ? [
          {
            text: "Hide comment",
            onClick: async () => {
              await api.hideFanWallComment({
                fanWallCommentId: comment.fanWallCommentId
              })
            }
          }
        ]
      : [])
  ]
  return (
    <ConditionRendering condition={!removed}>
      {userBlockModal && (
        <BlockModal
          isOpen={userBlockModal}
          setOpen={setUserBlockModal}
          userId={""} // TODO: fix
        />
      )}
      {userReportModal && (
        <ReportModal
          isOpen={userReportModal}
          setOpen={setUserReportModal}
          userId={""} // TODO: fix
        />
      )}
      <FormContainer className="!min-h-[10px] rounded-[20px] border border-[#ffffff]/10 px-5 pt-5 backdrop-blur-[100px]">
        <PostProfileAvatar
          post={postData}
          dropdownItems={dropdownItems}
          hideStaticsBtn
        />
        <div className="flex flex-col items-start">
          <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
            {postData.text}
          </p>
        </div>
      </FormContainer>
    </ConditionRendering>
  )
}
