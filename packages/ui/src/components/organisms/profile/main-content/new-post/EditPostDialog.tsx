import { PostDto } from "@passes/api-client"
import { FC } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { NewPostEditor } from "src/components/organisms/profile/main-content/new-post/NewPostEditor"
import { usePost } from "src/hooks/entities/usePost"
import { useCreatorPasses } from "src/hooks/passes/useCreatorPasses"
import { ContentFilesFromBare } from "src/hooks/useMedia"

interface EditPostDialogProps {
  onCancel: () => void
  post: PostDto
}

export const EditPostDialog: FC<EditPostDialogProps> = ({ onCancel, post }) => {
  const { passes } = useCreatorPasses(post.userId)
  const { update, editPost } = usePost(post.postId)
  const { text, tags, previewIndex, expiresAt, price, contents, passIds } = post
  const passSet = new Set(passIds)

  return (
    <Dialog
      className="w-screen overflow-auto border-[0.5px] border-passes-gray-600 transition-all md:max-h-[70vh] md:max-w-[70%] lg:max-w-[40%]"
      onClose={onCancel}
      open
      transition={false}
    >
      <NewPostEditor
        canEditPasses={false}
        handleSavePost={(editedPost, contents, _passes, newContent) => {
          editPost({ ...editedPost, postId: post.postId })
          update({
            ...editedPost,
            contents,
            contentProcessed: !newContent
          })
        }}
        initialData={{
          text,
          tags,
          previewIndex,
          expiresAt,
          price: price?.toFixed(2) ?? "",
          isPaid: !!price,
          files: ContentFilesFromBare(contents),
          passes: passes?.filter((pass) => passSet.has(pass.passId))
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
