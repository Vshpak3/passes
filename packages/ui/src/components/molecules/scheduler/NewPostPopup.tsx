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
      className="w-screen overflow-auto border-[0.5px] border-passes-gray-600 transition-all md:max-h-[70vh] md:max-w-[40%] lg:max-w-[40%]"
      onClose={onCancel}
      open={isOpen}
      transition={false}
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
