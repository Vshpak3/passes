import { PostCategoryDto } from "@passes/api-client"
import classNames from "classnames"
import EditIcon from "public/icons/edit-icon.svg"
import { FC, useState } from "react"

import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { EditPostCategoryDialog } from "src/components/molecules/post/EditPostCategoryDialog"
import { DeleteIcon } from "src/icons/DeleteIcon"
import { PostCategoryCachedProps } from "./PostCategoryCached"

interface PostCategoryProps extends PostCategoryCachedProps {
  postCategory: PostCategoryDto
}

export const PostCategory: FC<PostCategoryProps> = ({
  postCategory,
  onDelete,
  selected = false,
  onSelect
}) => {
  const [deletePostCategoryModalOpen, setDeletePostCategoryModalOpen] =
    useState(false)

  const [editPostCategoryModalOpen, setEditPostCategoryModalOpen] =
    useState(false)

  return (
    <div className="flex w-full flex-row justify-between border-[1px] border-passes-gray p-5">
      <div className="flex flex-row justify-between gap-[30px]">
        <span className="text-center text-[24px]">{postCategory.name}</span>
        <span className="text-center text-[24px]">{postCategory.count}</span>
      </div>
      {onSelect ? (
        <div
          className={classNames(
            "h-[18px] w-[18px] rounded-[9px] border-[1px] border-passes-gray hover:cursor-pointer",
            selected ? "bg-passes-pink-100" : "bg-black"
          )}
          onClick={() => onSelect(!selected)}
        />
      ) : (
        <div className="flex flex-row justify-between">
          <EditIcon
            className="mr-3 cursor-pointer"
            onClick={() => setEditPostCategoryModalOpen(true)}
          />
          <DeleteIcon
            className="mr-3 cursor-pointer"
            onClick={() => setDeletePostCategoryModalOpen(true)}
          />
        </div>
      )}
      {deletePostCategoryModalOpen && onDelete && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setDeletePostCategoryModalOpen(false)}
          onDelete={() => onDelete(postCategory.postCategoryId)}
          text="Remove"
        />
      )}
      {editPostCategoryModalOpen && (
        <EditPostCategoryDialog
          isOpen
          onCancel={() => setEditPostCategoryModalOpen(false)}
          postCategory={postCategory}
        />
      )}
    </div>
  )
}
