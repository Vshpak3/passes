import { yupResolver } from "@hookform/resolvers/yup"
import { PostCategoryDto } from "@passes/api-client"
import { POST_CATEGORY_NAME_LENGTH } from "@passes/shared-constants"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Dialog } from "src/components/organisms/Dialog"
import { usePostCategory } from "src/hooks/entities/usePostCategory"

interface EditPostCategoryDialogProps {
  postCategory: PostCategoryDto
  isOpen: boolean
  onCancel: () => void
}

interface EditCategoryForm {
  name: string
}
const newCategoryForm = object({
  name: string()
    .required("Name is required")
    .max(
      POST_CATEGORY_NAME_LENGTH,
      `The name cannot be longer than ${POST_CATEGORY_NAME_LENGTH} characters`
    )
})

export const EditPostCategoryDialog: FC<EditPostCategoryDialogProps> = ({
  postCategory,
  isOpen,
  onCancel
}) => {
  const { editCategory } = usePostCategory(postCategory.postCategoryId)
  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditCategoryForm>({
    defaultValues: { name: postCategory.name },
    resolver: yupResolver(newCategoryForm)
  })
  const onSubmit = async (values: EditCategoryForm) => {
    if (await editCategory(values.name)) {
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
          {isSubmitting ? "Saving ..." : "Save"}
        </Button>
      </form>
    </Dialog>
  )
}
