import { PostDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"
import { toast } from "react-toastify"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { usePost } from "src/hooks/profile/usePost"

interface DeletePostModalProps {
  post: PostDto | null
  onDelete: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const DeletePostModal: FC<DeletePostModalProps> = ({
  post,
  onDelete,
  setOpen
}) => {
  const { removePost } = usePost()

  const deletePost = async () => {
    if (!post) {
      return
    }
    try {
      await removePost(post.postId)
    } catch (error: any) {
      toast.error("Failed to delete. Please contact support.")
    }
  }

  const handleDelete = async () => {
    await deletePost()
    onDelete()
    toast.error("Deleted the post.")
    closeModal()
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <DeleteConfirmationModal
      onDelete={handleDelete}
      onCancel={closeModal}
      setOpen={closeModal}
      isOpen={true}
    />
  )
}
