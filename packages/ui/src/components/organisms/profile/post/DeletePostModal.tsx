import { GetCreatorStatsResponseDto, PostDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"
import { toast } from "react-toastify"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { usePost } from "src/hooks/profile/usePost"
import { KeyedMutator } from "swr"

interface DeletePostModalProps {
  post: PostDto | null
  onDelete: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
  mutateProfileStats?: KeyedMutator<GetCreatorStatsResponseDto>
}

export const DeletePostModal: FC<DeletePostModalProps> = ({
  post,
  onDelete,
  setOpen,
  mutateProfileStats
}) => {
  const { removePost } = usePost()

  const deletePost = async () => {
    if (!post) {
      return
    }
    try {
      await removePost(post.postId)
      if (mutateProfileStats) {
        await mutateProfileStats()
      }
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
