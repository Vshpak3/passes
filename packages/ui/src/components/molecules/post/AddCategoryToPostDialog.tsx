import { yupResolver } from "@hookform/resolvers/yup"
import { PostCategoryDto } from "@passes/api-client"
import { FC } from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Dialog } from "src/components/organisms/Dialog"
import { PostCategoryCached } from "src/components/pages/tools/PostCategoryCached"
import { usePostCategories } from "src/hooks/posts/usePostCategories"
import { usePostToCategories } from "src/hooks/posts/usePostToCategories"
import { useUser } from "src/hooks/useUser"
import { NewCategoryForm, newCategoryForm } from "./NewPostCategoryDialog"

interface AddCategoryToPostDialogProps {
  selectedPostCategories: PostCategoryDto[]
  postId: string
  isOpen: boolean
  onCancel: () => void
}

export const AddCategoryToPostDialog: FC<AddCategoryToPostDialogProps> = ({
  selectedPostCategories,
  postId,
  isOpen,
  onCancel
}) => {
  const { user } = useUser()
  const { addCategory, postCategories } = usePostCategories(user?.userId ?? "")
  const { addPostToCategory, removePostFromCategory } =
    usePostToCategories(postId)
  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewCategoryForm>({
    resolver: yupResolver(newCategoryForm)
  })
  const onSubmit = async (values: NewCategoryForm) => {
    if (await addCategory(values.name)) {
      onCancel()
    }
  }

  return (
    <Dialog
      className="w-screen overflow-auto border-[0.5px] border-passes-gray-600 p-5 transition-all md:max-h-[70vh] md:max-w-[40%] lg:max-w-[40%]"
      onClose={onCancel}
      open={isOpen}
      transition={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-h-[50vh] overflow-y-auto">
          {postCategories?.map((postCategory) => (
            <PostCategoryCached
              key={postCategory.postCategoryId}
              onSelect={async (selected: boolean) => {
                if (selected) {
                  await addPostToCategory(postCategory)
                } else {
                  await removePostFromCategory(postCategory)
                }
              }}
              postCategory={postCategory}
              selected={selectedPostCategories.some(
                (selectedPostCategory) =>
                  selectedPostCategory.postCategoryId ===
                  postCategory.postCategoryId
              )}
            />
          ))}
        </div>
        <Input
          className="mt-4 w-full px-4"
          errors={errors}
          name="name"
          placeholder="Category Name"
          register={register}
          type="text"
        />
        <Button
          className="mt-4 w-full text-[16px] font-[500]"
          type={ButtonTypeEnum.SUBMIT}
        >
          {isSubmitting ? "Saving ..." : "Add"}
        </Button>
      </form>
    </Dialog>
  )
}
