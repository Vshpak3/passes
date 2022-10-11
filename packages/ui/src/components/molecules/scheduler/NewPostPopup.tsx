import { FC } from "react"
import { Dialog } from "src/components/organisms/Dialog"
import { NewPost } from "src/components/organisms/profile/main-content/new-post/NewPost"

interface NewPostPopupProps {
  isOpen: boolean
  onCancel: () => void
  selectionDate: Date
}

export const NewPostPopup: FC<NewPostPopupProps> = ({
  isOpen,
  onCancel,
  selectionDate
}) => {
  const handleCreatePost = () => {
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
      <NewPost
        passes={[]}
        initialData={{ scheduledAt: selectionDate }}
        createPost={handleCreatePost}
        placeholder="What's on your mind?"
        isExtended
      />
    </Dialog>
  )
}
