import { PostDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"
import { toast } from "react-toastify"

import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { useUpdatePost } from "src/hooks/profile/useUpdatePost"

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
  const { mutateManualCreatorStats } = useCreatorStats(post?.userId)
  const { removePost } = useUpdatePost()

  const deletePost = async () => {
    if (!post) {
      return
    }
    try {
      await removePost(post.postId)
      if (mutateManualCreatorStats) {
        await mutateManualCreatorStats({
          field: "numPosts",
          event: "decrement"
        })
      }
    } catch (error: unknown) {
      toast.error("Failed to delete. Please contact support.")
    }
  }

  const handleDelete = async () => {
    await deletePost()
    onDelete()
    toast.success("Deleted the post.")
  }

  return (
    <DeleteConfirmationModal
      isOpen
      onClose={() => setOpen(false)}
      onDelete={handleDelete}
    />
  )
}
