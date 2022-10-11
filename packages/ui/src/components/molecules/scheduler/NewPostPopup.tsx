import { CreatePostRequestDto } from "@passes/api-client"
import { Dialog as NewPostDialog } from "src/components/organisms"
import { NewPost } from "src/components/organisms/profile/main-content/new-post/NewPost"
import { useCreatePost } from "src/hooks"

interface INewPostPopup {
  isOpen: boolean
  onCancel: () => void
  selectionDate: Date
}

const NewPostPopup: React.FC<INewPostPopup> = ({
  isOpen,
  onCancel,
  selectionDate
}) => {
  const { createPost } = useCreatePost()

  const handleCreatePost = (values: CreatePostRequestDto) => {
    createPost({ ...values })
    onCancel()
  }

  return (
    <NewPostDialog
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
    </NewPostDialog>
  )
}

export default NewPostPopup
