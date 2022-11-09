import { CreatePostRequestDto } from "@passes/api-client"
import { FC } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { NewPostEditor } from "src/components/organisms/profile/main-content/new-post/NewPostEditor"
import { usePost } from "src/hooks/profile/usePost"
import { useScheduledEvents } from "src/hooks/useScheduledEvents"

interface NewPostPopupProps {
  isOpen: boolean
  onCancel: () => void
  selectionDate?: Date
}

export const NewPostPopup: FC<NewPostPopupProps> = ({
  isOpen,
  onCancel,
  selectionDate
}) => {
  const { insertNewPost } = useScheduledEvents()

  const { createPost } = usePost()
  const handleSavePost = async (post: CreatePostRequestDto) => {
    await createPost(post)
    insertNewPost(post)
    onCancel()
  }

  return (
    <Dialog
      className="h-screen w-screen overflow-hidden border-[1px] border-[#FFFFFF3b] transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
      onClose={onCancel}
      onTriggerClick={onCancel}
      open={isOpen}
      transition={false}
      triggerClassName="flex items-center justify-center self-center lg:pt-8"
    >
      <NewPostEditor
        handleSavePost={handleSavePost}
        initialData={{ scheduledAt: selectionDate }}
        isExtended
        onClose={onCancel}
        popup
      />
    </Dialog>
  )
}
