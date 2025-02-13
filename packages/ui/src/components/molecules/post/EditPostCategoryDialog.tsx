import { yupResolver } from "@hookform/resolvers/yup"
import { PostCategoryDto } from "@passes/api-client"
import { POST_CATEGORY_NAME_LENGTH } from "@passes/shared-constants"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { SectionTitle } from "src/components/atoms/SectionTitle"
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
      className="w-full border border-white/10 bg-passes-black px-6 py-5 md:w-[400px] md:rounded-lg"
      onClose={onCancel}
      open={isOpen}
      transition={false}
    >
      <SectionTitle>Edit Post Category</SectionTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          className="mt-4 w-full px-4"
          errors={errors}
          name="name"
          placeholder="Category Name"
          register={register}
          type="text"
        />
        <div className="mt-[30px] flex flex-row justify-end gap-[20px]">
          <Button
            className="bg-[#c943a81a] !py-[10px] !px-[18px] font-bold text-[#C943A8]"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#C943A8] !py-[10px] !px-[18px] font-bold text-white"
            type={ButtonTypeEnum.SUBMIT}
          >
            {isSubmitting ? "Saving ..." : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
