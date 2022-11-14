import { ScheduledEventDto } from "@passes/api-client"
import { FC } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { NewPostEditor } from "src/components/organisms/profile/main-content/new-post/NewPostEditor"
import { ContentFilesFromBare } from "src/hooks/useMedia"
import { useUpdateScheduledEvent } from "src/hooks/useUpdateScheduledEvent"

interface EditPostPopupProps {
  isOpen: boolean
  onCancel: () => void
  scheduledEvent: ScheduledEventDto
}

export const EditPostPopup: FC<EditPostPopupProps> = ({
  isOpen,
  onCancel,
  scheduledEvent
}) => {
  const { update } = useUpdateScheduledEvent()

  const { createPost, scheduledEventId, type, passes, contents } =
    scheduledEvent
  const { text, tags, previewIndex, expiresAt, price, scheduledAt } =
    createPost ?? {}

  return (
    <Dialog
      className="w-screen overflow-auto border-[0.5px] border-passes-gray-600 transition-all md:max-h-[70vh] md:max-w-[40%] lg:max-w-[40%]"
      onClose={onCancel}
      open={isOpen}
      transition={false}
    >
      <NewPostEditor
        handleSavePost={(editedPost) => {
          update({ scheduledEventId, createPost: editedPost, type })
        }}
        initialData={{
          text,
          tags,
          previewIndex,
          expiresAt,
          price: price?.toFixed(2) ?? "",
          isPaid: !!price,
          scheduledAt,
          files: ContentFilesFromBare(contents),
          passes
        }}
        isExtended
        onClose={onCancel}
        popup
        schedulable={false}
        showDefaultToast={false}
        title="Edit Post"
      />
    </Dialog>
  )
}
