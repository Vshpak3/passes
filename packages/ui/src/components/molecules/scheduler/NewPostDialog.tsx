import { CreatePostRequestDto } from "@passes/api-client"
import { FC } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { NewPostEditor } from "src/components/organisms/profile/main-content/new-post/NewPostEditor"
import { useUpdatePost } from "src/hooks/profile/useUpdatePost"
import { useScheduledEvents } from "src/hooks/useScheduledEvents"

interface NewPostDialogProps {
  isOpen: boolean
  onCancel: () => void
  selectionDate?: Date
}

export const NewPostDialog: FC<NewPostDialogProps> = ({
  isOpen,
  onCancel,
  selectionDate
}) => {
  const { insertNewPost } = useScheduledEvents()

  const { createPost } = useUpdatePost()
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
