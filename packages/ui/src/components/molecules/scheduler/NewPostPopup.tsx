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
      open={isOpen}
      onClose={onCancel}
      triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-8"
      className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
      onTriggerClick={() => onCancel()}
    >
      <NewPostEditor
        initialData={{ scheduledAt: selectionDate }}
        handleSavePost={handleSavePost}
        isExtended
        onClose={onCancel}
      />
    </Dialog>
  )
}
