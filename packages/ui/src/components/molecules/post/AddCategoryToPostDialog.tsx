import { yupResolver } from "@hookform/resolvers/yup"
import { PostCategoryDto } from "@passes/api-client"
import { FC } from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Dialog } from "src/components/organisms/Dialog"
import { PostCategoryCached } from "src/components/pages/tools/PostCategoryCached"
import { usePostCategories } from "src/hooks/posts/usePostCategories"
import { NewCategoryForm, newCategoryForm } from "./NewPostCategoryDialog"

interface AddCategoryToPostDialogProps {
  selectedPostCategories: PostCategoryDto[]
  postId: string
  onCancel: () => void
  userId: string
}

export const AddCategoryToPostDialog: FC<AddCategoryToPostDialogProps> = ({
  selectedPostCategories,
  postId,
  onCancel,
  userId
}) => {
  const { addCategory, postCategories } = usePostCategories(userId)
  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewCategoryForm>({
    resolver: yupResolver(newCategoryForm)
  })
  const onSubmit = async (values: NewCategoryForm) => {
    await addCategory(values.name)
  }

  return (
    <Dialog
      className="w-screen overflow-auto border-[0.5px] border-passes-gray bg-passes-black p-5 transition-all md:max-h-[70vh] md:max-w-[40%] lg:max-w-[40%]"
      onClose={onCancel}
      open
      transition={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-h-[50vh] overflow-y-auto">
          {postCategories?.map((postCategory) => (
            <PostCategoryCached
              key={postCategory.postCategoryId}
              postCategory={postCategory}
              postId={postId}
              selected={selectedPostCategories.some(
                (selectedPostCategory) =>
                  selectedPostCategory.postCategoryId ===
                  postCategory.postCategoryId
              )}
            />
          ))}
        </div>
        <Button
          className="mt-4 w-full text-[16px] font-[500]"
          onClick={onCancel}
        >
          Done
        </Button>
        <Input
          className="mt-4 hidden w-full px-4"
          errors={errors}
          name="name"
          placeholder="Category Name"
          register={register}
          type="text"
        />
        <Button
          className="mt-4 hidden w-full text-[16px] font-[500]"
          type={ButtonTypeEnum.SUBMIT}
        >
          {isSubmitting ? "Saving ..." : "Add"}
        </Button>
      </form>
    </Dialog>
  )
}
