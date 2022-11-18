import { yupResolver } from "@hookform/resolvers/yup"
import { POST_CATEGORY_NAME_LENGTH } from "@passes/shared-constants"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Dialog } from "src/components/organisms/Dialog"
import { usePostCategories } from "src/hooks/posts/usePostCategories"
import { useUser } from "src/hooks/useUser"

interface NewPostCategoryDialogProps {
  isOpen: boolean
  onCancel: () => void
}

export interface NewCategoryForm {
  name: string
}
export const newCategoryForm = object({
  name: string()
    .required("Name is required")
    .max(
      POST_CATEGORY_NAME_LENGTH,
      `The name cannot be longer than ${POST_CATEGORY_NAME_LENGTH} characters`
    )
})

export const NewPostCategoryDialog: FC<NewPostCategoryDialogProps> = ({
  isOpen,
  onCancel
}) => {
  const { user } = useUser()
  const { addCategory } = usePostCategories(user?.userId ?? "")
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
